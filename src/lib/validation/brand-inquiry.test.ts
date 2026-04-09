import { describe, expect, it } from "vitest";
import { brandInquirySchema } from "@/lib/validation/brand-inquiry";

describe("brandInquirySchema", () => {
  it("accepts a valid brand intake", () => {
    const result = brandInquirySchema.safeParse({
      industry: "D2C Wellness",
      productUrl: "https://example.com/product",
      goal: "Paid social conversion",
      channels: ["TikTok", "Instagram Reels"],
      budgetRange: "3k bis 8k",
      timeline: "Sofort / diese Woche",
      notes: "Need premium but direct messaging.",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: true,
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid urls", () => {
    const result = brandInquirySchema.safeParse({
      industry: "D2C Wellness",
      productUrl: "not-a-url",
      goal: "Paid social conversion",
      channels: ["TikTok"],
      budgetRange: "3k bis 8k",
      timeline: "Sofort / diese Woche",
      notes: "",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: true,
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("requires accepted privacy terms", () => {
    const result = brandInquirySchema.safeParse({
      industry: "D2C Wellness",
      productUrl: "https://example.com/product",
      goal: "Paid social conversion",
      channels: ["TikTok"],
      budgetRange: "3k bis 8k",
      timeline: "Sofort / diese Woche",
      notes: "",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: false,
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("requires at least one channel", () => {
    const result = brandInquirySchema.safeParse({
      industry: "D2C Wellness",
      productUrl: "https://example.com/product",
      goal: "Paid social conversion",
      channels: [],
      budgetRange: "3k bis 8k",
      timeline: "Sofort / diese Woche",
      notes: "",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: true,
      startedAt: Date.now(),
      website: "",
    });

    expect(result.success).toBe(false);
  });
});
