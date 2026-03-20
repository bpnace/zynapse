import { describe, expect, it } from "vitest";
import { GET } from "@/app/sitemap.xml/route";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";
import { buildSitemapXml } from "@/lib/sitemap";

describe("sitemap route", () => {
  it("serves a minimal XML sitemap for the canonical marketing URLs", async () => {
    const response = await GET();
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("cache-control")).toBe(
      "public, max-age=0, s-maxage=86400",
    );
    expect(xml).toBe(buildSitemapXml());
    expect(xml).not.toContain("<changefreq>");
    expect(xml).not.toContain("<priority>");

    for (const route of indexableSitemapEntries) {
      expect(xml).toContain(`<loc>${absoluteUrl(route.path)}</loc>`);
    }
  });
});
