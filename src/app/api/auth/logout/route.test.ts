import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/auth/logout/route";

const signOutMock = vi.fn();

vi.mock("@/lib/auth/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: {
      signOut: signOutMock,
    },
  })),
}));

describe("logout route", () => {
  it("signs out the current session and redirects to /login", async () => {
    signOutMock.mockResolvedValue({ error: null });

    const response = await POST(new Request("http://localhost:3000/api/auth/logout", {
      method: "POST",
    }));

    expect(signOutMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
