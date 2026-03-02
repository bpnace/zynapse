import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { ManagerApplication } from "@/types/intake";

export async function submitManagerApplication(payload: ManagerApplication) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "manager",
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
