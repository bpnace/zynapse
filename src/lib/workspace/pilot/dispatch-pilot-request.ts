import { getEnv } from "@/lib/env";

type PilotRequestEnvelope = {
  kind: "pilot_request";
  origin: string;
  submittedAt: string;
  notifyEmail: string;
  siteUrl: string;
  payload: {
    organizationId: string;
    organizationName: string;
    campaignId: string;
    campaignName: string;
    requestedBy: string;
    desiredTier: string;
    startWindow: string;
    internalStakeholders: string;
    message: string;
  };
};

type PilotDispatchResult = {
  mode: "webhook" | "log";
  accepted: boolean;
};

export async function dispatchPilotRequestSubmission(
  envelope: PilotRequestEnvelope,
): Promise<PilotDispatchResult> {
  const env = getEnv();

  if (!env.pilotRequestWebhookUrl) {
    console.info("[zynapse:pilot-request:fallback]", JSON.stringify(envelope));

    return {
      mode: "log",
      accepted: true,
    };
  }

  const user = process.env.N8N_BASIC_USER;
  const pass = process.env.N8N_BASIC_PASS;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (user && pass) {
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");
    headers.Authorization = `Basic ${auth}`;
  }

  const response = await fetch(env.pilotRequestWebhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(envelope),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Pilot request webhook failed with status ${response.status}.`);
  }

  return {
    mode: "webhook",
    accepted: true,
  };
}
