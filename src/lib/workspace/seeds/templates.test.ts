import { describe, expect, it } from "vitest";
import { getSeedTemplate, listSeedTemplates } from "@/lib/workspace/seeds/templates";

describe("workspace seed templates", () => {
  it("provides all required phase-2 templates", () => {
    const templates = listSeedTemplates();

    expect(templates).toHaveLength(3);
    expect(templates.map((template) => template.key)).toEqual([
      "d2c_product_launch",
      "performance_refresh",
      "review_sprint",
    ]);
  });

  it("falls back to the default template", () => {
    expect(getSeedTemplate(undefined).key).toBe("d2c_product_launch");
    expect(getSeedTemplate("unknown").key).toBe("d2c_product_launch");
  });

  it("ensures every template is believable on first login", () => {
    for (const template of listSeedTemplates()) {
      expect(template.assets.length).toBeGreaterThanOrEqual(6);
      expect(template.assets.length).toBeLessThanOrEqual(12);
      expect(template.reviewThreads.length).toBeGreaterThanOrEqual(2);
      expect(template.reviewThreads.length).toBeLessThanOrEqual(3);
      expect(template.assets.some((asset) => asset.reviewStatus === "approved")).toBe(true);
      expect(
        template.assets.some((asset) => asset.reviewStatus === "changes_requested"),
      ).toBe(true);
      expect(template.nextAction.title.length).toBeGreaterThan(0);
      expect(template.preparedBlocks.prepared.length).toBeGreaterThan(0);
    }
  });

  it("uses explicit media-source contracts for the flagship demo template", () => {
    const flagshipTemplate = getSeedTemplate("d2c_product_launch");

    expect(
      flagshipTemplate.assets.every((asset) =>
        ["demo_public", "demo_placeholder"].includes(asset.source),
      ),
    ).toBe(true);
    expect(
      flagshipTemplate.assets.some((asset) => asset.source === "demo_public"),
    ).toBe(true);
  });
});
