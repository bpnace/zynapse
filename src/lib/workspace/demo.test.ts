import { describe, expect, it } from "vitest";
import { resolveDemoWorkspaceNextPath } from "@/lib/workspace/demo";

describe("resolveDemoWorkspaceNextPath", () => {
  it("preserves safe workspace and brands routes", () => {
    expect(resolveDemoWorkspaceNextPath("/workspace")).toBe("/workspace");
    expect(resolveDemoWorkspaceNextPath("/workspace/campaigns/campaign-1/review")).toBe(
      "/workspace/campaigns/campaign-1/review",
    );
    expect(resolveDemoWorkspaceNextPath("/workspace?view=home")).toBe(
      "/workspace?view=home",
    );
    expect(resolveDemoWorkspaceNextPath("/brands/campaigns/campaign-1")).toBe(
      "/brands/campaigns/campaign-1",
    );
  });

  it("falls back for unsafe or unrelated paths", () => {
    expect(resolveDemoWorkspaceNextPath("//workspace")).toBe("/workspace");
    expect(resolveDemoWorkspaceNextPath("/workspace-brand")).toBe("/workspace");
    expect(resolveDemoWorkspaceNextPath("")).toBe("/workspace");
    expect(resolveDemoWorkspaceNextPath(null)).toBe("/workspace");
  });
});
