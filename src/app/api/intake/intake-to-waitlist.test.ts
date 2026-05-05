import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as postBrand } from "@/app/api/intake/brand/route";
import { POST as postCreative } from "@/app/api/intake/creative/route";
import { POST as postWaitlist } from "@/app/api/waitlist/route";
import { resetIntakeRateLimitStore } from "@/lib/intake/rate-limit";

const FIXED_TIMESTAMP = "2026-04-09T12:34:56.000Z";
const HUMAN_STARTED_AT = Date.parse(FIXED_TIMESTAMP) - 5_000;

describe("webforms and waitlist routing", () => {
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
    resetIntakeRateLimitStore();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("routes brand inquiries to the webforms intake webhook with the full envelope", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv(
      "INTAKE_WEBHOOK_URL",
      "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05",
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
          targetAudience: "Performance-Marketing Teams",
          keyBarrier: "Zu wenig trust im ersten Touchpoint",
          channels: ["TikTok", "Instagram Reels"],
          budgetRange: "3k bis 8k pro Monat",
          styleDirection: "Premium UGC mit Product Proof",
          timeline: "Diesen Monat",
          reviewContext: "Founder gibt Claims frei",
          notes: "Optionaler Kontext",
          contactName: "Max Mustermann",
          workEmail: "team@brand.com",
          company: "Beispiel GmbH",
          newsletterOptIn: true,
          datenschutzAccepted: true,
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
      "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05",
    );

    expect(JSON.parse(String(init.body))).toEqual({
      kind: "brand",
      origin: "http://localhost:3000",
      siteUrl: "https://zynapse.eu",
      notifyEmail: "ops@zynapse.eu",
      submittedAt: FIXED_TIMESTAMP,
      payload: {
        industry: "D2C Wellness",
        productUrl: "https://example.com",
        goal: "Conversion-Testing",
        targetAudience: "Performance-Marketing Teams",
        keyBarrier: "Zu wenig trust im ersten Touchpoint",
        channels: ["TikTok", "Instagram Reels"],
        budgetRange: "3k bis 8k pro Monat",
        styleDirection: "Premium UGC mit Product Proof",
        timeline: "Diesen Monat",
        reviewContext: "Founder gibt Claims frei",
        notes: "Optionaler Kontext",
        contactName: "Max Mustermann",
        workEmail: "team@brand.com",
        company: "Beispiel GmbH",
        newsletterOptIn: true,
        datenschutzAccepted: true,
        startedAt: HUMAN_STARTED_AT,
        userAgent: "vitest-brand",
        website: "",
      },
    });
  });

  it("routes minimum quick brand inquiries without optional briefing fields", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv(
      "INTAKE_WEBHOOK_URL",
      "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05",
    );
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://zynapse.eu");

    const response = await postBrand(
      new Request("http://localhost:3000/api/intake/brand", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "user-agent": "vitest-brand-minimum",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productUrl: "Neues Serum",
          goal: "Launch testen",
          contactName: "Mia Brand",
          workEmail: "mia.quick@example.com",
          company: "Hydra Labs",
          datenschutzAccepted: true,
          startedAt: HUMAN_STARTED_AT,
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "webhook" });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(JSON.parse(String(init.body))).toMatchObject({
      kind: "brand",
      origin: "http://localhost:3000",
      siteUrl: "https://zynapse.eu",
      payload: {
        industry: "",
        productUrl: "Neues Serum",
        goal: "Launch testen",
        channels: [],
        budgetRange: "",
        timeline: "",
        notes: "",
        contactName: "Mia Brand",
        workEmail: "mia.quick@example.com",
        company: "Hydra Labs",
        newsletterOptIn: false,
        datenschutzAccepted: true,
        startedAt: HUMAN_STARTED_AT,
        userAgent: "vitest-brand-minimum",
        website: "",
      },
    });
  });

  it("retries the active waitlist webhook when the development webhook-test endpoint is inactive", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv(
      "WAITLIST_WEBHOOK_URL_DEV",
      "https://automation.codariq.de/webhook-test/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
    vi.stubEnv(
      "WAITLIST_WEBHOOK_URL_PROD",
      "https://automation.codariq.de/webhook/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://zynapse.eu");
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
      });

    const response = await postWaitlist(
      new Request("http://localhost:3000/api/waitlist", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "user-agent": "vitest-waitlist-dev-webhook-inactive",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "alex.local@example.com",
          startedAt: HUMAN_STARTED_AT,
          website: "",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, mode: "webhook" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://automation.codariq.de/webhook-test/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "https://automation.codariq.de/webhook/179939e2-cef1-4b9f-b513-272b356d7e57",
    );
  });

  it("routes creative applications to the webforms intake webhook with the full envelope", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(
      "INTAKE_WEBHOOK_URL",
      "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05",
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
          newsletterOptIn: true,
          datenschutzAccepted: true,
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
      "https://automation.codariq.de/webhook/95d1df54-a4c7-449c-9f02-531a75922e05",
    );

    expect(JSON.parse(String(init.body))).toEqual({
      kind: "creative",
      origin: "https://zynapse.eu",
      siteUrl: "https://zynapse.eu",
      notifyEmail: "ops@zynapse.eu",
      submittedAt: FIXED_TIMESTAMP,
      payload: {
        name: "Alex Creative",
        email: "alex@example.com",
        portfolioUrl: "https://portfolio.example/alex",
        focusChannels: ["Prompt Engineering", "AI Production"],
        caseSummary:
          "Managed recurring paid social testing for multiple consumer brands and owned concept to delivery.",
        availability: "2 neue Kunden pro Monat",
        compensationNotes: "Retainer oder Projektbasis",
        location: "Berlin / CET",
        newsletterOptIn: true,
        datenschutzAccepted: true,
        startedAt: HUMAN_STARTED_AT,
        userAgent: "vitest-creative",
        website: "",
      },
    });
  });

  it("rate limits repeated brand submissions with the same ip and email", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv(
      "WAITLIST_WEBHOOK_URL_DEV",
      "https://automation.codariq.de/webhook-test/179939e2-cef1-4b9f-b513-272b356d7e57",
    );

    for (let index = 0; index < 5; index += 1) {
      const response = await postBrand(
        new Request("http://localhost:3000/api/intake/brand", {
          method: "POST",
          headers: {
            origin: "http://localhost:3000",
            "x-forwarded-for": "203.0.113.1",
            "user-agent": "vitest-brand",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            industry: "D2C Wellness",
            productUrl: "https://example.com",
            goal: "Conversion-Testing",
            channels: ["TikTok"],
            budgetRange: "3k bis 8k pro Monat",
            timeline: "Diesen Monat",
            notes: "Optionaler Kontext",
            contactName: "Max Mustermann",
            workEmail: "team@brand.com",
            company: "Beispiel GmbH",
            datenschutzAccepted: true,
            startedAt: HUMAN_STARTED_AT,
            website: "",
          }),
        }),
      );

      expect(response.status).toBe(200);
    }

    const blockedResponse = await postBrand(
      new Request("http://localhost:3000/api/intake/brand", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "x-forwarded-for": "203.0.113.1",
          "user-agent": "vitest-brand",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: "D2C Wellness",
          productUrl: "https://example.com",
          goal: "Conversion-Testing",
          channels: ["TikTok"],
          budgetRange: "3k bis 8k pro Monat",
          timeline: "Diesen Monat",
          notes: "Optionaler Kontext",
          contactName: "Max Mustermann",
          workEmail: "team@brand.com",
          company: "Beispiel GmbH",
          datenschutzAccepted: true,
          startedAt: HUMAN_STARTED_AT,
          website: "",
        }),
      }),
    );

    expect(blockedResponse.status).toBe(429);
    await expect(blockedResponse.json()).resolves.toEqual({
      error: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut.",
    });
  });
});
