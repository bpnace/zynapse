import { expect, test } from "@playwright/test";

test("landing page shows both primary audience paths", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /from one brief to a finished video campaign/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /kampagne anfragen/i,
    }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: /als social media manager beitreten/i,
    }),
  ).toBeVisible();
});

test("request wizard blocks invalid submissions", async ({ page }) => {
  await page.goto("/request");

  await page.getByRole("button", { name: /weiter/i }).click();

  await expect(page.getByText(/bitte eine branche angeben/i)).toBeVisible();
});
