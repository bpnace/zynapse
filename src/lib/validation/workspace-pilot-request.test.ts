import { describe, expect, it } from "vitest";
import { workspacePilotRequestSchema } from "@/lib/validation/workspace-pilot-request";

describe("workspacePilotRequestSchema", () => {
  it("accepts a complete pilot request", () => {
    const parsed = workspacePilotRequestSchema.safeParse({
      desiredTier: "Starter",
      startWindow: "Within the next 30 days",
      internalStakeholders: "Founder, growth lead",
      message: "We want to move this seeded campaign into a paid pilot if the review close is strong.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects incomplete requests", () => {
    const parsed = workspacePilotRequestSchema.safeParse({
      desiredTier: "",
      startWindow: "",
      internalStakeholders: "",
      message: "bad",
    });

    expect(parsed.success).toBe(false);
  });
});
