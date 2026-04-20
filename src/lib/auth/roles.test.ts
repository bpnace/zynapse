import { describe, expect, it } from "vitest";
import {
  getWorkspaceCapabilities,
  getWorkspaceTypeForRole,
  normalizeWorkspaceRole,
} from "@/lib/auth/roles";

describe("workspace roles", () => {
  it("maps creative roles to the creative workspace and submission capability", () => {
    expect(getWorkspaceTypeForRole("creative")).toBe("creative");
    expect(getWorkspaceCapabilities("creative").canAccessCreativeWorkspace).toBe(true);
    expect(getWorkspaceCapabilities("creative").canSubmitCreativeWork).toBe(true);
  });

  it("preserves read-only behavior for creative submissions", () => {
    expect(
      getWorkspaceCapabilities("creative_lead", { isReadOnly: true }).canSubmitCreativeWork,
    ).toBe(false);
  });

  it("normalizes legacy roles onto the canonical dual-workspace model", () => {
    expect(normalizeWorkspaceRole("brand_admin")).toBe("brand_owner");
    expect(normalizeWorkspaceRole("zynapse_ops")).toBe("ops");
    expect(getWorkspaceTypeForRole("brand_admin")).toBe("brand");
    expect(getWorkspaceCapabilities("zynapse_ops").canAccessOpsWorkspace).toBe(true);
  });
});
