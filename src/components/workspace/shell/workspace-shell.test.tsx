import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";

const { pathnameState } = vi.hoisted(() => ({
  pathnameState: {
    pathname: "/brands/home",
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameState.pathname,
}));

vi.mock("@/components/layout/wordmark", () => ({
  Wordmark: ({ href = "/" }: { href?: string }) => <a href={href}>Zynapse</a>,
}));

afterEach(() => {
  cleanup();
  pathnameState.pathname = "/brands/home";
});

describe("WorkspaceShell", () => {
  it("renders the refreshed brand shell nav plus identity actions", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_owner"
        website="https://acme.test"
        activeCampaignId="campaign-1"
        showCommercialStep
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(screen.getByRole("navigation", { name: "Navigation im Brands Workspace" })).toBeInTheDocument();
    expect(screen.getAllByText("Brands Workspace")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Zynapse" })).toHaveLength(2);
    expect(screen.getAllByLabelText("Acme avatar")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })[0]).toHaveAttribute(
      "href",
      "/brands/profile",
    );
    expect(screen.getAllByRole("button", { name: /Logout/i })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute("href", "/brands/home");
    expect(
      screen
        .getAllByRole("link", { name: /Campaigns/i })
        .some((link) => link.getAttribute("href") === "/brands/campaigns"),
    ).toBe(true);
    expect(screen.getByRole("link", { name: /New Campaign/i })).toHaveAttribute(
      "href",
      "/brands/campaigns/new",
    );
    expect(screen.getByRole("link", { name: /Reviews/i })).toHaveAttribute(
      "href",
      "/brands/reviews",
    );
    expect(screen.getByRole("link", { name: /Deliveries/i })).toHaveAttribute(
      "href",
      "/brands/deliveries",
    );
    expect(screen.getByRole("link", { name: /Assets/i })).toHaveAttribute(
      "href",
      "/brands/assets",
    );
    expect(screen.getByRole("link", { name: /Brand Profile/i })).toHaveAttribute(
      "href",
      "/brands/profile",
    );
    expect(screen.getByRole("link", { name: /Team/i })).toHaveAttribute("href", "/brands/team");
    expect(screen.getByRole("link", { name: /Billing/i })).toHaveAttribute(
      "href",
      "/brands/billing",
    );
    expect(screen.getByRole("link", { name: /Pilot Request/i })).toHaveAttribute(
      "href",
      "/brands/pilot-request?campaignId=campaign-1",
    );
  });

  it("marks review-facing routes as active through the new review section", () => {
    pathnameState.pathname = "/brands/campaigns/campaign-1/review";

    render(
      <WorkspaceShell organizationName="Acme" role="brand_owner">
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(screen.getByRole("link", { name: /Reviews/i }).className).toContain(
      "workspace-nav-item-active",
    );
  });
});
