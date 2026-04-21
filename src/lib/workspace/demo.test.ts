import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDemoWorkspaceTypeForEmail,
  resolveDemoWorkspaceNextPath,
  resolveDemoWorkspaceNextPathForEmail,
} from "@/lib/workspace/demo";

describe("resolveDemoWorkspaceNextPath", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

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

describe("demo workspace account routing", () => {
  beforeEach(() => {
    vi.stubEnv("DEMO_WORKSPACE_EMAIL", "demo@zynapse.eu");
    vi.stubEnv("DEMO_WORKSPACE_CREATIVE_EMAIL", "demo+creative@zynapse.eu");
  });

  it("classifies the brand and creative demo emails correctly", () => {
    expect(getDemoWorkspaceTypeForEmail("demo@zynapse.eu")).toBe("brand");
    expect(getDemoWorkspaceTypeForEmail("demo+creative@zynapse.eu")).toBe("creative");
    expect(getDemoWorkspaceTypeForEmail("other@zynapse.eu")).toBeNull();
  });

  it("uses the matching workspace landing path when no explicit next path is provided", () => {
    expect(resolveDemoWorkspaceNextPathForEmail("demo@zynapse.eu", null)).toBe("/brands/today");
    expect(resolveDemoWorkspaceNextPathForEmail("demo+creative@zynapse.eu", null)).toBe(
      "/creatives/tasks",
    );
  });

  it("preserves safe creative next paths for the creative demo account", () => {
    expect(
      resolveDemoWorkspaceNextPathForEmail(
        "demo+creative@zynapse.eu",
        "/creatives/feedback",
      ),
    ).toBe("/creatives/feedback");
    expect(
      resolveDemoWorkspaceNextPathForEmail(
        "demo+creative@zynapse.eu",
        "/workspace",
      ),
    ).toBe("/creatives/tasks");
    expect(
      resolveDemoWorkspaceNextPathForEmail(
        "demo+creative@zynapse.eu",
        "/brands/today",
      ),
    ).toBe("/creatives/tasks");
  });
});
