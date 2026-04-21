"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  mapBrief,
  mapCampaign,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { serializeBriefReferences } from "@/lib/workspace/briefs/form-helpers";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  deriveOpsWorkflowStageState,
  opsStageOrder,
} from "@/lib/workspace/ops-workflow-state";
import { workspaceBriefSchema, type WorkspaceBriefInput } from "@/lib/validation/workspace-brief";

type SubmitCampaignRequestResult =
  | {
      success: true;
      message: string;
      briefId: string;
      campaignId: string;
    }
  | {
      success: false;
      message: string;
    };

const initialWorkflowState = {
  workflowStatus: "setup" as const,
  reviewStatus: "not_ready" as const,
  deliveryStatus: "not_ready" as const,
  commercialStatus: "not_ready" as const,
};

async function saveSubmittedBrief(params: {
  organizationId: string;
  userId: string;
  input: WorkspaceBriefInput;
  briefId?: string | null;
}) {
  const supabase = requireServiceRoleClient();
  const timestamp = new Date().toISOString();

  if (params.briefId) {
    const { data: existingRow, error: existingError } = await supabase
      .from("briefs")
      .select("*")
      .eq("id", params.briefId)
      .limit(1)
      .maybeSingle();

    assertSupabaseResult(existingError, "Failed to load campaign request brief");

    const existing = existingRow ? mapBrief(existingRow) : null;

    if (!existing || existing.organizationId !== params.organizationId) {
      throw new Error("Dieses Briefing ist im aktuellen Workspace nicht verfügbar.");
    }

    const { error: updateError } = await supabase
      .from("briefs")
      .update({
        title: params.input.title,
        objective: params.input.objective,
        offer: params.input.offer,
        audience: params.input.audience,
        channels: params.input.channels,
        references_json: serializeBriefReferences(params.input),
        budget_range: params.input.budgetRange,
        timeline: params.input.timeline,
        approval_notes: params.input.approvalNotes,
        status: "submitted",
        submitted_at: timestamp,
      })
      .eq("id", params.briefId);

    assertSupabaseResult(updateError, "Failed to submit campaign request brief");

    return params.briefId;
  }

  const { data: createdRow, error: createError } = await supabase
    .from("briefs")
    .insert({
      organization_id: params.organizationId,
      created_by: params.userId,
      title: params.input.title,
      objective: params.input.objective,
      offer: params.input.offer,
      audience: params.input.audience,
      channels: params.input.channels,
      references_json: serializeBriefReferences(params.input),
      budget_range: params.input.budgetRange,
      timeline: params.input.timeline,
      approval_notes: params.input.approvalNotes,
      status: "submitted",
      submitted_at: timestamp,
    })
    .select("*")
    .single();

  assertSupabaseResult(createError, "Failed to create campaign request brief");

  if (!createdRow) {
    throw new Error("Failed to create campaign request brief: missing inserted row.");
  }

  return mapBrief(createdRow).id;
}

async function ensureCampaignForBrief(params: {
  organizationId: string;
  briefId: string;
  title: string;
  objective: string;
}) {
  const supabase = requireServiceRoleClient();

  const { data: existingCampaignRow, error: existingCampaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brief_id", params.briefId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(existingCampaignError, "Failed to load campaign for brief");

  if (existingCampaignRow) {
    const existingCampaign = mapCampaign(existingCampaignRow);

    const { error: updateCampaignError } = await supabase
      .from("campaigns")
      .update({
        name: params.title,
        campaign_goal: params.objective,
      })
      .eq("id", existingCampaign.id);

    assertSupabaseResult(updateCampaignError, "Failed to update campaign request");
    return existingCampaign.id;
  }

  const { currentStage, statuses } = deriveOpsWorkflowStageState(initialWorkflowState);

  const { data: campaignRow, error: campaignInsertError } = await supabase
    .from("campaigns")
    .insert({
      organization_id: params.organizationId,
      brief_id: params.briefId,
      name: params.title,
      current_stage: currentStage,
      package_tier: "starter",
      campaign_goal: params.objective,
      seeded_template_key: null,
    })
    .select("*")
    .single();

  assertSupabaseResult(campaignInsertError, "Failed to create campaign request");

  if (!campaignRow) {
    throw new Error("Failed to create campaign request: missing inserted row.");
  }

  const campaign = mapCampaign(campaignRow);
  const timestamp = new Date().toISOString();

  const { error: stageInsertError } = await supabase.from("campaign_stages").insert(
    opsStageOrder.map((stageKey, index) => {
      const status = statuses.get(stageKey) ?? "pending";

      return {
        campaign_id: campaign.id,
        stage_key: stageKey,
        stage_order: index + 1,
        status,
        started_at: status === "in_progress" || status === "completed" ? timestamp : null,
        completed_at: status === "completed" ? timestamp : null,
      };
    }),
  );

  assertSupabaseResult(stageInsertError, "Failed to create campaign request stages");

  const { error: workflowInsertError } = await supabase
    .from("campaign_workflows")
    .upsert(
      {
        campaign_id: campaign.id,
        workflow_status: initialWorkflowState.workflowStatus,
        review_status: initialWorkflowState.reviewStatus,
        delivery_status: initialWorkflowState.deliveryStatus,
        commercial_status: initialWorkflowState.commercialStatus,
        last_transition_at: timestamp,
      },
      { onConflict: "campaign_id" },
    );

  assertSupabaseResult(workflowInsertError, "Failed to create campaign request workflow");

  return campaign.id;
}

export async function submitCampaignRequest(
  input: WorkspaceBriefInput,
  briefId?: string | null,
): Promise<SubmitCampaignRequestResult> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canCreateBriefs) {
    return {
      success: false,
      message: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Nur Workspace-Admins können eine Kampagnenanfrage einreichen.",
    };
  }

  const parsed = workspaceBriefSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message:
        "Bitte vervollständige alle Pflichtfelder, bevor du die Kampagnenanfrage einreichst.",
    };
  }

  try {
    const savedBriefId = await saveSubmittedBrief({
      organizationId: bootstrap.organization.id,
      userId: bootstrap.membership.userId,
      input: parsed.data,
      briefId,
    });

    const campaignId = await ensureCampaignForBrief({
      organizationId: bootstrap.organization.id,
      briefId: savedBriefId,
      title: parsed.data.title,
      objective: parsed.data.objective,
    });

    for (const path of brandsWorkspaceRoutes.revalidation({
      briefId: savedBriefId,
      campaignId,
    })) {
      revalidatePath(path);
    }

    return {
      success: true,
      message: "Kampagnenanfrage eingereicht. Das Setup kann jetzt geprüft werden.",
      briefId: savedBriefId,
      campaignId,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Die Kampagnenanfrage konnte gerade nicht eingereicht werden.",
    };
  }
}
