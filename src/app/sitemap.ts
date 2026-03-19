import type { MetadataRoute } from "next";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSitemapEntries.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
