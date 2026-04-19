import { describe, expect, it } from "vitest";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  isProtectedWorkspacePath,
  resolveWorkspaceNextPath,
} from "@/lib/workspace/routes";

describe("workspace routes", () => {
  it("builds the current brand workspace routes from one helper surface", () => {
    expect(brandsWorkspaceRoutes.overview()).toBe("/workspace");
    expect(brandsWorkspaceRoutes.onboarding()).toBe("/workspace/onboarding");
    expect(brandsWorkspaceRoutes.briefs.new()).toBe("/workspace/briefs/new");
    expect(brandsWorkspaceRoutes.briefs.detail("brief-1")).toBe("/workspace/briefs/brief-1");
    expect(brandsWorkspaceRoutes.campaigns.detail("campaign-1")).toBe(
      "/workspace/campaigns/campaign-1",
    );
    expect(brandsWorkspaceRoutes.campaigns.review("campaign-1")).toBe(
      "/workspace/campaigns/campaign-1/review",
    );
    expect(brandsWorkspaceRoutes.campaigns.handover("campaign-1")).toBe(
      "/workspace/campaigns/campaign-1/handover",
    );
  });

  it("supports future brand aliases and creative workspace paths", () => {
    expect(brandsWorkspaceRoutes.overview("brands")).toBe("/brands");
    expect(brandsWorkspaceRoutes.campaigns.review("campaign-1", "brands")).toBe(
      "/brands/campaigns/campaign-1/review",
    );
    expect(creativeWorkspaceRoutes.tasks()).toBe("/creatives/tasks");
    expect(creativeWorkspaceRoutes.feedback()).toBe("/creatives/feedback");
    expect(creativeWorkspaceRoutes.campaigns.detail("campaign-1")).toBe(
      "/creatives/campaigns/campaign-1",
    );
  });

  it("recognizes protected workspace-like paths without matching public marketing routes", () => {
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/brands")).toBe(true);
    expect(isProtectedWorkspacePath("/app")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/tasks")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/campaigns/campaign-1")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/feedback")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives")).toBe(false);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace-brand")).toBe(false);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspaceful")).toBe(false);
  });

  it("deduplicates revalidation paths and keeps both workspace namespaces stable", () => {
    expect(
      brandsWorkspaceRoutes.revalidation({
        campaignId: "campaign-1",
        briefId: "brief-1",
        namespace: "brands",
      }),
    ).toEqual([
      "/brands",
      "/brands/onboarding",
      "/brands/briefs/new",
      "/brands/pilot-request",
      "/brands/briefs/brief-1",
      "/brands/campaigns/campaign-1",
      "/brands/campaigns/campaign-1/review",
      "/brands/campaigns/campaign-1/handover",
    ]);
  });

  it("preserves safe next paths and falls back to the chosen workspace entry for unsafe values", () => {
    expect(resolveWorkspaceNextPath("/brands/campaigns/campaign-1", "/app")).toBe(
      "/brands/campaigns/campaign-1",
    );
    expect(resolveWorkspaceNextPath("/creatives/tasks", "/app")).toBe("/creatives/tasks");
    expect(resolveWorkspaceNextPath("//evil.test", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("/creatives", "/app")).toBe("/app");
  });
});
