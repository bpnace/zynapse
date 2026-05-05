import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { CreativeApplication } from "@/types/intake";

export async function submitCreativeApplication(
  payload: CreativeApplication,
  context: {
    origin: string;
    userAgent: string;
  },
) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "creative",
    origin: context.origin,
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload: {
      ...payload,
      userAgent: context.userAgent,
    },
  });
}
