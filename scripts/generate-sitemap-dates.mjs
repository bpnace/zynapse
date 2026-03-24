import { execFileSync } from "child_process";
import { writeFileSync, mkdirSync } from "fs";

// Keep in sync with indexableSitemapEntries in src/lib/seo.ts
const pageFiles = [
  "src/app/page.tsx",
  "src/app/brands/page.tsx",
  "src/app/creatives/page.tsx",
  "src/app/about/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/contact/page.tsx",
];

const dates = {};
for (const file of pageFiles) {
  try {
    const result = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", file],
      { encoding: "utf-8" }
    ).trim();
    dates[file] = result || new Date().toISOString();
  } catch {
    dates[file] = new Date().toISOString();
  }
}

mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/sitemap-dates.json", JSON.stringify(dates, null, 2) + "\n");
console.log("sitemap-dates.json generated for", Object.keys(dates).length, "pages");
