import { describe, expect, it } from "vitest";
import {
  adminWorkspaceRoutes,
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  isProtectedWorkspacePath,
  opsWorkspaceRoutes,
  resolveWorkspaceNextPath,
} from "@/lib/workspace/routes";

describe("workspace routes", () => {
  it("builds the refreshed brand route family while preserving legacy overview access", () => {
    expect(brandsWorkspaceRoutes.overview()).toBe("/brands/today");
    expect(brandsWorkspaceRoutes.home()).toBe("/brands/home");
    expect(brandsWorkspaceRoutes.profile()).toBe("/brands/profile");
    expect(brandsWorkspaceRoutes.team()).toBe("/brands/team");
    expect(brandsWorkspaceRoutes.billing()).toBe("/brands/billing");
    expect(brandsWorkspaceRoutes.assets()).toBe("/brands/assets");
    expect(brandsWorkspaceRoutes.campaigns.index()).toBe("/brands/campaigns");
    expect(brandsWorkspaceRoutes.campaigns.new()).toBe("/brands/campaigns/new");
    expect(brandsWorkspaceRoutes.reviews.index()).toBe("/brands/reviews");
    expect(brandsWorkspaceRoutes.deliveries.index()).toBe("/brands/deliveries");
    expect(brandsWorkspaceRoutes.briefs.new()).toBe("/brands/briefs/new");
    expect(brandsWorkspaceRoutes.campaigns.detail("campaign-1")).toBe(
      "/brands/campaigns/campaign-1",
    );
    expect(brandsWorkspaceRoutes.campaigns.setup("campaign-1")).toBe(
      "/brands/campaigns/campaign-1/setup",
    );
    expect(brandsWorkspaceRoutes.campaigns.review("campaign-1")).toBe(
      "/brands/campaigns/campaign-1/review",
    );
    expect(brandsWorkspaceRoutes.campaigns.handover("campaign-1")).toBe(
      "/brands/campaigns/campaign-1/handover",
    );
  });

  it("builds creative, admin, and ops route families side by side", () => {
    expect(creativeWorkspaceRoutes.home()).toBe("/creatives/home");
    expect(creativeWorkspaceRoutes.tasks()).toBe("/creatives/tasks");
    expect(creativeWorkspaceRoutes.invitations.index()).toBe("/creatives/invitations");
    expect(creativeWorkspaceRoutes.revisions.index()).toBe("/creatives/revisions");
    expect(creativeWorkspaceRoutes.profile()).toBe("/creatives/profile");
    expect(creativeWorkspaceRoutes.availability()).toBe("/creatives/availability");
    expect(creativeWorkspaceRoutes.resources()).toBe("/creatives/resources");
    expect(creativeWorkspaceRoutes.payouts()).toBe("/creatives/payouts");

    expect(adminWorkspaceRoutes.root()).toBe("/admin");
    expect(adminWorkspaceRoutes.requests()).toBe("/admin/requests");
    expect(adminWorkspaceRoutes.campaignDetail("campaign-1")).toBe(
      "/admin/requests/campaigns/campaign-1",
    );
    expect(adminWorkspaceRoutes.setups()).toBe("/admin/setups");
    expect(adminWorkspaceRoutes.matching()).toBe("/admin/matching");
    expect(adminWorkspaceRoutes.assignments()).toBe("/admin/assignments");
    expect(adminWorkspaceRoutes.reviews()).toBe("/admin/reviews");
    expect(adminWorkspaceRoutes.delivery()).toBe("/admin/delivery");
    expect(adminWorkspaceRoutes.exceptions()).toBe("/admin/exceptions");
    expect(adminWorkspaceRoutes.audit()).toBe("/admin/audit");
    expect(adminWorkspaceRoutes.settings()).toBe("/admin/settings");

    expect(opsWorkspaceRoutes.overview()).toBe("/ops");
    expect(opsWorkspaceRoutes.campaigns()).toBe("/ops/campaigns");
    expect(opsWorkspaceRoutes.assignments()).toBe("/ops/assignments");
    expect(opsWorkspaceRoutes.delivery()).toBe("/ops/delivery");
  });

  it("recognizes refreshed protected workspace paths without matching public routes", () => {
    expect(brandsWorkspaceRoutes.isKnownPath("/brands/home")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/brands/campaigns/campaign-1")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/brands")).toBe(false);

    expect(creativeWorkspaceRoutes.isKnownPath("/creatives/home")).toBe(true);
    expect(creativeWorkspaceRoutes.isKnownPath("/creatives/revisions/rv-1")).toBe(true);
    expect(creativeWorkspaceRoutes.isKnownPath("/creatives")).toBe(false);

    expect(adminWorkspaceRoutes.isKnownPath("/admin")).toBe(true);
    expect(adminWorkspaceRoutes.isKnownPath("/admin/reviews")).toBe(true);
    expect(adminWorkspaceRoutes.isKnownPath("/admin/requests/campaigns/campaign-1")).toBe(true);
    expect(adminWorkspaceRoutes.isKnownPath("/admins")).toBe(false);

    expect(opsWorkspaceRoutes.isKnownPath("/ops")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/ops/commercial")).toBe(true);
    expect(opsWorkspaceRoutes.isKnownPath("/operations")).toBe(false);

    expect(isProtectedWorkspacePath("/app")).toBe(true);
    expect(isProtectedWorkspacePath("/brands/profile")).toBe(true);
    expect(isProtectedWorkspacePath("/creatives/resources")).toBe(true);
    expect(isProtectedWorkspacePath("/admin/requests")).toBe(true);
    expect(isProtectedWorkspacePath("/ops/assignments")).toBe(true);
  });

  it("deduplicates revalidation paths and includes the new brand shell routes", () => {
    expect(
      brandsWorkspaceRoutes.revalidation({
        campaignId: "campaign-1",
        briefId: "brief-1",
      }),
    ).toEqual([
      "/brands/today",
      "/brands/home",
      "/brands/onboarding",
      "/brands/profile",
      "/brands/assets",
      "/brands/team",
      "/brands/billing",
      "/brands/campaigns",
      "/brands/campaigns/new",
      "/brands/reviews",
      "/brands/deliveries",
      "/brands/briefs/new",
      "/brands/pilot-request",
      "/brands/briefs/brief-1",
      "/brands/campaigns/campaign-1",
      "/brands/campaigns/campaign-1/setup",
      "/brands/campaigns/campaign-1/review",
      "/brands/campaigns/campaign-1/handover",
    ]);
  });

  it("preserves safe next paths across brand, creative, admin, and ops routes", () => {
    expect(resolveWorkspaceNextPath("/brands/campaigns/campaign-1", "/app")).toBe(
      "/brands/campaigns/campaign-1",
    );
    expect(resolveWorkspaceNextPath("/creatives/revisions", "/app")).toBe(
      "/creatives/revisions",
    );
    expect(resolveWorkspaceNextPath("/admin/reviews", "/app")).toBe("/admin/reviews");
    expect(resolveWorkspaceNextPath("/ops/delivery", "/app")).toBe("/ops/delivery");
    expect(resolveWorkspaceNextPath("/workspace", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("//evil.test", "/app")).toBe("/app");
    expect(resolveWorkspaceNextPath("/brands", "/app")).toBe("/app");
  });
});
