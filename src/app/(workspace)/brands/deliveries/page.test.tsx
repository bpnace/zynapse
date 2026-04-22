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

describe("Brand deliveries page", () => {
  it("wires approved assets and the primary CTA to the delivery detail route", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      brandProfile: { website: "https://acme.test" },
    });
    shouldGateBrandHomeMock.mockReturnValue(false);
    getDashboardViewMock.mockResolvedValue({
      latestCampaign: { id: "campaign-1", name: "Spring Launch" },
      latestCampaignWorkflow: { id: "workflow-1" },
      latestAssets: [
        {
          id: "asset-1",
          title: "UGC Cutdown",
          format: "9:16",
          versionLabel: "v3",
          reviewStatus: "approved",
        },
      ],
    });

    const { default: BrandDeliveriesPage } = await import(
      "@/app/(workspace)/brands/deliveries/page"
    );
    render(await BrandDeliveriesPage());

    expect(screen.getByRole("link", { name: "UGC Cutdown" })).toHaveAttribute(
      "href",
      "/brands/deliveries/workflow-1",
    );
    expect(screen.getByRole("link", { name: "Delivery öffnen" })).toHaveAttribute(
      "href",
      "/brands/deliveries/workflow-1",
    );
  });
});
