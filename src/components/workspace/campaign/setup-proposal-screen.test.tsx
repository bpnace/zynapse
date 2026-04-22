import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SetupProposalScreen } from "@/components/workspace/campaign/setup-proposal-screen";

vi.mock("@/lib/workspace/actions/approve-campaign-setup", () => ({
  approveCampaignSetup: vi.fn(),
}));

afterEach(() => {
  cleanup();
});

describe("SetupProposalScreen", () => {
  it("renders a setup approval button when the brand can approve the setup", () => {
    render(
      <SetupProposalScreen
        campaign={{
          id: "campaign-1",
          name: "Spring Launch",
          campaignGoal: "Launch a new hero offer",
          packageTier: "starter",
          currentStage: "setup_planned",
        }}
        brief={{
          offer: "Hero serum",
          audience: "Returning skincare buyers",
          channels: "Meta, TikTok",
          hooks: "Problem-solution UGC",
          creativeReferences: "Top ad references",
          budgetRange: "15k-20k",
          timeline: "4 weeks",
          approvalNotes: "Founder reviews final claims",
        }}
        proposal={{
          heading: "UGC concept with fast testing loop",
          body: "Lead with pain-point framing and tighten the CTA handoff.",
        }}
        canApproveSetup
        stageItems={[
          { stageKey: "brief_received", status: "completed" },
          { stageKey: "setup_planned", status: "in_progress" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: /Setup freigeben/i })).toBeInTheDocument();
  });

  it("hides the approval button once the setup is already past the setup-planned stage", () => {
    render(
      <SetupProposalScreen
        campaign={{
          id: "campaign-1",
          name: "Spring Launch",
          campaignGoal: "Launch a new hero offer",
          packageTier: "starter",
          currentStage: "production_ready",
        }}
        brief={null}
        proposal={{
          heading: "UGC concept with fast testing loop",
          body: "Lead with pain-point framing and tighten the CTA handoff.",
        }}
        canApproveSetup
        stageItems={[
          { stageKey: "brief_received", status: "completed" },
          { stageKey: "setup_planned", status: "completed" },
        ]}
      />,
    );

    expect(screen.queryByRole("button", { name: /Setup freigeben/i })).not.toBeInTheDocument();
  });
});
