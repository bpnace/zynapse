"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import { requireOpsWorkspaceAccess } from "@/lib/auth/guards";
import { assertSupabaseResult, mapCampaign, requireServiceRoleClient } from "@/lib/workspace/data/service-role";
import {
  deriveOpsWorkflowStageState,
  opsStageOrder,
} from "@/lib/workspace/ops-workflow-state";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  opsWorkspaceRoutes,
} from "@/lib/workspace/routes";
import type {
  CampaignStageStatus,
} from "@/lib/workspace/data/types";

const assignmentInputSchema = z.object({
  campaignId: z.string().min(1),
  userId: z.string().min(1),
  assignmentRole: z.enum(["creative", "creative_lead", "editor", "motion", "designer", "copy"]),
  status: z.enum(["assigned", "accepted", "in_progress", "blocked", "submitted", "completed"]),
  scopeSummary: z.string().trim().min(3),
  dueAt: z.string().trim().optional().nullable(),
});

const workflowInputSchema = z.object({
  campaignId: z.string().min(1),
  opsOwnerUserId: z.string().trim().optional().nullable(),
  workflowStatus: z.enum(["setup", "production", "review", "handover", "complete"]),
  reviewStatus: z.enum(["not_ready", "in_review", "approved"]),
  deliveryStatus: z.enum(["not_ready", "preparing", "ready"]),
  commercialStatus: z.enum(["not_ready", "ready_for_pilot", "pilot_requested"]),
  blockedReason: z.string().trim().optional().nullable(),
  slaDueAt: z.string().trim().optional().nullable(),
});

type MutationResult =
  | { success: true; message: string }
  | { success: false; message: string };

type OpsMutationContext =
  | {
      error: string;
    }
  | {
      supabase: ReturnType<typeof requireServiceRoleClient>;
      bootstrap: Awaited<ReturnType<typeof requireOpsWorkspaceAccess>>;
      campaign: NonNullable<ReturnType<typeof mapCampaign>>;
    };

function toNullable(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isIsoDate(value: string | null) {
  if (!value) {
    return false;
  }

  return !Number.isNaN(Date.parse(value));
}

async function getOpsMutationContext(campaignId: string): Promise<OpsMutationContext> {
  const bootstrap = await requireOpsWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (bootstrap.demo.isReadOnly || !capability.canAccessOpsWorkspace) {
    return {
      error: bootstrap.demo.isDemoWorkspace
        ? (bootstrap.demo.mutationMessage ?? "Du kannst diesen Ops-Schritt nicht bearbeiten.")
        : "Du kannst diesen Ops-Schritt nicht bearbeiten.",
    };
  }

  const supabase = requireServiceRoleClient();
  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load ops mutation campaign");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;
  if (!campaign || campaign.organizationId !== bootstrap.organization.id) {
    return {
      error: "Diese Kampagne ist im aktuellen Ops-Workspace nicht verfügbar.",
    };
  }

  return { supabase, bootstrap, campaign };
}

function revalidateOpsSurface(campaignId: string) {
  revalidatePath(opsWorkspaceRoutes.overview());
  revalidatePath(opsWorkspaceRoutes.campaigns());
  revalidatePath(opsWorkspaceRoutes.campaignDetail(campaignId));
  revalidatePath(opsWorkspaceRoutes.assignments());
  revalidatePath(opsWorkspaceRoutes.delivery());
  revalidatePath(opsWorkspaceRoutes.commercial());
  revalidatePath(opsWorkspaceRoutes.legacyReviewReadiness());
  revalidatePath(opsWorkspaceRoutes.legacyCommercialHandoffs());

  for (const path of brandsWorkspaceRoutes.revalidation({ campaignId })) {
    revalidatePath(path);
  }

  revalidatePath(creativeWorkspaceRoutes.tasks());
  revalidatePath(creativeWorkspaceRoutes.feedback());
  revalidatePath(creativeWorkspaceRoutes.campaigns.detail(campaignId));
}

export async function upsertOpsAssignment(input: z.infer<typeof assignmentInputSchema>): Promise<MutationResult> {
  const parsed = assignmentInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Die Assignment-Daten sind unvollständig.",
    };
  }

  const context = await getOpsMutationContext(parsed.data.campaignId);
  if ("error" in context) {
    return { success: false, message: context.error ?? "Ops mutation not allowed." };
  }

  const now = new Date().toISOString();
  const dueAt = toNullable(parsed.data.dueAt);

  if (dueAt && !isIsoDate(dueAt)) {
    return { success: false, message: "Bitte gib ein gültiges Fälligkeitsdatum an." };
  }

  const acceptedAt =
    parsed.data.status === "accepted" ||
    parsed.data.status === "in_progress" ||
    parsed.data.status === "submitted" ||
    parsed.data.status === "completed"
      ? now
      : null;
  const submittedAt =
    parsed.data.status === "submitted" || parsed.data.status === "completed" ? now : null;

  const { error } = await context.supabase
    .from("campaign_assignments")
    .upsert(
      {
        campaign_id: parsed.data.campaignId,
        user_id: parsed.data.userId,
        assignment_role: parsed.data.assignmentRole,
        status: parsed.data.status,
        assigned_by: context.bootstrap.membership.userId,
        scope_summary: parsed.data.scopeSummary,
        due_at: dueAt,
        accepted_at: acceptedAt,
        submitted_at: submittedAt,
      },
      {
        onConflict: "campaign_id,user_id",
      },
    );

  assertSupabaseResult(error, "Failed to upsert ops assignment");

  revalidateOpsSurface(parsed.data.campaignId);

  return {
    success: true,
    message: "Assignment aktualisiert.",
  };
}

