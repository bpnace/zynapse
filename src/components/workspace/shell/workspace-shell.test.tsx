import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/brands/today",
}));

afterEach(() => {
  cleanup();
});

describe("WorkspaceShell copy", () => {
  it("formalizes the shell as a Brands Workspace and uses canonical brand routes", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_owner"
        activeCampaignId="campaign-1"
        showCommercialStep
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(
      screen.getByRole("navigation", { name: "Navigation im betreuten Kampagnenbereich" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Client Portal")).toBeInTheDocument();
    expect(
      screen.getByText("Freigabe, Übergabe und nächster Schritt in einer ruhigen Kundenansicht."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Heute/i })).toHaveAttribute(
      "href",
      "/brands/today",
    );
    expect(screen.getByRole("link", { name: /Kampagne/i })).toHaveAttribute(
      "href",
      "/brands/campaigns/campaign-1",
    );
    expect(screen.getByRole("link", { name: /^Freigabe$/i })).toHaveAttribute(
      "href",
      "/brands/campaigns/campaign-1/review",
    );
    expect(
      screen.getByRole("link", { name: /^Übergabe$/i }),
    ).toHaveAttribute(
      "href",
      "/brands/campaigns/campaign-1/handover",
    );
    expect(screen.getByRole("link", { name: /Markenkontext/i })).toHaveAttribute(
      "href",
      "/brands/onboarding",
    );
    expect(screen.getByRole("link", { name: /Briefings/i })).toHaveAttribute(
      "href",
      "/brands/briefs/new",
    );
    expect(screen.getByRole("link", { name: /Pilotanfrage/i })).toHaveAttribute(
      "href",
      "/brands/pilot-request?campaignId=campaign-1",
    );
  });

  it("hides the pilot request nav item when the workspace is not commercially ready", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_owner"
        activeCampaignId="campaign-1"
        showCommercialStep={false}
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(
      screen.queryByRole("link", { name: /Pilotanfrage/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Freigabe und Übergabe in einer ruhigen Kundenansicht."),
    ).toBeInTheDocument();
  });
});
