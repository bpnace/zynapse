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
const resolveBrandDeliveryDetailHrefMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  notFound: notFoundMock,
}));

vi.mock("@/lib/auth/guards", () => ({
  requireWorkspaceAccess: () => requireWorkspaceAccessMock(),
}));

vi.mock("@/lib/workspace/queries/resolve-brand-detail-route", () => ({
  resolveBrandDeliveryDetailHref: (...args: unknown[]) =>
    resolveBrandDeliveryDetailHrefMock(...args),
}));

describe("Brand delivery detail page", () => {
  it("redirects a delivery detail route to the handover screen", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
    });
    resolveBrandDeliveryDetailHrefMock.mockResolvedValue("/brands/campaigns/campaign-1/handover");

    const { default: BrandDeliveryDetailPage } = await import(
      "@/app/(workspace)/brands/deliveries/[deliveryId]/page"
    );

    await expect(
      BrandDeliveryDetailPage({
        params: Promise.resolve({ deliveryId: "workflow-1" }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/brands/campaigns/campaign-1/handover");

    expect(resolveBrandDeliveryDetailHrefMock).toHaveBeenCalledWith({
      organizationId: "org-1",
      deliveryId: "workflow-1",
    });
  });

  it("raises not found when the delivery route cannot be resolved", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
    });
    resolveBrandDeliveryDetailHrefMock.mockResolvedValue(null);

    const { default: BrandDeliveryDetailPage } = await import(
      "@/app/(workspace)/brands/deliveries/[deliveryId]/page"
    );

    await expect(
      BrandDeliveryDetailPage({
        params: Promise.resolve({ deliveryId: "workflow-1" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
