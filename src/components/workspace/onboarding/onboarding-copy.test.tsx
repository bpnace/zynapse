import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OnboardingFlow } from "@/components/workspace/onboarding/onboarding-flow";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("OnboardingFlow copy", () => {
  it("renders the localized approval-rules description", () => {
    render(
      <OnboardingFlow
        organizationName="Acme"
        demo={{
          canonicalEmail: "demo@zynapse.eu",
          organizationSlug: "zynapse-closed-demo",
          loginRoute: "/demo-login",
          isEnabled: true,
          isDemoWorkspace: false,
          isReadOnly: true,
          shellBadge: "Geschlossene Demo",
          shellDescription: "Schreibgeschützte Demo-Ansicht.",
          mutationMessage: "Die Demo ist schreibgeschützt.",
        }}
        initialValues={{
          website: "",
          offerSummary: "",
          targetAudience: "",
          primaryChannels: "",
          brandTone: "",
          reviewNotes: "",
          claimGuardrails: "",
        }}
        initialCompletion={{
          completed: 0,
          total: 7,
          percent: 0,
          isComplete: false,
        }}
      />,
    );

    expect(
      screen.getByText(
        "Dokumentiere Freigebende, Aussagen und Grenzen, damit Freigabe und Übergabe verlässlich bleiben.",
      ),
    ).toBeInTheDocument();
  });
});
