import { describe, expect, it } from "vitest";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("returns all indexable marketing URLs with metadata", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(indexableSitemapEntries.length);

    for (const route of indexableSitemapEntries) {
      const entry = entries.find((e) => e.url === absoluteUrl(route.path));
      expect(entry).toBeDefined();
      expect(entry!.changeFrequency).toBe(route.changeFrequency);
      expect(entry!.priority).toBe(route.priority);
      expect(entry!.lastModified).toBeInstanceOf(Date);
    }
  });
});
