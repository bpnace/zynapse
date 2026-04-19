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

  it("keeps the seeded demo copy in product-ready German", () => {
    const flagshipTemplate = getSeedTemplate("d2c_product_launch");
    const refreshTemplate = getSeedTemplate("performance_refresh");
    const reviewTemplate = getSeedTemplate("review_sprint");

    expect(flagshipTemplate.nextAction.title).not.toMatch(/proof-getriebenen Launch-Ansatz/i);
    expect(flagshipTemplate.assets[0]?.title).not.toMatch(/Hook 01/i);
    expect(flagshipTemplate.assets[3]?.title).not.toMatch(/Founder-Statement/i);
    expect(flagshipTemplate.preparedBlocks.review).not.toMatch(/Sales-Walkthrough/i);
    expect(flagshipTemplate.preparedBlocks.prepared).not.toMatch(/Launch-Kampagne/i);
    expect(flagshipTemplate.brandProfile.reviewNotes).not.toMatch(/Produkt-Proof/i);
    expect(flagshipTemplate.nextAction.body).not.toMatch(/CTA-Schärfe/i);
    expect(flagshipTemplate.brandProfile.primaryChannels).not.toMatch(/TikTok Spark Ads/i);
    expect(flagshipTemplate.assets[0]?.title).not.toMatch(/Proof-Cut/i);
    expect(flagshipTemplate.assets[5]?.title).not.toMatch(/Retargeting-Erinnerung/i);

    expect(refreshTemplate.label).not.toMatch(/Performance-Refresh/i);
    expect(refreshTemplate.assets[0]?.title).not.toMatch(/Refresh 01/i);
    expect(refreshTemplate.assets[1]?.title).not.toMatch(/Social-Proof-Remix/i);
    expect(refreshTemplate.preparedBlocks.output).not.toMatch(/Creative-Refreshes/i);
    expect(refreshTemplate.nextAction.title).not.toMatch(/Refresh-Varianten/i);
    expect(refreshTemplate.assets[2]?.title).not.toMatch(/UGC-Stil/i);
    expect(refreshTemplate.assets[3]?.title).not.toMatch(/Proof-Frame/i);
    expect(refreshTemplate.campaignName).not.toMatch(/Quartals-Refresh/i);
    expect(refreshTemplate.preparedBlocks.prepared).not.toMatch(/den Refresh/i);

    expect(reviewTemplate.brandProfile.offerSummary).not.toMatch(/Founder-Team/i);
    expect(reviewTemplate.assets[2]?.title).not.toMatch(/Founder-Hinweis/i);
    expect(reviewTemplate.assets[5]?.title).not.toMatch(/Snapshot/i);
    expect(reviewTemplate.nextAction.body).not.toMatch(/Der Workspace zeigt bereits/i);
    expect(reviewTemplate.assets[4]?.title).not.toMatch(/Voice-over/i);
  });
});
