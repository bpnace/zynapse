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
        channel: payload.channel,
        budgetRange: payload.budgetRange,
        timeline: payload.timeline,
        notes: payload.notes,
        contactName: payload.contactName,
        workEmail: payload.workEmail,
        company: payload.company,
        startedAt: payload.startedAt,
      },
    }),
  );
}
