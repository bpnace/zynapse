import {
  buildWaitlistWebhookEnvelope,
  submitWaitlistSignup,
} from "@/lib/waitlist/submit-waitlist";
import type { BrandInquiry } from "@/types/intake";

export async function submitBrandInquiry(
  payload: BrandInquiry,
  context: {
    origin: string;
    userAgent: string;
  },
) {
  return submitWaitlistSignup(
    buildWaitlistWebhookEnvelope({
      source: "brand_inquiry",
      userAgent: context.userAgent,
      origin: context.origin,
      contact: {
        name: payload.contactName,
        email: payload.workEmail,
        company: payload.company,
      },
      raw: {
        industry: payload.industry,
        productUrl: payload.productUrl,
        goal: payload.goal,
        targetAudience: payload.targetAudience,
        keyBarrier: payload.keyBarrier,
        channels: payload.channels,
        budgetRange: payload.budgetRange,
        styleDirection: payload.styleDirection,
        timeline: payload.timeline,
        reviewContext: payload.reviewContext,
        notes: payload.notes,
        contactName: payload.contactName,
        workEmail: payload.workEmail,
        company: payload.company,
        datenschutzAccepted: payload.datenschutzAccepted,
        startedAt: payload.startedAt,
      },
    }),
  );
}
