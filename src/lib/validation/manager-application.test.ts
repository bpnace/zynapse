import { describe, expect, it } from "vitest";
import { managerApplicationSchema } from "@/lib/validation/manager-application";

describe("managerApplicationSchema", () => {
  it("accepts a valid manager application", () => {
    const result = managerApplicationSchema.safeParse({
      name: "Alex Growth",
      email: "alex@example.com",
      portfolioUrl: "https://example.com/portfolio",
      focusChannels: ["TikTok", "Meta Ads"],
      caseSummary:
        "Managed recurring paid social testing for three consumer brands with weekly creative iterations.",
      availability: "2 brands per month",
      compensationNotes: "Monthly retainer",
      location: "Berlin / CET",
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("requires at least one focus channel", () => {
    const result = managerApplicationSchema.safeParse({
      name: "Alex Growth",
      email: "alex@example.com",
      portfolioUrl: "https://example.com/portfolio",
      focusChannels: [],
      caseSummary:
        "Managed recurring paid social testing for three consumer brands with weekly creative iterations.",
      availability: "2 brands per month",
      compensationNotes: "",
      location: "Berlin / CET",
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(false);
  });
});
