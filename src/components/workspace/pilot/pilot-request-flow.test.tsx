import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PilotRequestFlow } from "@/components/workspace/pilot/pilot-request-flow";

afterEach(() => {
  cleanup();
});

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
    commercialReady: false,
  },
  {
    id: "campaign-b",
    name: "Growth Refresh",
    packageTier: "Growth",
    currentStage: "approved",
    commercialReady: true,
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
  shellDescription: "Schreibgeschützte Demo-Ansicht.",
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

    expect(screen.getByDisplayValue("Wachstum")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        "Wir möchten Growth Refresh in einen bezahlten Piloten überführen.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Freigegeben")).toBeInTheDocument();
  });

  it("preserves manual edits when the selected campaign changes", () => {
    renderFlow();

    fireEvent.change(screen.getAllByLabelText("Vorgeschlagenes Paket")[0], {
      target: { value: "Custom Tier" },
    });
    fireEvent.change(screen.getAllByLabelText("Hinweis zur Pilotanfrage")[0], {
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

  it("blocks submission controls until the selected campaign is commercially ready", () => {
    renderFlow();

    expect(
      screen.getByRole("button", { name: "Pilotanfrage senden" }),
    ).toBeDisabled();

    fireEvent.change(screen.getAllByLabelText("Kampagne")[0], {
      target: { value: "campaign-b" },
    });

    expect(
      screen.getByRole("button", { name: "Pilotanfrage senden" }),
    ).not.toBeDisabled();
  });
});
