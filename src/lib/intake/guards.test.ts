import { describe, expect, it } from "vitest";
import { ensureHumanSubmission } from "@/lib/intake/guards";

describe("ensureHumanSubmission", () => {
  it("accepts normal submissions", () => {
    const result = ensureHumanSubmission({
      startedAt: 1_000,
      website: "",
      now: 4_000,
    });

    expect(result.ok).toBe(true);
  });

  it("rejects honeypot submissions", () => {
    const result = ensureHumanSubmission({
      startedAt: 1_000,
      website: "spam",
      now: 4_000,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects submissions that are too fast", () => {
    const result = ensureHumanSubmission({
      startedAt: 1_000,
      website: "",
      now: 1_500,
    });

    expect(result.ok).toBe(false);
  });
});
