import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { BrandInquiry } from "@/types/intake";

export async function submitBrandInquiry(payload: BrandInquiry, origin: string) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "brand",
    origin,
    siteUrl: env.siteUrl,
    notifyEmail: env.notifyEmail,
    submittedAt: new Date().toISOString(),
    payload,
  });
}
