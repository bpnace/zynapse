import { getEnv } from "@/lib/env";
import type { IntakeResult } from "@/lib/intake/types";

type WaitlistWebhookPayload = {
  email: string;
  timestamp: string;
  userAgent: string;
};

export async function submitWaitlistSignup(
  payload: WaitlistWebhookPayload,
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
