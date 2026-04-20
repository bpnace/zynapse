"use server";

import { revalidatePath } from "next/cache";
import { requireOpsWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  opsAssignmentSchema,
  opsWorkflowUpdateSchema,
} from "@/lib/validation/workspace-ops";
import type {
  CampaignStageKey,
  CampaignStageStatus,
} from "@/lib/workspace/data/types";

type OpsActionState = {
  success: boolean;
  message: string;
};

const opsDashboardPath = "/ops";

const initialDeniedMessage = "Ops-Zugriff ist für diese Mitgliedschaft nicht verfügbar.";

type OpsMutationContext =
  | {
      error: string;
    }
  | {
      bootstrap: Awaited<ReturnType<typeof requireOpsWorkspaceAccess>>;
      capabilities: ReturnType<typeof getWorkspaceCapabilities>;
      supabase: ReturnType<typeof requireServiceRoleClient>;
    };

async function getOpsMutationContext(): Promise<OpsMutationContext> {
  const bootstrap = await requireOpsWorkspaceAccess();
  const capabilities = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capabilities.canAccessOpsWorkspace) {
    return {
      error: bootstrap.demo.isDemoWorkspace
        ? (bootstrap.demo.mutationMessage ?? initialDeniedMessage)
        : initialDeniedMessage,
    };
  }

  return {
    bootstrap,
    capabilities,
    supabase: requireServiceRoleClient(),
  };
}

function getStageStateFromWorkflow(input: {
  workflowStatus: string;
  reviewStatus: string;
  deliveryStatus: string;
}): {
  currentStage: CampaignStageKey;
  stageStatuses: Array<{
    stageKey: CampaignStageKey;
    status: CampaignStageStatus;
  }>;
} {
  const currentStage: CampaignStageKey =
    input.deliveryStatus === "ready" || input.workflowStatus === "complete"
      ? "handover_ready"
      : input.reviewStatus === "approved" || input.workflowStatus === "handover"
        ? "approved"
        : input.reviewStatus === "in_review" || input.workflowStatus === "review"
          ? "in_review"
          : input.workflowStatus === "production"
            ? "production_ready"
            : "setup_planned";

  const orderedStages = [
    "brief_received",
    "setup_planned",
    "production_ready",
    "in_review",
    "approved",
    "handover_ready",
  ] as const;
  const currentIndex = orderedStages.indexOf(currentStage);

  const stageStatuses: Array<{
    stageKey: CampaignStageKey;
    status: CampaignStageStatus;
  }> = orderedStages.map((stageKey, index) => ({
    stageKey,
    status:
      index < currentIndex
        ? "completed"
        : index === currentIndex
          ? "in_progress"
          : "pending",
  }));

  return {
    currentStage,
    stageStatuses: orderedStages.map((stageKey, index) => ({
      stageKey,
      status: (
        index < currentIndex
          ? "completed"
          : index === currentIndex
            ? "in_progress"
            : "pending"
      ) satisfies CampaignStageStatus,
    })),
  };
}

function revalidateOpsPaths(campaignId: string) {
  revalidatePath(opsDashboardPath);

  for (const path of brandsWorkspaceRoutes.revalidation({ campaignId })) {
    revalidatePath(path);
  }
}

