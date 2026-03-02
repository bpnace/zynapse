import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { BrandInquiry } from "@/types/intake";

export async function submitBrandInquiry(payload: BrandInquiry) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "brand",
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
