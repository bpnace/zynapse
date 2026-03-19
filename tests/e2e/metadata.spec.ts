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
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
    "content",
    /max-snippet:-1/i,
  );
  await expect(page.locator('head meta[name="googlebot"]')).toHaveAttribute(
    "content",
    /max-image-preview:large/i,
  );

  const jsonLdScripts = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdScripts).toHaveCount(2);
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
