import { describe, expect, it } from "vitest";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  isProtectedWorkspacePath,
  opsWorkspaceRoutes,
  resolveWorkspaceNextPath,
} from "@/lib/workspace/routes";

describe("workspace routes", () => {
  it("builds canonical brand routes under /brands", () => {
    expect(brandsWorkspaceRoutes.overview()).toBe("/brands/today");
    expect(brandsWorkspaceRoutes.onboarding()).toBe("/brands/onboarding");
    expect(brandsWorkspaceRoutes.briefs.new()).toBe("/brands/briefs/new");
    expect(brandsWorkspaceRoutes.briefs.detail("brief-1")).toBe("/brands/briefs/brief-1");
    expect(brandsWorkspaceRoutes.campaigns.detail("campaign-1")).toBe(
      "/brands/campaigns/campaign-1",
    );
    expect(brandsWorkspaceRoutes.campaigns.review("campaign-1")).toBe(
      "/brands/campaigns/campaign-1/review",
    );
    expect(brandsWorkspaceRoutes.campaigns.handover("campaign-1")).toBe(
      "/brands/campaigns/campaign-1/handover",
    );
  });

  it("supports creative and ops workspace paths alongside the brand namespace split", () => {
    expect(creativeWorkspaceRoutes.tasks()).toBe("/creatives/tasks");
    expect(creativeWorkspaceRoutes.feedback()).toBe("/creatives/feedback");
    expect(creativeWorkspaceRoutes.campaigns.detail("campaign-1")).toBe(
      "/creatives/campaigns/campaign-1",
    );
    expect(opsWorkspaceRoutes.overview()).toBe("/ops");
    expect(opsWorkspaceRoutes.campaigns()).toBe("/ops/campaigns");
    expect(opsWorkspaceRoutes.campaignDetail("campaign-1")).toBe("/ops/campaigns/campaign-1");
    expect(opsWorkspaceRoutes.assignments()).toBe("/ops/assignments");
    expect(opsWorkspaceRoutes.delivery()).toBe("/ops/delivery");
    expect(opsWorkspaceRoutes.commercial()).toBe("/ops/commercial");
  });

  it("builds canonical ops routes without reviving the legacy /workspace namespace", () => {
    expect(opsWorkspaceRoutes.overview()).toBe("/ops");
    expect(opsWorkspaceRoutes.campaigns()).toBe("/ops/campaigns");
    expect(opsWorkspaceRoutes.campaignDetail("campaign-1")).toBe("/ops/campaigns/campaign-1");
    expect(opsWorkspaceRoutes.assignments()).toBe("/ops/assignments");
    expect(opsWorkspaceRoutes.delivery()).toBe("/ops/delivery");
    expect(opsWorkspaceRoutes.commercial()).toBe("/ops/commercial");
    expect(opsWorkspaceRoutes.legacyReviewReadiness()).toBe("/ops/review-readiness");
    expect(opsWorkspaceRoutes.legacyCommercialHandoffs()).toBe("/ops/commercial-handoffs");
  });

  it("recognizes protected workspace-like paths without matching public marketing routes", () => {
    expect(brandsWorkspaceRoutes.isKnownPath("/brands/today")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/brands/campaigns/campaign-1")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/brands")).toBe(false);
    expect(opsWorkspaceRoutes.isKnownPath("/ops")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/campaigns/campaign-1")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/delivery")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/commercial")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/review-readiness")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/commercial-handoffs")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/operations")).toBe(false);
    expect(isProtectedWorkspacePath("/app")).toBe(true);
    expect(isProtectedWorkspacePath("/brands/today")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/tasks")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/campaigns/campaign-1")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/feedback")).toBe(true);
    expect(isProtectedWorkspacePath("/ops")).toBe(true);
    expect(isProtectedWorkspacePath("/ops/campaigns/campaign-1")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives")).toBe(false);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace-brand")).toBe(false);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspaceful")).toBe(false);
  });

  it("deduplicates revalidation paths and keeps both workspace namespaces stable", () => {
    expect(
      brandsWorkspaceRoutes.revalidation({
        campaignId: "campaign-1",
        briefId: "brief-1",
      }),
    ).toEqual([
      "/brands/today",
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
    expect(resolveWorkspaceNextPath("/workspace", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("/brands", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("/creatives/tasks", "/app")).toBe("/creatives/tasks");
    expect(resolveWorkspaceNextPath("/ops/delivery", "/app")).toBe("/ops/delivery");
    expect(resolveWorkspaceNextPath("/ops/commercial", "/app")).toBe("/ops/commercial");
    expect(resolveWorkspaceNextPath("/ops/review-readiness", "/app")).toBe(
      "/ops/review-readiness",
    );
    expect(resolveWorkspaceNextPath("//evil.test", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("/creatives", "/app")).toBe("/app");
  });
});
