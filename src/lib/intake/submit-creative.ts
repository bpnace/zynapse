import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { CreativeApplication } from "@/types/intake";

export async function submitCreativeApplication(
  payload: CreativeApplication,
  origin: string,
) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "creative",
    origin,
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
