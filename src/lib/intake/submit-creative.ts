import {
  buildWaitlistWebhookEnvelope,
  submitWaitlistSignup,
} from "@/lib/waitlist/submit-waitlist";
import type { CreativeApplication } from "@/types/intake";

export async function submitCreativeApplication(
  payload: CreativeApplication,
  context: {
    origin: string;
    userAgent: string;
  },
) {
  return submitWaitlistSignup(
    buildWaitlistWebhookEnvelope({
      source: "creative_application",
      userAgent: context.userAgent,
      origin: context.origin,
      contact: {
        name: payload.name,
        email: payload.email,
      },
      raw: {
        name: payload.name,
        email: payload.email,
        portfolioUrl: payload.portfolioUrl,
        focusChannels: payload.focusChannels,
        caseSummary: payload.caseSummary,
        availability: payload.availability,
        compensationNotes: payload.compensationNotes,
        location: payload.location,
        datenschutzAccepted: payload.datenschutzAccepted,
        startedAt: payload.startedAt,
      },
    }),
  );
}
