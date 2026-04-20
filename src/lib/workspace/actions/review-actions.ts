"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapReviewThread,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import {
  workspaceCommentSchema,
  workspaceDecisionSchema,
} from "@/lib/validation/workspace-review";
import { deriveCampaignReviewState } from "@/lib/workspace/review/state";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type ReviewMutationResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

type ReviewMutationContext =
  | {
      error: string;
    }
  | {
      supabase: ReturnType<typeof requireServiceRoleClient>;
      bootstrap: Awaited<ReturnType<typeof requireWorkspaceAccess>>;
      asset: {
        id: string;
        campaignId: string;
        reviewStatus: string;
        organizationId: string;
      };
    };

async function getReviewMutationContext(
  campaignId: string,
  assetId: string,
): Promise<ReviewMutationContext> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canReviewAssets) {
    return {
      error: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Du hast keine Berechtigung, Kampagnen-Assets zu reviewen.",
    };
  }

  const supabase = requireServiceRoleClient();

  const [{ data: campaignRow, error: campaignError }, { data: assetRow, error: assetError }] =
    await Promise.all([
      supabase.from("campaigns").select("*").eq("id", campaignId).limit(1).maybeSingle(),
      supabase.from("assets").select("*").eq("id", assetId).limit(1).maybeSingle(),
    ]);

  assertSupabaseResult(campaignError, "Failed to load review campaign");
  assertSupabaseResult(assetError, "Failed to load review asset");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;
  const assetData = assetRow ? mapAsset(assetRow) : null;
  const asset =
    campaign && assetData && assetData.campaignId === campaign.id
      ? {
          id: assetData.id,
          campaignId: assetData.campaignId,
          reviewStatus: assetData.reviewStatus,
          organizationId: campaign.organizationId,
        }
      : null;

  if (!asset || asset.organizationId !== bootstrap.organization.id) {
    return {
      error: "Dieses Review-Ziel ist im aktuellen Workspace nicht verfügbar.",
    };
  }

  return {
    supabase,
    bootstrap,
    asset,
  } as const;
}

async function getOrCreateThread(
  supabase: ReturnType<typeof requireServiceRoleClient>,
  assetId: string,
  createdBy: string,
) {
  const { data: threadRows, error: existingThreadError } = await supabase
    .from("review_threads")
    .select("*")
    .eq("asset_id", assetId)
    .is("resolved_at", null)
    .limit(1);

  assertSupabaseResult(existingThreadError, "Failed to load review thread");

  const existingThread = threadRows?.[0] ? mapReviewThread(threadRows[0]) : null;

  if (existingThread) {
    return existingThread;
  }

  const { data: threadRow, error: threadInsertError } = await supabase
    .from("review_threads")
    .insert({
      asset_id: assetId,
      created_by: createdBy,
      anchor_json: null,
    })
    .select("*")
    .single();

  assertSupabaseResult(threadInsertError, "Failed to create review thread");

  if (!threadRow) {
    throw new Error("Failed to create review thread: missing inserted row.");
  }

  return mapReviewThread(threadRow);
}

async function syncCampaignReviewState(
  supabase: ReturnType<typeof requireServiceRoleClient>,
  campaignId: string,
) {
  const { data: campaignAssetRows, error: campaignAssetsError } = await supabase
    .from("assets")
    .select("*")
    .eq("campaign_id", campaignId);

  assertSupabaseResult(campaignAssetsError, "Failed to sync review state");

  const campaignAssets = (campaignAssetRows ?? []).map(mapAsset);

  const derived = deriveCampaignReviewState(
    campaignAssets.map((asset) => asset.reviewStatus),
  );

  const { error: campaignUpdateError } = await supabase
    .from("campaigns")
    .update({
      current_stage: derived.currentStage,
    })
    .eq("id", campaignId);

  assertSupabaseResult(campaignUpdateError, "Failed to update campaign stage");

  const { error: inReviewUpdateError } = await supabase
    .from("campaign_stages")
    .update({
      status: derived.inReviewStatus,
      completed_at:
        derived.inReviewStatus === "completed" ? new Date().toISOString() : null,
      started_at:
        derived.inReviewStatus === "in_progress" ? new Date().toISOString() : null,
    })
    .eq("campaign_id", campaignId)
    .eq("stage_key", "in_review");

  assertSupabaseResult(inReviewUpdateError, "Failed to update in-review stage");

  const { error: approvedUpdateError } = await supabase
    .from("campaign_stages")
    .update({
      status: derived.approvedStatus,
      started_at:
        derived.approvedStatus === "in_progress" ? new Date().toISOString() : null,
      completed_at: null,
    })
    .eq("campaign_id", campaignId)
    .eq("stage_key", "approved");

  assertSupabaseResult(approvedUpdateError, "Failed to update approved stage");

  const { error: handoverUpdateError } = await supabase
    .from("campaign_stages")
    .update({
      status: derived.handoverReadyStatus,
      started_at: null,
      completed_at: null,
    })
    .eq("campaign_id", campaignId)
    .eq("stage_key", "handover_ready");

  assertSupabaseResult(handoverUpdateError, "Failed to update handover stage");

  const workflowPatch =
    derived.currentStage === "approved"
      ? ({
          workflow_status: "handover",
          review_status: "approved",
          delivery_status: "preparing",
          commercial_status: "ready_for_pilot",
        } as const)
      : ({
          workflow_status: "review",
          review_status:
            derived.inReviewStatus === "in_progress" ? "in_review" : "not_ready",
          delivery_status: "not_ready",
          commercial_status: "not_ready",
        } as const);

  const { error: workflowUpdateError } = await supabase
    .from("campaign_workflows")
    .upsert(
      {
        campaign_id: campaignId,
        ...workflowPatch,
        last_transition_at: new Date().toISOString(),
      },
      {
        onConflict: "campaign_id",
      },
    );

  assertSupabaseResult(workflowUpdateError, "Failed to update campaign workflow state");
}

