import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PilotRequestFlow } from "@/components/workspace/pilot/pilot-request-flow";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/lib/workspace/actions/submit-pilot-request", () => ({
  submitPilotRequest: vi.fn(),
}));

const campaigns = [
  {
    id: "campaign-a",
    name: "Launch Sprint",
    packageTier: "Starter",
    currentStage: "in_review",
  },
  {
    id: "campaign-b",
    name: "Growth Refresh",
    packageTier: "Growth",
    currentStage: "approved",
  },
];

const demo = {
  canonicalEmail: "demo@zynapse.eu",
  organizationSlug: "zynapse-closed-demo",
  loginRoute: "/demo-login",
  isEnabled: true,
  isDemoWorkspace: false,
  isReadOnly: false,
  shellBadge: "Geschlossene Demo",
  shellDescription: "Read-only demo workspace.",
  mutationMessage: "Die Demo ist schreibgeschützt.",
};

function renderFlow() {
  return render(
    <PilotRequestFlow
      organizationName="Acme"
      demo={demo}
      campaign={campaigns[0]}
      campaigns={campaigns}
      latestRequest={null}
      initialValues={{
        desiredTier: "Starter",
        startWindow: "Innerhalb der nächsten 30 Tage",
        internalStakeholders: "",
        message: "Wir möchten Launch Sprint in einen bezahlten Piloten überführen.",
      }}
    />,
  );
}

describe("PilotRequestFlow", () => {
  it("updates tier and message when the selected campaign changes and fields still use defaults", () => {
    renderFlow();

    fireEvent.change(screen.getAllByLabelText("Kampagne")[0], {
      target: { value: "campaign-b" },
    });

    expect(screen.getByDisplayValue("Growth")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Wir möchten Growth Refresh in einen bezahlten Piloten überführen.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Freigegeben")).toBeInTheDocument();
  });

  it("preserves manual edits when the selected campaign changes", () => {
    renderFlow();

    fireEvent.change(screen.getAllByLabelText("Empfohlenes Paket")[0], {
      target: { value: "Custom Tier" },
    });
    fireEvent.change(screen.getAllByLabelText("Kurze Notiz")[0], {
      target: { value: "Bitte mit erweitertem Scope planen." },
    });

    fireEvent.change(screen.getAllByLabelText("Kampagne")[0], {
      target: { value: "campaign-b" },
    });

    expect(screen.getByDisplayValue("Custom Tier")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Bitte mit erweitertem Scope planen."),
    ).toBeInTheDocument();
  });
});
