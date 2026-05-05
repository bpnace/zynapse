import { getEnv } from "@/lib/env";
import { dispatchIntakeSubmission } from "@/lib/intake/providers/webhook";
import type { BrandInquiry } from "@/types/intake";

export async function submitBrandInquiry(
  payload: BrandInquiry,
  context: {
    origin: string;
    userAgent: string;
  },
) {
  const env = getEnv();

  return dispatchIntakeSubmission({
    kind: "brand",
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
