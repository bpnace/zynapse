import { describe, expect, it } from "vitest";
import { resolveDemoWorkspaceNextPath } from "@/lib/workspace/demo";

describe("resolveDemoWorkspaceNextPath", () => {
  it("preserves safe canonical brand routes", () => {
    expect(resolveDemoWorkspaceNextPath("/brands/today?view=home")).toBe(
      "/brands/today?view=home",
    );
    expect(resolveDemoWorkspaceNextPath("/brands/campaigns/campaign-1")).toBe(
      "/brands/campaigns/campaign-1",
    );
  });

  it("falls back for unsafe or unrelated paths", () => {
    expect(resolveDemoWorkspaceNextPath("/workspace")).toBe("/brands/today");
    expect(resolveDemoWorkspaceNextPath("/workspace/campaigns/campaign-1/review")).toBe(
      "/brands/today",
    );
    expect(resolveDemoWorkspaceNextPath("//workspace")).toBe("/brands/today");
    expect(resolveDemoWorkspaceNextPath("/workspace-brand")).toBe("/brands/today");
    expect(resolveDemoWorkspaceNextPath("")).toBe("/brands/today");
    expect(resolveDemoWorkspaceNextPath(null)).toBe("/brands/today");
  });
});