function revalidateReviewPaths(campaignId: string) {
  for (const path of brandsWorkspaceRoutes.revalidation({ campaignId })) {
    revalidatePath(path);
  }
}

export async function addReviewComment(
  campaignId: string,
  assetId: string,
  body: string,
): Promise<ReviewMutationResult> {
  const parsed = workspaceCommentSchema.safeParse({
    body,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte ergänze eine konkretere Review-Notiz, bevor du speicherst.",
    };
  }

  const context = await getReviewMutationContext(campaignId, assetId);

  if ("error" in context && context.error) {
    return {
      success: false,
      message: context.error,
    };
  }

  const executionContext = context as Exclude<ReviewMutationContext, { error: string }>;

  const thread = await getOrCreateThread(
    executionContext.supabase,
    assetId,
    executionContext.bootstrap.membership.role,
  );

  const { error: commentInsertError } = await executionContext.supabase.from("comments").insert({
    thread_id: thread.id,
    author_id: executionContext.bootstrap.membership.role,
    body: parsed.data.body,
    comment_type: "comment",
  });

  assertSupabaseResult(commentInsertError, "Failed to add review comment");

  revalidateReviewPaths(campaignId);

  return {
    success: true,
    message: "Review-Notiz gespeichert.",
  };
}

export async function applyReviewDecision(
  campaignId: string,
  assetId: string,
  input: {
    decision: "approved" | "changes_requested";
    note?: string;
  },
): Promise<ReviewMutationResult> {
  const parsed = workspaceDecisionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Diese Review-Entscheidung ist ungültig.",
    };
  }

  const context = await getReviewMutationContext(campaignId, assetId);

  if ("error" in context && context.error) {
    return {
      success: false,
      message: context.error,
    };
  }

  const executionContext = context as Exclude<ReviewMutationContext, { error: string }>;

  const decision = parsed.data.decision;
  const reviewStatus = decision;
  const commentBody =
    parsed.data.note.trim().length > 0
      ? parsed.data.note
      : decision === "approved"
        ? "Im Review freigegeben."
        : "Im Review zur Überarbeitung markiert.";

  const thread = await getOrCreateThread(
    executionContext.supabase,
    assetId,
    executionContext.bootstrap.membership.role,
  );

  const { error: commentInsertError } = await executionContext.supabase.from("comments").insert({
    thread_id: thread.id,
    author_id: executionContext.bootstrap.membership.role,
    body: commentBody,
    comment_type: decision === "approved" ? "approval_note" : "change_request",
  });

  assertSupabaseResult(commentInsertError, "Failed to save review decision");

  const { error: assetUpdateError } = await executionContext.supabase
    .from("assets")
    .update({
      review_status: reviewStatus,
    })
    .eq("id", assetId);

  assertSupabaseResult(assetUpdateError, "Failed to update asset review status");

  const { data: assetThreadRows, error: assetThreadsError } = await executionContext.supabase
    .from("review_threads")
    .select("*")
    .eq("asset_id", assetId);

  assertSupabaseResult(assetThreadsError, "Failed to load asset threads");

  const assetThreadIds = (assetThreadRows ?? []).map((threadRow: { id: string }) => threadRow.id);

  if (decision === "approved") {
    if (assetThreadIds.length > 0) {
      const { error: resolveThreadsError } = await executionContext.supabase
        .from("review_threads")
        .update({
          resolved_at: new Date().toISOString(),
        })
        .in("id", assetThreadIds);

      assertSupabaseResult(resolveThreadsError, "Failed to resolve review threads");
    }
  } else {
    const { error: reopenThreadError } = await executionContext.supabase
      .from("review_threads")
      .update({
        resolved_at: null,
      })
      .eq("id", thread.id);

    assertSupabaseResult(reopenThreadError, "Failed to reopen review thread");
  }

  await syncCampaignReviewState(executionContext.supabase, campaignId);
  revalidateReviewPaths(campaignId);

  return {
    success: true,
    message:
      decision === "approved"
        ? "Asset freigegeben."
        : "Änderungswunsch gespeichert.",
  };
}
