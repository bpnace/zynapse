import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DashboardOverview } from "@/components/workspace/dashboard/dashboard-overview";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";

afterEach(() => {
  cleanup();
});

describe("workspace dashboard copy", () => {
  it("renders the localized onboarding CTA in the overview card", () => {
    render(
      <DashboardOverview
        organizationName="Acme"
        audience="D2C-Skincare-Kundinnen"
        primaryChannels="Meta Paid Social"
        openReviewCount={2}
        approvedAssetCount={1}
        onboardingCompletion={{
          completed: 6,
          total: 6,
          percent: 100,
          isComplete: true,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Kontext prüfen" }),
    ).toHaveAttribute("href", "/brands/onboarding");
  });

  it("renders localized follow-up actions in the next-step card", () => {
    render(
      <NextActionCard
        campaignId="campaign-1"
        builderHref="/brands/campaigns/new"
        title="Bereit für die Freigabe"
        body="Der geschützte Bereich ist bereit für die nächste Freigaberunde."
      />,
    );

    expect(
      screen.getByRole("link", { name: /Kampagnenstand ansehen/i }),
    ).toHaveAttribute("href", "/brands/campaigns/campaign-1");
    expect(
      screen.getByRole("link", { name: "Kampagne erstellen" }),
    ).toHaveAttribute("href", "/brands/campaigns/new");
    expect(screen.getByText("Nächster sinnvoller Schritt")).toBeInTheDocument();
  });

  it("uses the campaign builder as the primary CTA when no campaign exists yet", () => {
    render(
      <NextActionCard
        campaignId={null}
        builderHref="/brands/campaigns/new"
        title="Neue Kampagne anlegen"
        body="Sobald der Markenkontext steht, kann die nächste Kampagne direkt im Builder vorbereitet werden."
      />,
    );

    expect(
      screen.getByRole("link", { name: "Kampagne erstellen" }),
    ).toHaveAttribute("href", "/brands/campaigns/new");
  });

  it("renders seeded next-step copy without mixed-language workspace wording", () => {
    render(
      <NextActionCard
        campaignId={null}
        title="Offene Hinweise aus der Freigabe in eine freigabereife Richtung verdichten"
        body="Der Bereich zeigt bereits, wo sich Feedback aus dem Entscheidungskreis überschneidet und wo die finale Freigabe noch blockiert ist."
      />,
    );

    expect(screen.getByText(/Der Bereich zeigt bereits/i)).toBeInTheDocument();
    expect(screen.queryByText(/Der Workspace zeigt bereits/i)).not.toBeInTheDocument();
  });
});
