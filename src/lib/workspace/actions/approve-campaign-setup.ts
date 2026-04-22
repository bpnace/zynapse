"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import type { CampaignStageStatus } from "@/lib/workspace/data/types";
import {
  assertSupabaseResult,
  mapCampaign,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import {
  deriveOpsWorkflowStageState,
  opsStageOrder,
} from "@/lib/workspace/ops-workflow-state";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

const approvedSetupWorkflowState = {
  workflowStatus: "production" as const,
  reviewStatus: "not_ready" as const,
  deliveryStatus: "not_ready" as const,
  commercialStatus: "not_ready" as const,
};

function revalidateBrandSurface(campaignId: string, briefId?: string | null) {
  for (const path of brandsWorkspaceRoutes.revalidation({ campaignId, briefId })) {
    revalidatePath(path);
  }
}

export async function approveCampaignSetup(campaignId: string, formData?: FormData) {
  void formData;
  const bootstrap = await requireWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canCreateBriefs) {
    redirect(brandsWorkspaceRoutes.campaigns.setup(campaignId));
  }

  const supabase = requireServiceRoleClient();
  const [{ data: campaignRow, error: campaignError }, { data: workflowRow, error: workflowError }] =
    await Promise.all([
      supabase.from("campaigns").select("*").eq("id", campaignId).limit(1).maybeSingle(),
      supabase
        .from("campaign_workflows")
        .select("*")
        .eq("campaign_id", campaignId)
        .limit(1)
        .maybeSingle(),
    ]);

  assertSupabaseResult(campaignError, "Failed to load campaign setup");
  assertSupabaseResult(workflowError, "Failed to load campaign workflow");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;

  if (!campaign || campaign.organizationId !== bootstrap.organization.id) {
    redirect(brandsWorkspaceRoutes.campaigns.index());
  }

  if (campaign.currentStage !== "setup_planned" || workflowRow?.workflow_status === "production") {
    redirect(brandsWorkspaceRoutes.campaigns.detail(campaignId));
  }

  const stageState = deriveOpsWorkflowStageState(approvedSetupWorkflowState);
  const now = new Date().toISOString();

  const { error: workflowUpsertError } = await supabase.from("campaign_workflows").upsert(
    {
      campaign_id: campaignId,
      ops_owner_user_id: workflowRow?.ops_owner_user_id ?? null,
      workflow_status: approvedSetupWorkflowState.workflowStatus,
      review_status: approvedSetupWorkflowState.reviewStatus,
      delivery_status: approvedSetupWorkflowState.deliveryStatus,
      commercial_status: approvedSetupWorkflowState.commercialStatus,
      blocked_reason: null,
      sla_due_at: workflowRow?.sla_due_at ?? null,
      last_transition_at: now,
    },
    {
      onConflict: "campaign_id",
    },
  );

  assertSupabaseResult(workflowUpsertError, "Failed to approve campaign setup");

  const { error: campaignUpdateError } = await supabase
    .from("campaigns")
    .update({
      current_stage: stageState.currentStage,
    })
    .eq("id", campaignId);

  assertSupabaseResult(campaignUpdateError, "Failed to update campaign stage");

  for (const stageKey of opsStageOrder) {
    const status = stageState.statuses.get(stageKey) ?? "pending";
    const stagePatch: {
      status: CampaignStageStatus;
      started_at: string | null;
      completed_at: string | null;
    } = {
      status,
      started_at: status === "pending" ? null : now,
      completed_at: status === "completed" ? now : null,
    };

    const { error: stageUpdateError } = await supabase
      .from("campaign_stages")
      .update(stagePatch)
      .eq("campaign_id", campaignId)
      .eq("stage_key", stageKey);

    assertSupabaseResult(stageUpdateError, `Failed to update stage ${stageKey}`);
  }

  revalidateBrandSurface(campaignId, campaign.briefId);
  redirect(brandsWorkspaceRoutes.campaigns.detail(campaignId));
}
