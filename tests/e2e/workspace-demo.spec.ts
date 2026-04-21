import { expect, test, type Page } from "@playwright/test";

const demoEmail =
  process.env.E2E_WORKSPACE_EMAIL ??
  process.env.DEMO_WORKSPACE_EMAIL ??
  "demo@zynapse.eu";

const demoPassword = process.env.E2E_WORKSPACE_PASSWORD ?? "D3mo1234!";
const creativeDemoEmail =
  process.env.DEMO_WORKSPACE_CREATIVE_EMAIL ??
  (() => {
    const [localPart, domain] = demoEmail.split("@");
    return localPart && domain ? `${localPart}+creative@${domain}` : "demo+creative@zynapse.eu";
  })();

async function dismissCookieBanner(page: Page) {
  const rejectButton = page.getByRole("button", { name: /alles ablehnen/i });

  if (await rejectButton.isVisible().catch(() => false)) {
    await rejectButton.click();
  }
}

test("closed demo login reaches the seeded review and handover workflow", async ({
  page,
}) => {
  test.setTimeout(120_000);

  await page.goto("/demo-login");
  await dismissCookieBanner(page);

  await expect(
    page.getByRole("heading", {
      name: /der private kundenbereich für den aktuellen zynapse-stand/i,
    }),
  ).toBeVisible();

  await page.getByLabel(/geschäftliche e-mail/i).fill(demoEmail);
  await page.getByLabel(/passwort/i).fill(demoPassword);
  await page.getByRole("button", { name: /mit passwort anmelden/i }).click();
  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/brands\/today(?:\?.*)?$/);

  await expect(
    page.getByRole("heading", { name: /daily glow serum · kampagnenstart/i }).first(),
  ).toBeVisible();
  await expect(page.getByText(/geschlossene demo/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /kampagne öffnen/i })).toBeVisible();

  await page.getByRole("link", { name: /freigabe öffnen/i }).click();
  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/brands\/campaigns\/[^/]+\/review(?:\?.*)?$/);

  await expect(page.getByText(/^freigaberaum$/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /daily glow serum · kampagnenstart/i }),
  ).toBeVisible();
  await expect(page.getByTestId("review-selected-asset-preview")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /übergabeprotokoll prüfen/i }),
  ).toBeVisible();

  await page.getByRole("link", { name: /übergabeprotokoll prüfen/i }).click();
  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/brands\/campaigns\/[^/]+\/handover(?:\?.*)?$/);

  await expect(page.getByText(/^übergabeprotokoll$/i)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /daily glow serum · kampagnenstart/i }),
  ).toBeVisible();
  await expect(page.getByText(/freigegebene varianten/i).first()).toBeVisible();
  await expect(
    page.getByText(/kommerzieller schritt noch gesperrt/i),
  ).toBeVisible();
});

test("closed demo login also routes the creative demo account into the creative workspace", async ({
  page,
}) => {
  test.setTimeout(120_000);

  await page.goto("/demo-login");
  await dismissCookieBanner(page);

  await expect(
    page.getByRole("heading", {
      name: /der private kundenbereich für den aktuellen zynapse-stand/i,
    }),
  ).toBeVisible();

  await page.getByLabel(/geschäftliche e-mail/i).fill(creativeDemoEmail);
  await page.getByLabel(/passwort/i).fill(demoPassword);
  await page.getByRole("button", { name: /mit passwort anmelden/i }).click();

  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/creatives\/tasks(?:\?.*)?$/);

  await expect(page.getByText(/creatives workspace/i).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /daily glow serum · kampagnenstart/i }),
  ).toBeVisible();
  await expect(page.getByText(/rolle creative_lead/i)).toBeVisible();

  await page.getByRole("link", { name: /assigned campaigns/i }).click();
  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/creatives\/campaigns(?:\?.*)?$/);
  await expect(
    page.getByRole("heading", { name: /aktive kampagnen und task-räume/i }),
  ).toBeVisible();

  await page.getByRole("link", { name: /feedback/i }).click();
  await expect
    .poll(() => page.url(), { timeout: 30_000 })
    .toMatch(/\/creatives\/feedback(?:\?.*)?$/);
  await expect(
    page.getByRole("heading", { name: /offene revisionen und rückfragen/i }),
  ).toBeVisible();
});
