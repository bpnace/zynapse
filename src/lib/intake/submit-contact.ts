import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { ContactInquiry } from "@/types/intake";

export async function submitContactInquiry(
  payload: ContactInquiry,
  origin: string,
) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "contact",
    origin,
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
