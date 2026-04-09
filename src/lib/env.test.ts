import { afterEach, describe, expect, it, vi } from "vitest";
import { getEnv } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getEnv", () => {
  it("does not expose webhook endpoints when webhook env vars are unset", () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL_DEV", "");
    vi.stubEnv("WAITLIST_WEBHOOK_URL_PROD", "");
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "");
    vi.stubEnv("INTAKE_WEBHOOK_URL", "");
    vi.stubEnv("PILOT_REQUEST_WEBHOOK_URL", "");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("");
    expect(env.intakeWebhookUrl).toBe("");
    expect(env.pilotRequestWebhookUrl).toBe("");
  });

  it("uses the development waitlist webhook when not in production", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("WAITLIST_WEBHOOK_URL_DEV", "https://example.com/waitlist-dev");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("https://example.com/waitlist-dev");
  });

  it("uses the production waitlist webhook in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("WAITLIST_WEBHOOK_URL_PROD", "https://example.com/waitlist-prod");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("https://example.com/waitlist-prod");
  });

  it("keeps the legacy waitlist webhook fallback", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("WAITLIST_WEBHOOK_URL_DEV", "");
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "https://example.com/waitlist-legacy");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("https://example.com/waitlist-legacy");
  });
});
