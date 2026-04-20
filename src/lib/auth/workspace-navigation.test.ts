import { describe, expect, it } from "vitest";
import {
  getWorkspaceLandingPath,
  isOpsWorkspacePath,
  resolveProtectedWorkspaceNextPath,
} from "@/lib/auth/workspace-navigation";

describe("workspace navigation helpers", () => {
  it("returns the correct landing path for each workspace type", () => {
    expect(getWorkspaceLandingPath("brand")).toBe("/brands/today");
    expect(getWorkspaceLandingPath("creative")).toBe("/creatives/tasks");
    expect(getWorkspaceLandingPath("ops")).toBe("/ops");
  });

  it("recognizes the protected ops workspace path family", () => {
    expect(isOpsWorkspacePath("/ops")).toBe(true);
    expect(isOpsWorkspacePath("/ops/queue")).toBe(true);
    expect(isOpsWorkspacePath("/ops?tab=review")).toBe(true);
    expect(isOpsWorkspacePath("/operations")).toBe(false);
  });

  it("preserves safe ops next paths and still rejects unsafe values", () => {
    expect(resolveProtectedWorkspaceNextPath("/ops", "/app")).toBe("/ops");
    expect(resolveProtectedWorkspaceNextPath("/ops?tab=review", "/app")).toBe(
      "/ops?tab=review",
    );
    expect(resolveProtectedWorkspaceNextPath("//evil.test", "/app")).toBe("/app");
    expect(resolveProtectedWorkspaceNextPath("/workspace", "/app")).toBe("/app");
  });
});
