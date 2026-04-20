"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignWorkflow,
  mapPilotRequest,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { getEnv } from "@/lib/env";
import { dispatchPilotRequestSubmission } from "@/lib/workspace/pilot/dispatch-pilot-request";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  workspacePilotRequestSchema,
  type WorkspacePilotRequestInput,
} from "@/lib/validation/workspace-pilot-request";

type SubmitPilotRequestResult =
  | {
      success: true;
      requestId: string;
      status: "submitted";
      handoffMode: "webhook" | "log";
      message: string;
    }
  | {
      success: false;
      requestId?: string;
      status?: "failed";
      handoffMode?: "webhook" | "log";
      message: string;
    };

export async function submitPilotRequest(
  campaignId: string,
  input: WorkspacePilotRequestInput,
): Promise<SubmitPilotRequestResult> {
  const bootstrap = await requireWorkspaceAccess();
  const capability = getWorkspaceCapabilities(bootstrap.membership.role, {
    isReadOnly: bootstrap.demo.isReadOnly,
  });

  if (!capability.canSubmitPilotRequest) {
    return {
      success: false,
      message: bootstrap.demo.isDemoWorkspace
        ? bootstrap.demo.mutationMessage
        : "Nur Workspace-Admins können eine Pilot-Anfrage einreichen.",
    };
  }

  const parsed = workspacePilotRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte fülle die Pflichtfelder der Pilot-Anfrage aus, bevor du absendest.",
    };
  }

  const supabase = requireServiceRoleClient();

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load pilot request campaign");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;

  if (!campaign || campaign.organizationId !== bootstrap.organization.id) {
    return {
      success: false,
      message: "Diese Kampagne ist im aktuellen Workspace nicht verfügbar.",
    };
  }

  const [
    { data: stageRows, error: stageError },
    { data: assetRows, error: assetError },
    { data: workflowRow, error: workflowError },
  ] =
    await Promise.all([
      supabase
        .from("campaign_stages")
        .select("stage_key,status")
        .eq("campaign_id", campaign.id),
      supabase
        .from("assets")
        .select("id,review_status")
        .eq("campaign_id", campaign.id),
      supabase
        .from("campaign_workflows")
        .select("*")
        .eq("campaign_id", campaign.id)
        .limit(1)
        .maybeSingle(),
    ]);

  assertSupabaseResult(stageError, "Failed to load pilot request readiness stages");
  assertSupabaseResult(assetError, "Failed to load pilot request readiness assets");
  assertSupabaseResult(workflowError, "Failed to load pilot request readiness workflow");

  const assetIds = (assetRows ?? []).map((asset) => asset.id);
  const unresolvedReviewCount =
    assetIds.length > 0
      ? await supabase
          .from("review_threads")
          .select("id", { count: "exact", head: true })
          .in("asset_id", assetIds)
          .is("resolved_at", null)
          .then(({ count, error }) => {
            assertSupabaseResult(error, "Failed to load pilot request readiness threads");
            return count ?? 0;
          })
      : 0;

  const readiness = getBrandWorkspaceReadiness({
    stageItems: (stageRows ?? []).map((stage) => ({
      stageKey: stage.stage_key,
      status: stage.status,
    })),
    latestAssets: (assetRows ?? []).map((asset) => ({
      reviewStatus: asset.review_status,
    })),
    openReviewCount: unresolvedReviewCount,
    workflowState: workflowRow ? mapCampaignWorkflow(workflowRow) : null,
  });

  if (!readiness.showCommercialStep) {
    return {
      success: false,
      message:
        "Die Pilot-Anfrage bleibt gesperrt, bis freigegebene Varianten vorliegen und keine offenen Review-Punkte mehr blockieren.",
    };
  }

  const env = getEnv();
  const { data: requestRow, error: requestError } = await supabase
    .from("pilot_requests")
    .insert({
      organization_id: bootstrap.organization.id,
      campaign_id: campaign.id,
      requested_by: bootstrap.membership.userId,
      desired_tier: parsed.data.desiredTier,
      start_window: parsed.data.startWindow,
      internal_stakeholders: parsed.data.internalStakeholders,
      message: parsed.data.message,
      status: "submitted",
      handoff_mode: env.pilotRequestWebhookUrl ? "webhook" : "log",
    })
    .select("*")
    .single();

  assertSupabaseResult(requestError, "Failed to create pilot request");

  if (!requestRow) {
    throw new Error("Failed to create pilot request: missing inserted row.");
  }

  const request = mapPilotRequest(requestRow);

  try {
    const dispatch = await dispatchPilotRequestSubmission({
      kind: "pilot_request",
      origin: `${env.siteUrl}${brandsWorkspaceRoutes.pilotRequest()}`,
      submittedAt: request.submittedAt.toISOString(),
      notifyEmail: env.notifyEmail,
      siteUrl: env.siteUrl,
      payload: {
        organizationId: bootstrap.organization.id,
        organizationName: bootstrap.organization.name,
        campaignId: campaign.id,
        campaignName: campaign.name,
        requestedBy: bootstrap.membership.role,
        desiredTier: parsed.data.desiredTier,
        startWindow: parsed.data.startWindow,
        internalStakeholders: parsed.data.internalStakeholders,
        message: parsed.data.message,
      },
    });

    const { error: successUpdateError } = await supabase
      .from("pilot_requests")
      .update({
        handoff_mode: dispatch.mode,
        status: "submitted",
      })
      .eq("id", request.id);

    assertSupabaseResult(successUpdateError, "Failed to update pilot request status");

    const { error: workflowUpdateError } = await supabase
      .from("campaign_workflows")
      .upsert(
        {
          campaign_id: campaign.id,
          workflow_status: "handover",
          review_status: "approved",
          delivery_status: "ready",
          commercial_status: "pilot_requested",
          last_transition_at: new Date().toISOString(),
        },
        {
          onConflict: "campaign_id",
        },
      );

    assertSupabaseResult(workflowUpdateError, "Failed to update pilot request workflow state");

    for (const path of brandsWorkspaceRoutes.revalidation({ campaignId: campaign.id })) {
      revalidatePath(path);
    }

    return {
      success: true,
      requestId: request.id,
      status: "submitted",
      handoffMode: dispatch.mode,
      message:
        dispatch.mode === "webhook"
          ? "Pilot-Anfrage eingereicht. Ops hat die Übergabe erhalten."
          : "Pilot-Anfrage gespeichert. Für die Live-Übergabe an Ops fehlt noch eine dedizierte Webhook-Verbindung.",
    };
  } catch {
    const { error: failureUpdateError } = await supabase
      .from("pilot_requests")
      .update({
        status: "failed",
        handoff_mode: "webhook",
      })
      .eq("id", request.id);

    assertSupabaseResult(failureUpdateError, "Failed to mark pilot request as failed");

    for (const path of brandsWorkspaceRoutes.revalidation({ campaignId: campaign.id })) {
      revalidatePath(path);
    }

    return {
      success: false,
      requestId: request.id,
      status: "failed",
      handoffMode: "webhook",
      message:
        "Die Anfrage wurde gespeichert, aber die Übergabe an Ops konnte nicht abgeschlossen werden. Bitte erneut versuchen oder uns direkt kontaktieren.",
    };
  }
}
