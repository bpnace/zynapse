import { describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

const requireWorkspaceAccessMock = vi.fn();
const getDashboardViewMock = vi.fn();
const getBrandWorkspaceReadinessMock = vi.fn();
const getBrandProfileCompletionMock = vi.fn();
const shouldGateBrandHomeMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/auth/guards", () => ({
  requireWorkspaceAccess: () => requireWorkspaceAccessMock(),
}));

vi.mock("@/lib/workspace/queries/get-dashboard-view", () => ({
  getDashboardView: () => getDashboardViewMock(),
}));

vi.mock("@/lib/workspace/readiness", () => ({
  getBrandWorkspaceReadiness: (...args: unknown[]) =>
    getBrandWorkspaceReadinessMock(...args),
}));

vi.mock("@/lib/workspace/profile-completion", () => ({
  getBrandProfileCompletion: (...args: unknown[]) =>
    getBrandProfileCompletionMock(...args),
  shouldGateBrandHome: (...args: unknown[]) => shouldGateBrandHomeMock(...args),
}));

describe("Brands home page", () => {
  it("redirects incomplete brand profiles back to onboarding", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1", name: "Acme" },
      brandProfile: { website: "" },
    });
    getDashboardViewMock.mockResolvedValue({});
    getBrandWorkspaceReadinessMock.mockReturnValue({});
    getBrandProfileCompletionMock.mockReturnValue({
      completed: 6,
      total: 7,
      percent: 86,
      isComplete: false,
    });
    shouldGateBrandHomeMock.mockReturnValue(true);

    const { default: BrandsHomePage } = await import("@/app/(workspace)/brands/today/page");

    await expect(BrandsHomePage()).rejects.toThrow(
      "NEXT_REDIRECT:/brands/onboarding",
    );
    expect(redirectMock).toHaveBeenCalledWith("/brands/onboarding");
  });
});
