import { execFileSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync } from "fs";

const routes = JSON.parse(readFileSync("src/lib/seo-routes.json", "utf-8"));
const pageFiles = routes
  .filter((route) => route.sitemap)
  .map((route) => route.pageFile);

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
