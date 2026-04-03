import { afterEach, describe, expect, it, vi } from "vitest";
import { getEnv } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getEnv", () => {
  it("does not expose webhook endpoints when webhook env vars are unset", () => {
    vi.stubEnv("WAITLIST_WEBHOOK_URL", "");
    vi.stubEnv("INTAKE_WEBHOOK_URL", "");
    vi.stubEnv("PILOT_REQUEST_WEBHOOK_URL", "");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("");
    expect(env.intakeWebhookUrl).toBe("");
    expect(env.pilotRequestWebhookUrl).toBe("");
  });

  it("reuses the intake webhook for related flows when only that env var is set", () => {
    vi.stubEnv("INTAKE_WEBHOOK_URL", "https://example.com/intake");

    const env = getEnv();

    expect(env.waitlistWebhookUrl).toBe("https://example.com/intake");
    expect(env.intakeWebhookUrl).toBe("https://example.com/intake");
    expect(env.pilotRequestWebhookUrl).toBe("https://example.com/intake");
  });
});
