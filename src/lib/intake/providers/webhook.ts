import { getEnv } from "@/lib/env";
import type { IntakeEnvelope, IntakeResult } from "@/lib/intake/types";

export async function dispatchIntakeSubmission<TPayload>(
  envelope: IntakeEnvelope<TPayload>,
): Promise<IntakeResult> {
  const env = getEnv();

  if (!env.intakeWebhookUrl) {
    console.info("[zynapse:intake:fallback]", JSON.stringify(envelope));

    return {
      mode: "log",
      accepted: true,
    };
  }

  const response = await fetch(env.intakeWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
