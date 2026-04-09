import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postBrand } from "@/app/api/intake/brand/route";
import { POST as postCreative } from "@/app/api/intake/creative/route";

const FIXED_TIMESTAMP = "2026-04-09T12:34:56.000Z";
const HUMAN_STARTED_AT = Date.parse(FIXED_TIMESTAMP) - 5_000;

describe("brand and creative intake waitlist routing", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_TIMESTAMP));
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("routes brand inquiries to the development waitlist webhook with the full envelope", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv(
      "WAITLIST_WEBHOOK_URL_DEV",
      "https://automation.codariq.de/webhook-test/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://zynapse.eu");

    const response = await postBrand(
      new Request("http://localhost:3000/api/intake/brand", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "user-agent": "vitest-brand",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: "D2C Wellness",
          productUrl: "https://example.com",
          goal: "Conversion-Testing",
          channel: "TikTok",
          budgetRange: "3k bis 8k pro Monat",
          timeline: "Diesen Monat",
          notes: "Optionaler Kontext",
          contactName: "Max Mustermann",
          workEmail: "team@brand.com",
          company: "Beispiel GmbH",
          startedAt: HUMAN_STARTED_AT,
          website: "",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "webhook" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://automation.codariq.de/webhook-test/179939e2-cef1-4b9f-b513-272b356d7e57",
    );

    expect(JSON.parse(String(init.body))).toEqual({
      source: "brand_inquiry",
      env: "development",
      timestamp: FIXED_TIMESTAMP,
      userAgent: "vitest-brand",
      origin: "http://localhost:3000",
      siteUrl: "https://zynapse.eu",
      contact: {
        name: "Max Mustermann",
        email: "team@brand.com",
        company: "Beispiel GmbH",
      },
      raw: {
        industry: "D2C Wellness",
        productUrl: "https://example.com",
        goal: "Conversion-Testing",
        channel: "TikTok",
        budgetRange: "3k bis 8k pro Monat",
        timeline: "Diesen Monat",
        notes: "Optionaler Kontext",
        contactName: "Max Mustermann",
        workEmail: "team@brand.com",
        company: "Beispiel GmbH",
        startedAt: HUMAN_STARTED_AT,
      },
    });
  });

  it("routes creative applications to the production waitlist webhook with the full envelope", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "WAITLIST_WEBHOOK_URL_PROD",
      "https://automation.codariq.de/webhook/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://zynapse.eu");

    const response = await postCreative(
      new Request("https://zynapse.eu/api/intake/creative", {
        method: "POST",
        headers: {
          origin: "https://zynapse.eu",
          "user-agent": "vitest-creative",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Alex Creative",
          email: "alex@example.com",
          portfolioUrl: "https://portfolio.example/alex",
          focusChannels: ["Prompt Engineering", "AI Production"],
          caseSummary:
            "Managed recurring paid social testing for multiple consumer brands and owned concept to delivery.",
          availability: "2 neue Kunden pro Monat",
          compensationNotes: "Retainer oder Projektbasis",
          location: "Berlin / CET",
          startedAt: HUMAN_STARTED_AT,
          website: "",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "webhook" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://automation.codariq.de/webhook/179939e2-cef1-4b9f-b513-272b356d7e57",
    );

    expect(JSON.parse(String(init.body))).toEqual({
      source: "creative_application",
      env: "production",
      timestamp: FIXED_TIMESTAMP,
      userAgent: "vitest-creative",
      origin: "https://zynapse.eu",
      siteUrl: "https://zynapse.eu",
      contact: {
        name: "Alex Creative",
        email: "alex@example.com",
      },
      raw: {
        name: "Alex Creative",
        email: "alex@example.com",
        portfolioUrl: "https://portfolio.example/alex",
        focusChannels: ["Prompt Engineering", "AI Production"],
        caseSummary:
          "Managed recurring paid social testing for multiple consumer brands and owned concept to delivery.",
        availability: "2 neue Kunden pro Monat",
        compensationNotes: "Retainer oder Projektbasis",
        location: "Berlin / CET",
        startedAt: HUMAN_STARTED_AT,
      },
    });
  });
});
