import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampaignRequestBuilder } from "@/components/workspace/campaign-request/campaign-request-builder";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock("@/lib/workspace/actions/save-brief-draft", () => ({
  saveBriefDraft: vi.fn(),
}));

vi.mock("@/lib/workspace/actions/submit-campaign-request", () => ({
  submitCampaignRequest: vi.fn(),
}));

describe("CampaignRequestBuilder", () => {
  it("renders the Phase 2 campaign builder framing and recent requests", () => {
    render(
      <CampaignRequestBuilder
        demo={{
          canonicalEmail: "demo@zynapse.eu",
          organizationSlug: "acme",
          loginRoute: "/demo-login",
          isEnabled: true,
          isDemoWorkspace: false,
          isReadOnly: false,
          shellBadge: "Demo",
          shellDescription: "desc",
          mutationMessage: "read only",
        }}
        initialValues={{
          title: "",
          objective: "",
          offer: "",
          audience: "",
          channels: "",
          hooks: "",
          creativeReferences: "",
          budgetRange: "",
          timeline: "",
          approvalNotes: "",
        }}
        recentRequests={[
          {
            id: "brief-1",
            title: "Hero serum launch",
            status: "draft",
            startedAt: new Date("2026-04-21T10:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(screen.getByText("Campaign Builder")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Neue Kampagne anlegen/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entwurf speichern/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Hero serum launch/i }),
    ).toHaveAttribute("href", "/brands/campaigns/new?draft=brief-1");
  });
});
