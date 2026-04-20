import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BrandsLayout from "@/app/(workspace)/brands/layout";

const requireWorkspaceAccessMock = vi.fn();
const getDashboardViewMock = vi.fn();
const getBrandWorkspaceReadinessMock = vi.fn();
const workspaceShellMock = vi.fn();

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

vi.mock("@/components/workspace/shell/workspace-shell", () => ({
  WorkspaceShell: (props: Record<string, unknown>) => {
    workspaceShellMock(props);
    return <div data-testid="workspace-shell">{props.children as ReactNode}</div>;
  },
}));

describe("BrandsLayout", () => {
  it("drives shell commercial visibility through the readiness helper", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1", name: "Acme" },
      membership: { role: "brand_owner" },
      brandProfile: { website: "https://acme.test" },
      demo: { isReadOnly: false },
    });
    getDashboardViewMock.mockResolvedValue({
      latestCampaign: { id: "campaign-1" },
      latestCampaignWorkflow: {
        reviewStatus: "approved",
        deliveryStatus: "ready",
        commercialStatus: "ready_for_pilot",
      },
      latestAssets: [{ reviewStatus: "approved" }],
      reviewThreadCount: 0,
      stageItems: [{ stageKey: "approved", status: "in_progress" }],
    });
    getBrandWorkspaceReadinessMock.mockReturnValue({
      showCommercialStep: true,
    });

    const tree = await BrandsLayout({ children: <div>child</div> });
    render(tree);

    expect(getBrandWorkspaceReadinessMock).toHaveBeenCalledWith({
      stageItems: [{ stageKey: "approved", status: "in_progress" }],
      latestAssets: [{ reviewStatus: "approved" }],
      openReviewCount: 0,
      workflowState: {
        reviewStatus: "approved",
        deliveryStatus: "ready",
        commercialStatus: "ready_for_pilot",
      },
    });
    expect(workspaceShellMock).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationName: "Acme",
        activeCampaignId: "campaign-1",
        showCommercialStep: true,
      }),
    );
    expect(screen.getByTestId("workspace-shell")).toHaveTextContent("child");
  });
});
