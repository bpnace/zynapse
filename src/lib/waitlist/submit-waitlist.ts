import { getEnv } from "@/lib/env";
import type { IntakeResult } from "@/lib/intake/types";
import type {
  WaitlistWebhookContact,
  WaitlistWebhookEnvelope,
  WaitlistWebhookEnvironment,
  WaitlistWebhookSource,
} from "@/types/intake";

function getWaitlistWebhookEnvironment(): WaitlistWebhookEnvironment {
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function buildWaitlistWebhookEnvelope<
  TRaw extends Record<string, unknown>,
>({
  source,
  userAgent,
  origin,
  contact,
  raw,
}: {
  source: WaitlistWebhookSource;
  userAgent: string;
  origin: string;
  contact: WaitlistWebhookContact;
  raw: TRaw;
}): WaitlistWebhookEnvelope<TRaw> {
  const env = getEnv();

  return {
    source,
    env: getWaitlistWebhookEnvironment(),
    timestamp: new Date().toISOString(),
    userAgent,
    origin,
    siteUrl: env.siteUrl,
    contact,
    raw,
  };
}

export async function submitWaitlistSignup(
  payload: WaitlistWebhookEnvelope,
): Promise<IntakeResult> {
  const env = getEnv();

  if (!env.waitlistWebhookUrl) {
    console.info("[zynapse:waitlist:fallback]", JSON.stringify(payload));

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

  const response = await fetch(env.waitlistWebhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed with status ${response.status}.`);
  }

  return {
    mode: "webhook",
    accepted: true,
  };
}
