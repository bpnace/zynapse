import type { MetadataRoute } from "next";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";
import sitemapDates from "@/generated/sitemap-dates.json";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified:
      sitemapDates[entry.pageFile as keyof typeof sitemapDates] ??
      new Date().toISOString(),
  }));
}
