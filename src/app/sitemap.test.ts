import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";

describe("sitemap route", () => {
  it("includes only the indexable marketing pages with stable crawl hints", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(indexableSitemapEntries.length);
    expect(entries).toEqual(
      indexableSitemapEntries.map((route) => ({
        url: absoluteUrl(route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })),
    );
  });
});
