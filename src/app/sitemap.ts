import { execFileSync } from "child_process";
import type { MetadataRoute } from "next";
import { absoluteUrl, indexableSitemapEntries } from "@/lib/seo";

function getGitLastModified(file: string): string {
  try {
    const result = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", file],
      { encoding: "utf-8" }
    ).trim();
    return result || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSitemapEntries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: getGitLastModified(entry.pageFile),
  }));
}