export async function assignCreativeCampaignWork(
  _previousState: OpsActionState,
  formData: FormData,
): Promise<OpsActionState> {
  const context = await getOpsMutationContext();

  if ("error" in context) {
    return {
      success: false,
      message: context.error ?? initialDeniedMessage,
    };
  }

  if (!context.capabilities.canManageInvites) {
    return {
      success: false,
      message: "Nur Ops kann Kampagnenzuweisungen ändern.",
    };
  }

  const parsed = opsAssignmentSchema.safeParse({
    campaignId: formData.get("campaignId"),
    userId: formData.get("userId"),
    assignmentRole: formData.get("assignmentRole"),
    scopeSummary: formData.get("scopeSummary"),
    dueAt: formData.get("dueAt"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte wähle eine Creative-Zuweisung, Rolle und einen klaren Scope aus.",
    };
  }

  const { bootstrap, supabase } = context;

  const [{ data: campaignRow, error: campaignError }, { data: membershipRow, error: membershipError }] =
    await Promise.all([
      supabase
        .from("campaigns")
        .select("id,organization_id,name")
        .eq("id", parsed.data.campaignId)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("memberships")
        .select("id")
        .eq("organization_id", bootstrap.organization.id)
        .eq("user_id", parsed.data.userId)
        .eq("workspace_type", "creative")
        .limit(1)
        .maybeSingle(),
    ]);

  assertSupabaseResult(campaignError, "Failed to validate ops assignment campaign");
  assertSupabaseResult(membershipError, "Failed to validate creative membership");

  if (!campaignRow || campaignRow.organization_id !== bootstrap.organization.id || !membershipRow) {
    return {
      success: false,
      message: "Die ausgewählte Kampagne oder Creative-Mitgliedschaft ist nicht verfügbar.",
    };
  }

  const dueAt =
    parsed.data.dueAt && parsed.data.dueAt.length > 0
      ? new Date(parsed.data.dueAt).toISOString()
      : null;

  const { data: existingAssignmentRow, error: existingAssignmentError } = await supabase
    .from("campaign_assignments")
    .select("id")
    .eq("campaign_id", parsed.data.campaignId)
    .eq("user_id", parsed.data.userId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(existingAssignmentError, "Failed to load existing assignment");

  if (existingAssignmentRow) {
    const { error: assignmentUpdateError } = await supabase
      .from("campaign_assignments")
      .update({
        assignment_role: parsed.data.assignmentRole,
        status: "assigned",
        assigned_by: bootstrap.membership.userId,
        scope_summary: parsed.data.scopeSummary,
        due_at: dueAt,
      })
      .eq("id", existingAssignmentRow.id);

    assertSupabaseResult(assignmentUpdateError, "Failed to update campaign assignment");
  } else {
    const { error: assignmentInsertError } = await supabase
      .from("campaign_assignments")
      .insert({
        campaign_id: parsed.data.campaignId,
        user_id: parsed.data.userId,
        assignment_role: parsed.data.assignmentRole,
        status: "assigned",
        assigned_by: bootstrap.membership.userId,
        scope_summary: parsed.data.scopeSummary,
        due_at: dueAt,
      });

    assertSupabaseResult(assignmentInsertError, "Failed to create campaign assignment");
  }

  const { error: workflowUpsertError } = await supabase.from("campaign_workflows").upsert(
    {
      campaign_id: parsed.data.campaignId,
      workflow_status: "production",
      last_transition_at: new Date().toISOString(),
    },
    {
      onConflict: "campaign_id",
      ignoreDuplicates: false,
    },
  );

  assertSupabaseResult(workflowUpsertError, "Failed to keep workflow in production state");

  revalidateOpsPaths(parsed.data.campaignId);

  return {
    success: true,
    message: `Zuweisung gespeichert. ${campaignRow.name} ist jetzt im Ops-Control-Plane sichtbar.`,
  };
}

export async function updateOpsCampaignWorkflow(
  _previousState: OpsActionState,
  formData: FormData,
): Promise<OpsActionState> {
  const context = await getOpsMutationContext();

  if ("error" in context) {
    return {
      success: false,
      message: context.error ?? initialDeniedMessage,
    };
  }

  const parsed = opsWorkflowUpdateSchema.safeParse({
    campaignId: formData.get("campaignId"),
    workflowStatus: formData.get("workflowStatus"),
    reviewStatus: formData.get("reviewStatus"),
    deliveryStatus: formData.get("deliveryStatus"),
    commercialStatus: formData.get("commercialStatus"),
    blockedReason: formData.get("blockedReason"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte prüfe die Workflow-Werte, bevor du den Status speicherst.",
    };
  }

  const { bootstrap, supabase } = context;

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("id,organization_id,name")
    .eq("id", parsed.data.campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to validate workflow campaign");

  if (!campaignRow || campaignRow.organization_id !== bootstrap.organization.id) {
    return {
      success: false,
      message: "Die ausgewählte Kampagne ist im aktuellen Ops-Bereich nicht verfügbar.",
    };
  }

  const now = new Date().toISOString();
  const stageState = getStageStateFromWorkflow(parsed.data);

  const { error: workflowError } = await supabase
    .from("campaign_workflows")
    .upsert(
      {
        campaign_id: parsed.data.campaignId,
        workflow_status: parsed.data.workflowStatus,
        review_status: parsed.data.reviewStatus,
        delivery_status: parsed.data.deliveryStatus,
        commercial_status: parsed.data.commercialStatus,
        blocked_reason: parsed.data.blockedReason || null,
        last_transition_at: now,
      },
      {
        onConflict: "campaign_id",
      },
    );

  assertSupabaseResult(workflowError, "Failed to update campaign workflow");

  const { error: campaignUpdateError } = await supabase
    .from("campaigns")
    .update({
      current_stage: stageState.currentStage,
    })
    .eq("id", parsed.data.campaignId);

  assertSupabaseResult(campaignUpdateError, "Failed to update campaign stage");

  for (const stage of stageState.stageStatuses) {
    const { error: stageUpdateError } = await supabase
      .from("campaign_stages")
      .update({
        status: stage.status,
        started_at: stage.status === "pending" ? null : now,
        completed_at: stage.status === "completed" ? now : null,
      })
      .eq("campaign_id", parsed.data.campaignId)
      .eq("stage_key", stage.stageKey);

    assertSupabaseResult(stageUpdateError, "Failed to update campaign stage timeline");
  }

  revalidateOpsPaths(parsed.data.campaignId);

  return {
    success: true,
    message: `Workflow aktualisiert. ${campaignRow.name} spiegelt jetzt den neuen Ops-Status wider.`,
  };
}
