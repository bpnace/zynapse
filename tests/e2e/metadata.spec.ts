import { expect, test } from "@playwright/test";

test("home page exposes indexable metadata for search and AI crawlers", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('html')).toHaveAttribute("lang", "de");
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://zynapse.eu",
  );
  await expect(page.locator('head meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "de_DE",
  );
  await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
    "content",
    /opengraph-image\.png/,
  );
  await expect(page.locator('head meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    /twitter-image\.png/,
  );
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
    "content",
    /max-snippet:-1/i,
  );
  await expect(page.locator('head meta[name="googlebot"]')).toHaveAttribute(
    "content",
    /max-image-preview:large/i,
  );

  const jsonLdScripts = page.locator('script[type="application/ld+json"]');
  const jsonLdNodes = await jsonLdScripts.evaluateAll((scripts) =>
    scripts.flatMap((script) => {
      const payload = JSON.parse(script.textContent ?? "{}");

      return Array.isArray(payload["@graph"]) ? payload["@graph"] : [payload];
    }),
  );
  const jsonLdTypes = jsonLdNodes.flatMap((node) =>
    Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]],
  );
  const jsonLdIds = jsonLdNodes.map((node) => node["@id"]).filter(Boolean);

  expect(jsonLdTypes).toEqual(
    expect.arrayContaining([
      "Organization",
      "WebSite",
      "WebPage",
      "Service",
      "FAQPage",
    ]),
  );
  expect(jsonLdIds).toEqual(
    expect.arrayContaining([
      "https://zynapse.eu/#organization",
      "https://zynapse.eu/#website",
      "https://zynapse.eu/#webpage",
      "https://zynapse.eu/#service",
      "https://zynapse.eu/#faq",
    ]),
  );
});

test("request page is crawlable but noindexed", async ({ page }) => {
  await page.goto("/request");

  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://zynapse.eu/request",
  );
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
  await expect(page.locator('head meta[name="googlebot"]')).toHaveAttribute(
    "content",
    /noindex/i,
  );
});
