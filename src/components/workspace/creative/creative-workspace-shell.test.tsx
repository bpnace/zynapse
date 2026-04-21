import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreativeWorkspaceShell } from "@/components/workspace/creative/creative-workspace-shell";

const { pathnameState } = vi.hoisted(() => ({
  pathnameState: {
    pathname: "/creatives/tasks",
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameState.pathname,
}));

vi.mock("@/components/layout/wordmark", () => ({
  Wordmark: ({ href = "/" }: { href?: string }) => <a href={href}>Zynapse</a>,
}));

afterEach(() => {
  cleanup();
  pathnameState.pathname = "/creatives/tasks";
});

describe("CreativeWorkspaceShell", () => {
  it("renders the refreshed creative shell nav plus identity actions", () => {
    render(
      <CreativeWorkspaceShell
        organizationName="Acme"
        displayName="Alex Motion"
        headline="Motion creative lead"
      >
        <div>Inhalt</div>
      </CreativeWorkspaceShell>,
    );

    expect(
      screen.getByRole("navigation", {
        name: "Execution navigation im Creatives Workspace",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", {
        name: "Profile navigation im Creatives Workspace",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Creatives Workspace")).toHaveLength(2);
    expect(screen.getAllByLabelText("Alex Motion avatar")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })[0]).toHaveAttribute(
      "href",
      "/creatives/profile",
    );
    expect(screen.getAllByRole("button", { name: /Logout/i })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Home/i })).toHaveAttribute(
      "href",
      "/creatives/home",
    );
    expect(screen.getByRole("link", { name: /Invitations/i })).toHaveAttribute(
      "href",
      "/creatives/invitations",
    );
    expect(screen.getByRole("link", { name: /Tasks/i })).toHaveAttribute(
      "href",
      "/creatives/tasks",
    );
    expect(screen.getByRole("link", { name: /Revisions/i })).toHaveAttribute(
      "href",
      "/creatives/revisions",
    );
    expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute(
      "href",
      "/creatives/profile",
    );
    expect(screen.getByRole("link", { name: /Availability/i })).toHaveAttribute(
      "href",
      "/creatives/availability",
    );
    expect(screen.getByRole("link", { name: /Resources/i })).toHaveAttribute(
      "href",
      "/creatives/resources",
    );
    expect(screen.getByRole("link", { name: /Payouts/i })).toHaveAttribute(
      "href",
      "/creatives/payouts",
    );
  });
});
