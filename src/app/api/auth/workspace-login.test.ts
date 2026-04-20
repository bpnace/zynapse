import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { POST } from "@/app/api/auth/workspace-login/route";
import { resetLoginRateLimitStore } from "@/lib/auth/login-rate-limit";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  getRequiredSupabaseEnv: () => ({
    url: "https://example.supabase.co",
    anonKey: "anon-key",
  }),
}));

describe("workspace login eligibility route", () => {
  const rpcMock = vi.fn();
  const signInWithOtpMock = vi.fn();

  beforeEach(() => {
    vi.mocked(createClient).mockReturnValue({
      rpc: rpcMock,
      auth: {
        signInWithOtp: signInWithOtpMock,
      },
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetLoginRateLimitStore();
  });

  it("returns ok for eligible emails", async () => {
    rpcMock.mockResolvedValue({
      data: true,
      error: null,
    });
    signInWithOtpMock.mockResolvedValue({
      data: {},
      error: null,
    });

    const response = await POST(
      new Request("http://localhost:3000/api/auth/workspace-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "TEAM@brand.com ",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message:
        "Wenn diese E-Mail für den geschützten Bereich freigeschaltet ist, haben wir einen Code gesendet. Andernfalls nutze bitte die Warteliste.",
    });
    expect(rpcMock).toHaveBeenCalledWith("workspace_login_eligible", {
      target_email: "team@brand.com",
    });
    expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: "team@brand.com",
      options: {
        shouldCreateUser: false,
      },
    });
  });

  it("returns the same generic response for emails without workspace access", async () => {
    rpcMock.mockResolvedValue({
      data: false,
      error: null,
    });

    const response = await POST(
      new Request("http://localhost:3000/api/auth/workspace-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "unknown@example.com",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      message:
        "Wenn diese E-Mail für den geschützten Bereich freigeschaltet ist, haben wir einen Code gesendet. Andernfalls nutze bitte die Warteliste.",
    });
    expect(signInWithOtpMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the service-role rpc fails", async () => {
    rpcMock.mockResolvedValue({
      data: null,
      error: {
        message: "rpc failed",
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/auth/workspace-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "team@brand.com",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Der Login konnte gerade nicht vorbereitet werden.",
    });
  });

  it("rate limits repeated login preparation attempts", async () => {
    rpcMock.mockResolvedValue({
      data: false,
      error: null,
    });

    const request = () =>
      POST(
        new Request("http://localhost:3000/api/auth/workspace-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "203.0.113.10",
          },
          body: JSON.stringify({
            email: "unknown@example.com",
          }),
        }),
      );

    for (let index = 0; index < 5; index += 1) {
      const response = await request();
      expect(response.status).toBe(200);
    }

    const limitedResponse = await request();
    expect(limitedResponse.status).toBe(429);
  });
});
