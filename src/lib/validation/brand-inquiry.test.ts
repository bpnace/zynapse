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

  it("accepts a minimum quick brand intake", () => {
    const result = brandInquirySchema.safeParse({
      productUrl: "Neues Serum",
      goal: "Launch testen",
      contactName: "Mia Brand",
      workEmail: "mia@example.com",
      company: "Hydra Labs",
      datenschutzAccepted: true,
      startedAt: Date.now(),
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        industry: "",
        productUrl: "Neues Serum",
        goal: "Launch testen",
        channels: [],
        budgetRange: "",
        timeline: "",
        notes: "",
        newsletterOptIn: false,
        website: "",
      });
    }
  });

  it("rejects missing product context", () => {
    const result = brandInquirySchema.safeParse({
      industry: "D2C Wellness",
      productUrl: "",
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

  it("allows requests without a selected channel", () => {
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

    expect(result.success).toBe(true);
  });
});
