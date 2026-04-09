import { describe, expect, it } from "vitest";
import {
  workspaceCommentSchema,
  workspaceDecisionSchema,
} from "@/lib/validation/workspace-review";

describe("workspace review validation", () => {
  it("accepts valid comment input", () => {
    const parsed = workspaceCommentSchema.safeParse({
      body: "The product proof at 00:04 should land earlier.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects too-short comments", () => {
    const parsed = workspaceCommentSchema.safeParse({
      body: "ok",
    });

    expect(parsed.success).toBe(false);
  });

  it("accepts valid review decisions", () => {
    const parsed = workspaceDecisionSchema.safeParse({
      note: "This version is ready for handover.",
      decision: "approved",
    });

    expect(parsed.success).toBe(true);
  });
});
