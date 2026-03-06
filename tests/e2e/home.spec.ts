import { expect, test } from "@playwright/test";

test("landing page shows both primary audience paths", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /aus einem briefing/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /als brand starten/i,
    }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /als kreative bewerben/i,
    }),
  ).toBeVisible();
});

test("request wizard blocks invalid submissions", async ({ page }) => {
  await page.goto("/request");

  await page.getByRole("button", { name: /weiter/i }).click();

  await expect(page.getByText(/bitte eine branche angeben/i)).toBeVisible();
});
