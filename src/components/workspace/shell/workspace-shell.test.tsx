import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/workspace",
}));

describe("WorkspaceShell copy", () => {
  it("uses a localized navigation label for the workspace shell", () => {
    render(
      <WorkspaceShell
        organizationName="Acme"
        role="brand_admin"
        activeCampaignId="campaign-1"
      >
        <div>Inhalt</div>
      </WorkspaceShell>,
    );

    expect(
      screen.getByRole("navigation", { name: "Navigation im Arbeitsbereich" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Strukturierte Anfragen und Erstaufnahme")).toBeInTheDocument();
  });
});
