import { describe, expect, it } from "vitest";
import {
  getWorkspaceLandingPath,
  isAdminWorkspacePath,
  isOpsWorkspacePath,
  resolveProtectedWorkspaceNextPath,
} from "@/lib/auth/workspace-navigation";

describe("workspace navigation helpers", () => {
  it("keeps the current landing path for each workspace type", () => {
    expect(getWorkspaceLandingPath("brand")).toBe("/brands/home");
    expect(getWorkspaceLandingPath("creative")).toBe("/creatives/home");
    expect(getWorkspaceLandingPath("ops")).toBe("/admin/requests");
  });

  it("recognizes both legacy ops and canonical admin internal paths", () => {
    expect(isOpsWorkspacePath("/ops")).toBe(true);
    expect(isOpsWorkspacePath("/ops/queue")).toBe(true);
    expect(isOpsWorkspacePath("/operations")).toBe(false);

    expect(isAdminWorkspacePath("/admin")).toBe(true);
    expect(isAdminWorkspacePath("/admin/reviews")).toBe(true);
    expect(isAdminWorkspacePath("/administrator")).toBe(false);
  });

  it("preserves safe internal next paths and still rejects unsafe values", () => {
    expect(resolveProtectedWorkspaceNextPath("/ops", "/app")).toBe("/ops");
    expect(resolveProtectedWorkspaceNextPath("/admin/requests", "/app")).toBe(
      "/admin/requests",
    );
    expect(resolveProtectedWorkspaceNextPath("/admin/reviews?queue=urgent", "/app")).toBe(
      "/admin/reviews?queue=urgent",
    );
    expect(resolveProtectedWorkspaceNextPath("//evil.test", "/app")).toBe("/app");
    expect(resolveProtectedWorkspaceNextPath("/workspace", "/app")).toBe("/app");
  });

  it("uses the canonical admin fallback for internal workspace redirects", () => {
    expect(resolveProtectedWorkspaceNextPath("/invalid", "/admin/requests")).toBe(
      "/admin/requests",
    );
  });
});
