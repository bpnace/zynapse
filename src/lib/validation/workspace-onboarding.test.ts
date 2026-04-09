import { describe, expect, it } from "vitest";
import { workspaceOnboardingSchema } from "@/lib/validation/workspace-onboarding";

describe("workspaceOnboardingSchema", () => {
  it("accepts a complete onboarding payload", () => {
    const parsed = workspaceOnboardingSchema.safeParse({
      website: "https://brand.example",
      offerSummary: "Premium skincare line centered on ingredient proof and texture.",
      targetAudience: "Women 25-40 who already buy prestige skincare online.",
      primaryChannels: "Meta paid social, TikTok cutdowns, landing page loops",
      brandTone: "Premium, precise, credible, performance-aware",
      reviewNotes: "Founder and growth lead approve claims and narrative framing.",
      claimGuardrails: "Avoid absolute promises and medical implication.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects incomplete onboarding payloads", () => {
    const parsed = workspaceOnboardingSchema.safeParse({
      website: "",
      offerSummary: "short",
      targetAudience: "",
      primaryChannels: "",
      brandTone: "",
      reviewNotes: "",
      claimGuardrails: "",
    });

    expect(parsed.success).toBe(false);
  });
});
