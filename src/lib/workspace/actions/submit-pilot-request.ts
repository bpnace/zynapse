"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { workspaceCapabilities } from "@/lib/auth/roles";
import { campaigns } from "@/lib/db/schema/campaigns";
import { pilotRequests } from "@/lib/db/schema/pilot-requests";
import { getEnv } from "@/lib/env";
import { dispatchPilotRequestSubmission } from "@/lib/workspace/pilot/dispatch-pilot-request";
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
  const capability = workspaceCapabilities[bootstrap.membership.role];

  if (!capability.canSubmitPilotRequest) {
    return {
      success: false,
      message: "Nur Workspace-Admins können eine Pilot-Anfrage einreichen.",
    };
  }

  const parsed = workspacePilotRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte fülle die Pflichtfelder der Pilot-Anfrage aus, bevor du absendest.",
    };
  }

  const db = getDb();

  const campaign = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!campaign || campaign.organizationId !== bootstrap.organization.id) {
    return {
      success: false,
      message: "Diese Kampagne ist im aktuellen Workspace nicht verfügbar.",
    };
  }

  const env = getEnv();
  const [request] = await db
    .insert(pilotRequests)
    .values({
      organizationId: bootstrap.organization.id,
      campaignId: campaign.id,
      requestedBy: bootstrap.membership.userId,
      desiredTier: parsed.data.desiredTier,
      startWindow: parsed.data.startWindow,
      internalStakeholders: parsed.data.internalStakeholders,
      message: parsed.data.message,
      status: "submitted",
      handoffMode: env.pilotRequestWebhookUrl ? "webhook" : "log",
    })
    .returning();

  try {
    const dispatch = await dispatchPilotRequestSubmission({
      kind: "pilot_request",
      origin: `${env.siteUrl}/workspace/pilot-request`,
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

    await db
      .update(pilotRequests)
      .set({
        handoffMode: dispatch.mode,
        status: "submitted",
      })
      .where(eq(pilotRequests.id, request.id));

    revalidatePath("/workspace");
    revalidatePath("/workspace/pilot-request");
    revalidatePath(`/workspace/campaigns/${campaign.id}/handover`);

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
    await db
      .update(pilotRequests)
      .set({
        status: "failed",
        handoffMode: "webhook",
      })
      .where(eq(pilotRequests.id, request.id));

    revalidatePath("/workspace");
    revalidatePath("/workspace/pilot-request");
    revalidatePath(`/workspace/campaigns/${campaign.id}/handover`);

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