export async function updateOpsWorkflow(input: z.infer<typeof workflowInputSchema>): Promise<MutationResult> {
  const parsed = workflowInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Die Workflow-Daten sind unvollständig.",
    };
  }

  const context = await getOpsMutationContext(parsed.data.campaignId);
  if ("error" in context) {
    return { success: false, message: context.error ?? "Ops mutation not allowed." };
  }

  const slaDueAt = toNullable(parsed.data.slaDueAt);
  if (slaDueAt && !isIsoDate(slaDueAt)) {
    return { success: false, message: "Bitte gib ein gültiges SLA-Datum an." };
  }

  const blockedReason = toNullable(parsed.data.blockedReason);
  const stageState = deriveOpsWorkflowStageState(parsed.data);
  const now = new Date().toISOString();

  const { error: workflowError } = await context.supabase
    .from("campaign_workflows")
    .upsert(
      {
        campaign_id: parsed.data.campaignId,
        ops_owner_user_id: toNullable(parsed.data.opsOwnerUserId),
        workflow_status: parsed.data.workflowStatus,
        review_status: parsed.data.reviewStatus,
        delivery_status: parsed.data.deliveryStatus,
        commercial_status: parsed.data.commercialStatus,
        blocked_reason: blockedReason,
        sla_due_at: slaDueAt,
        last_transition_at: now,
      },
      {
        onConflict: "campaign_id",
      },
    );

  assertSupabaseResult(workflowError, "Failed to update ops workflow");

  const { error: campaignError } = await context.supabase
    .from("campaigns")
    .update({
      current_stage: stageState.currentStage,
    })
    .eq("id", parsed.data.campaignId);

  assertSupabaseResult(campaignError, "Failed to update campaign stage");

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

    const { error: stageError } = await context.supabase
      .from("campaign_stages")
      .update(stagePatch)
      .eq("campaign_id", parsed.data.campaignId)
      .eq("stage_key", stageKey);

    assertSupabaseResult(stageError, `Failed to update stage ${stageKey}`);
  }

  revalidateOpsSurface(parsed.data.campaignId);

  return {
    success: true,
    message: "Workflow aktualisiert.",
  };
}
