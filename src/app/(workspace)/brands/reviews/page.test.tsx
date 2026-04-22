import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

const requireWorkspaceAccessMock = vi.fn();
const getDashboardViewMock = vi.fn();
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

vi.mock("@/lib/workspace/profile-completion", () => ({
  shouldGateBrandHome: (...args: unknown[]) => shouldGateBrandHomeMock(...args),
}));

describe("Brand reviews page", () => {
  it("wires review thread links and the primary CTA to the detail route", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      brandProfile: { website: "https://acme.test" },
    });
    shouldGateBrandHomeMock.mockReturnValue(false);
    getDashboardViewMock.mockResolvedValue({
      latestCampaign: { id: "campaign-1", name: "Spring Launch" },
      reviewThreads: [
        {
          threadId: "thread-1",
          assetTitle: "Hook Cut",
          comments: [{ body: "Sharpen the opening." }],
        },
      ],
    });

    const { default: BrandReviewsPage } = await import("@/app/(workspace)/brands/reviews/page");
    render(await BrandReviewsPage());

    expect(screen.getByRole("link", { name: "Hook Cut" })).toHaveAttribute(
      "href",
      "/brands/reviews/thread-1",
    );
    expect(screen.getByRole("link", { name: "Review öffnen" })).toHaveAttribute(
      "href",
      "/brands/reviews/thread-1",
    );
  });
});
