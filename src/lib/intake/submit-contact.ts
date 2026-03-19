import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { ContactInquiry } from "@/types/intake";

export async function submitContactInquiry(payload: ContactInquiry) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "contact",
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
