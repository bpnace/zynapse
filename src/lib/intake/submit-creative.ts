import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { CreativeApplication } from "@/types/intake";

export async function submitCreativeApplication(payload: CreativeApplication) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "creative",
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
