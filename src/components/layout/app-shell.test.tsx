import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/layout/app-shell";

const usePathnameMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => <div data-testid="site-header">header</div>,
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => <div data-testid="site-footer">footer</div>,
}));

vi.mock("@/components/layout/back-to-top-button", () => ({
  BackToTopButton: () => <div data-testid="back-to-top">back-to-top</div>,
}));

describe("AppShell", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  it("suppresses marketing chrome for workspace routes", () => {
    usePathnameMock.mockReturnValue("/workspace/campaigns/campaign-1");
    render(<AppShell><div>content</div></AppShell>);

    expect(screen.queryByTestId("site-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("site-footer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("back-to-top")).not.toBeInTheDocument();
  });

  it("keeps marketing chrome for unrelated prefixes", () => {
    usePathnameMock.mockReturnValue("/workspaceful");
    render(<AppShell><div>content</div></AppShell>);

    expect(screen.getByTestId("site-header")).toBeInTheDocument();
    expect(screen.getByTestId("site-footer")).toBeInTheDocument();
    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });
});
