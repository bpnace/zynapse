import { describe, expect, it } from "vitest";
import { workspaceBriefSchema } from "@/lib/validation/workspace-brief";

describe("workspaceBriefSchema", () => {
  it("accepts a complete brief payload", () => {
    const parsed = workspaceBriefSchema.safeParse({
      title: "Serum launch brief",
      objective: "Launch a proof-led paid social creative package for the new hero serum.",
      offer: "Premium skincare serum centered on ingredient proof and visible texture.",
      audience: "Women 25-40 already buying prestige skincare online.",
      channels: "Meta paid social, TikTok cutdowns, landing page loops",
      hooks: "Ingredient proof, founder rationale, texture-led opening",
      creativeReferences: "Founder card, texture reveal, current highest-performing proof frames",
      budgetRange: "EUR 15k-25k test window",
      timeline: "Launch within the next four weeks",
      approvalNotes: "Founder and growth lead approve claims before final delivery.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects incomplete briefs", () => {
    const parsed = workspaceBriefSchema.safeParse({
      title: "",
      objective: "short",
      offer: "",
      audience: "",
      channels: "",
      hooks: "",
      creativeReferences: "",
      budgetRange: "",
      timeline: "",
      approvalNotes: "",
    });

    expect(parsed.success).toBe(false);
  });
});
