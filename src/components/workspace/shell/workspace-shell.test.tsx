import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/workspace",
}));

afterEach(() => {
  cleanup();
});

describe("WorkspaceShell copy", () => {
  it("formalizes the shell as a Brands Workspace and uses centralized routes", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_admin"
        activeCampaignId="campaign-1"
        showCommercialStep
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(
      screen.getByRole("navigation", { name: "Navigation im betreuten Kampagnenbereich" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Betreuter Kampagnenbereich")).toBeInTheDocument();
    expect(screen.getByText("Zynapse bereitet den nächsten Schritt vor")).toBeInTheDocument();
    expect(screen.getByText("Strukturierte Anfragen und Erstaufnahme")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Heute/i })).toHaveAttribute(
      "href",
      "/workspace",
    );
    expect(screen.getByRole("link", { name: /Kampagne/i })).toHaveAttribute(
      "href",
      "/workspace/campaigns/campaign-1",
    );
    expect(screen.getByRole("link", { name: /^Freigabe/i })).toHaveAttribute(
      "href",
      "/workspace/campaigns/campaign-1/review",
    );
    expect(
      screen.getByRole("link", { name: /^ÜbergabeFreigegebene Varianten und Nachweise/i }),
    ).toHaveAttribute(
      "href",
      "/workspace/campaigns/campaign-1/handover",
    );
    expect(screen.getByRole("link", { name: /Markenkontext/i })).toHaveAttribute(
      "href",
      "/workspace/onboarding",
    );
    expect(screen.getByRole("link", { name: /Briefings/i })).toHaveAttribute(
      "href",
      "/workspace/briefs/new",
    );
    expect(screen.getByRole("link", { name: /Pilotanfrage/i })).toHaveAttribute(
      "href",
      "/workspace/pilot-request?campaignId=campaign-1",
    );
  });

  it("hides the pilot request nav item when the workspace is not commercially ready", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_admin"
        activeCampaignId="campaign-1"
        showCommercialStep={false}
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(
      screen.queryByRole("link", { name: /Pilotanfrage/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Zynapse begleitet die Übergabe")).toBeInTheDocument();
  });
});
