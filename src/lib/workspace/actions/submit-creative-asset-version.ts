"use server";

import { revalidatePath } from "next/cache";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import { requireCreativeWorkspaceAccess } from "@/lib/auth/guards";
import { creativeSubmissionSchema } from "@/lib/validation/creative-workspace";
import { assertSupabaseResult, requireServiceRoleClient } from "@/lib/workspace/data/service-role";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeSubmissionResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function submitCreativeAssetVersion(
  _previousState: CreativeSubmissionResult,
  formData: FormData,
): Promise<CreativeSubmissionResult> {
  const bootstrap = await requireCreativeWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canSubmitCreativeWork) {
    return {
      success: false,
      message: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Du kannst in diesem Workspace keine kreative Einreichung abgeben.",
    };
  }

  const parsed = creativeSubmissionSchema.safeParse({
    campaignId: formData.get("campaignId"),
    assetId: formData.get("assetId"),
    assignmentId: formData.get("assignmentId"),
    taskId: formData.get("taskId") || undefined,
    versionLabel: formData.get("versionLabel"),
    storagePath: formData.get("storagePath"),
    thumbnailPath: formData.get("thumbnailPath") || "",
    notes: formData.get("notes") || "",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte ergänze die fehlenden Übergabedaten, bevor du die Version einreichst.",
    };
  }

  const supabase = requireServiceRoleClient();

  const { data: assignmentRow, error: assignmentError } = await supabase
    .from("campaign_assignments")
    .select("*")
    .eq("id", parsed.data.assignmentId)
    .eq("user_id", bootstrap.membership.userId)
    .eq("campaign_id", parsed.data.campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(assignmentError, "Failed to validate creative assignment");

  if (!assignmentRow) {
    return {
      success: false,
      message: "Diese Einreichung gehört nicht zu deiner aktuellen Zuweisung.",
    };
  }

  const { error: versionInsertError } = await supabase.from("asset_versions").insert({
    asset_id: parsed.data.assetId,
    campaign_id: parsed.data.campaignId,
    assignment_id: parsed.data.assignmentId,
    created_by: bootstrap.membership.userId,
    version_label: parsed.data.versionLabel,
    storage_path: parsed.data.storagePath,
    thumbnail_path: parsed.data.thumbnailPath || null,
    notes: parsed.data.notes || null,
    submission_status: "submitted_for_ops_review",
  });

  assertSupabaseResult(versionInsertError, "Failed to create asset version");

  const now = new Date().toISOString();

  if (parsed.data.taskId) {
    const { error: taskUpdateError } = await supabase
      .from("creative_tasks")
      .update({
        status: "submitted",
        submitted_at: now,
      })
      .eq("id", parsed.data.taskId)
      .eq("owner_user_id", bootstrap.membership.userId);

    assertSupabaseResult(taskUpdateError, "Failed to update creative task");
  }

  const { error: assignmentUpdateError } = await supabase
    .from("campaign_assignments")
    .update({
      status: "submitted",
      submitted_at: now,
      accepted_at: assignmentRow.accepted_at ?? now,
    })
    .eq("id", parsed.data.assignmentId);

  assertSupabaseResult(assignmentUpdateError, "Failed to update creative assignment");

  const { error: revisionUpdateError } = await supabase
    .from("revision_items")
    .update({
      status: "submitted",
    })
    .eq("assignment_id", parsed.data.assignmentId)
    .eq("asset_id", parsed.data.assetId)
    .eq("status", "open");

  assertSupabaseResult(revisionUpdateError, "Failed to update revision queue");

  revalidatePath(creativeWorkspaceRoutes.home());
  revalidatePath(creativeWorkspaceRoutes.tasks());
  revalidatePath(creativeWorkspaceRoutes.feedback());
  revalidatePath(creativeWorkspaceRoutes.revisions.index());
  revalidatePath(creativeWorkspaceRoutes.campaigns.detail(parsed.data.campaignId));

  return {
    success: true,
    message: "Version eingereicht. Ops kann die Übergabe jetzt prüfen.",
  };
}
