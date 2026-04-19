import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardOverview } from "@/components/workspace/dashboard/dashboard-overview";
import { NextActionCard } from "@/components/workspace/dashboard/next-action-card";

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
    ).toHaveAttribute("href", "/workspace/onboarding");
  });

  it("renders localized follow-up actions in the next-step card", () => {
    render(
      <NextActionCard
        campaignId="campaign-1"
        briefHref="/workspace/briefs/new"
        title="Bereit für die Freigabe"
        body="Der geschützte Bereich ist bereit für die nächste Freigaberunde."
      />,
    );

    expect(
      screen.getByRole("link", { name: /Kampagnenstand ansehen/i }),
    ).toHaveAttribute("href", "/workspace/campaigns/campaign-1");
    expect(
      screen.getByRole("link", { name: "Briefing erstellen" }),
    ).toHaveAttribute("href", "/workspace/briefs/new");
    expect(
      screen.getByText(/Den nächsten Auftrag stößt Zynapse erst an/i),
    ).toBeInTheDocument();
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
