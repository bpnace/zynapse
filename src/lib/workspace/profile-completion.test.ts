import { describe, expect, it } from "vitest";
import {
  getBrandProfileCompletion,
  shouldGateBrandHome,
} from "@/lib/workspace/profile-completion";

describe("brand profile completion", () => {
  it("reports completion counts for a full brand profile", () => {
    const completion = getBrandProfileCompletion({
      website: "https://brand.example",
      offerSummary: "Premium skincare line centered on ingredient proof and texture.",
      targetAudience: "Women 25-40 who already buy prestige skincare online.",
      primaryChannels: "Meta paid social, TikTok cutdowns, landing page loops",
      brandTone: "Premium, precise, credible, performance-aware",
      reviewNotes: "Founder and growth lead approve claims and narrative framing.",
      claimGuardrails: "Avoid absolute promises and medical implication.",
    });

    expect(completion).toEqual({
      completed: 7,
      total: 7,
      percent: 100,
      isComplete: true,
    });
  });

  it("gates the brand home route until the profile is complete", () => {
    expect(
      shouldGateBrandHome({
        website: "",
        offerSummary: "Premium skincare line centered on ingredient proof and texture.",
        targetAudience: "Women 25-40 who already buy prestige skincare online.",
        primaryChannels: "Meta paid social, TikTok cutdowns, landing page loops",
        brandTone: "Premium, precise, credible, performance-aware",
        reviewNotes: "Founder and growth lead approve claims and narrative framing.",
        claimGuardrails: "Avoid absolute promises and medical implication.",
      }),
    ).toBe(true);

    expect(
      shouldGateBrandHome({
        website: "https://brand.example",
        offerSummary: "Premium skincare line centered on ingredient proof and texture.",
        targetAudience: "Women 25-40 who already buy prestige skincare online.",
        primaryChannels: "Meta paid social, TikTok cutdowns, landing page loops",
        brandTone: "Premium, precise, credible, performance-aware",
        reviewNotes: "Founder and growth lead approve claims and narrative framing.",
        claimGuardrails: "Avoid absolute promises and medical implication.",
      }),
    ).toBe(false);
  });
});
