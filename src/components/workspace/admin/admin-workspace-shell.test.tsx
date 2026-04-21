import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminWorkspaceShell } from "@/components/workspace/admin/admin-workspace-shell";

const { pathnameState } = vi.hoisted(() => ({
  pathnameState: {
    pathname: "/admin/requests",
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
  pathnameState.pathname = "/admin/requests";
});

describe("AdminWorkspaceShell", () => {
  it("renders the admin shell nav plus identity actions", () => {
    render(
      <AdminWorkspaceShell organizationName="Zynapse" role="ops_admin">
        <div>Inhalt</div>
      </AdminWorkspaceShell>,
    );

    expect(screen.getByRole("navigation", { name: "Navigation im Admin Workspace" })).toBeInTheDocument();
    expect(screen.getAllByText("Zynapse Admin Panel")).toHaveLength(2);
    expect(screen.getAllByLabelText("Zynapse avatar")).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Settings/i })[0]).toHaveAttribute(
      "href",
      "/admin/settings",
    );
    expect(screen.getAllByRole("button", { name: /Logout/i })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Requests/i })).toHaveAttribute(
      "href",
      "/admin/requests",
    );
    expect(screen.getByRole("link", { name: /Setups/i })).toHaveAttribute(
      "href",
      "/admin/setups",
    );
    expect(screen.getByRole("link", { name: /Matching/i })).toHaveAttribute(
      "href",
      "/admin/matching",
    );
    expect(screen.getByRole("link", { name: /Assignments/i })).toHaveAttribute(
      "href",
      "/admin/assignments",
    );
    expect(screen.getByRole("link", { name: /Reviews/i })).toHaveAttribute(
      "href",
      "/admin/reviews",
    );
    expect(screen.getByRole("link", { name: /Delivery/i })).toHaveAttribute(
      "href",
      "/admin/delivery",
    );
    expect(screen.getByRole("link", { name: /Exceptions/i })).toHaveAttribute(
      "href",
      "/admin/exceptions",
    );
    expect(screen.getByRole("link", { name: /Audit/i })).toHaveAttribute(
      "href",
      "/admin/audit",
    );
  });

  it("keeps the requests nav item active on legacy /ops routes", () => {
    pathnameState.pathname = "/ops";

    render(
      <AdminWorkspaceShell organizationName="Zynapse" role="ops_admin">
        <div>Inhalt</div>
      </AdminWorkspaceShell>,
    );

    expect(screen.getByRole("link", { name: /Requests/i }).className).toContain(
      "workspace-nav-item-active",
    );
  });
});
