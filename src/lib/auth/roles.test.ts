import { describe, expect, it } from "vitest";
import {
  getWorkspaceCapabilities,
  getWorkspaceTypeForRole,
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
});
