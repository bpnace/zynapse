import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/auth/workspace-login/route";
import { createServiceRoleSupabaseClient } from "@/lib/auth/admin";

vi.mock("@/lib/auth/admin", () => ({
  createServiceRoleSupabaseClient: vi.fn(),
}));

describe("workspace login eligibility route", () => {
  const rpcMock = vi.fn();

  beforeEach(() => {
    vi.mocked(createServiceRoleSupabaseClient).mockReturnValue({
      rpc: rpcMock,
    } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns ok for eligible emails", async () => {
    rpcMock.mockResolvedValue({
      data: true,
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
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(rpcMock).toHaveBeenCalledWith("workspace_login_eligible", {
      target_email: "team@brand.com",
    });
  });

  it("returns 403 for emails without workspace access", async () => {
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

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error:
        "Diese E-Mail hat noch keinen Zugang. Nutze bitte eine eingeladene E-Mail-Adresse oder die Warteliste.",
    });
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
});
