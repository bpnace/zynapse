import { getEnv } from "@/lib/env";
import type { IntakeEnvelope, IntakeResult } from "@/lib/intake/types";

export async function dispatchIntakeSubmission<TPayload>(
  envelope: IntakeEnvelope<TPayload>,
): Promise<IntakeResult> {
  const env = getEnv();

  if (!env.intakeWebhookUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Intake webhook URL is not configured.");
    }

    console.info("[zynapse:intake:fallback]", {
      kind: envelope.kind,
      submittedAt: envelope.submittedAt,
      origin: envelope.origin,
    });

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

  const response = await fetch(env.intakeWebhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(envelope),
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
