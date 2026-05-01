import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";
import { indexableMarketingRoutes } from "@/lib/seo-routes";
import sitemap from "@/app/sitemap";
import sitemapDates from "@/generated/sitemap-dates.json";

describe("sitemap", () => {
  it("returns all indexable marketing URLs with lastModified dates", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(indexableSitemapEntries.length);
    expect(entries).toHaveLength(indexableMarketingRoutes.length);

    for (const route of indexableMarketingRoutes) {
      const entry = entries.find((e) => e.url === absoluteUrl(route.path));
      expect(entry).toBeDefined();
      expect(typeof entry!.lastModified).toBe("string");
      expect(new Date(entry!.lastModified as string).getTime()).not.toBeNaN();
    }
  });

  it("keeps generated sitemap dates aligned with the route registry", () => {
    const sitemapRouteFiles = indexableMarketingRoutes.map((route) => route.pageFile);

    expect(Object.keys(sitemapDates).sort()).toEqual([...sitemapRouteFiles].sort());
  });

  it("keeps the sitemap date script sourced from the route registry", () => {
    const script = readFileSync(
      join(process.cwd(), "scripts/generate-sitemap-dates.mjs"),
      "utf8",
    );

    expect(script).toContain("src/lib/seo-routes.json");
    expect(script).not.toContain("src/app/legal/privacy/page.tsx");
    expect(script).not.toContain("src/app/request/page.tsx");
  });
});
