import { describe, expect, it, vi } from "vitest";

const { redirectMock, notFoundMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  notFoundMock: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const requireWorkspaceAccessMock = vi.fn();
const resolveBrandReviewDetailHrefMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  notFound: notFoundMock,
}));

vi.mock("@/lib/auth/guards", () => ({
  requireWorkspaceAccess: () => requireWorkspaceAccessMock(),
}));

vi.mock("@/lib/workspace/queries/resolve-brand-detail-route", () => ({
  resolveBrandReviewDetailHref: (...args: unknown[]) =>
    resolveBrandReviewDetailHrefMock(...args),
}));

describe("Brand review detail page", () => {
  it("redirects a thread detail route to the underlying campaign review screen", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
    });
    resolveBrandReviewDetailHrefMock.mockResolvedValue(
      "/brands/campaigns/campaign-1/review?asset=asset-1",
    );

    const { default: BrandReviewDetailPage } = await import(
      "@/app/(workspace)/brands/reviews/[reviewId]/page"
    );

    await expect(
      BrandReviewDetailPage({
        params: Promise.resolve({ reviewId: "thread-1" }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/brands/campaigns/campaign-1/review?asset=asset-1");

    expect(resolveBrandReviewDetailHrefMock).toHaveBeenCalledWith({
      organizationId: "org-1",
      reviewId: "thread-1",
    });
  });

  it("raises not found when the thread cannot be resolved", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
    });
    resolveBrandReviewDetailHrefMock.mockResolvedValue(null);

    const { default: BrandReviewDetailPage } = await import(
      "@/app/(workspace)/brands/reviews/[reviewId]/page"
    );

    await expect(
      BrandReviewDetailPage({
        params: Promise.resolve({ reviewId: "thread-1" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
