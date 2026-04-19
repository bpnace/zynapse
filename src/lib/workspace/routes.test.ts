import { describe, expect, it } from "vitest";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

describe("brandsWorkspaceRoutes", () => {
  it("builds the current workspace routes from one helper surface", () => {
    expect(brandsWorkspaceRoutes.overview()).toBe("/workspace");
    expect(brandsWorkspaceRoutes.onboarding()).toBe("/workspace/onboarding");
    expect(brandsWorkspaceRoutes.briefs.new()).toBe("/workspace/briefs/new");
    expect(brandsWorkspaceRoutes.briefs.detail("brief-1")).toBe(
      "/workspace/briefs/brief-1",
    );
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

  it("supports pilot request links and future brands aliases", () => {
    expect(brandsWorkspaceRoutes.pilotRequest()).toBe("/workspace/pilot-request");
    expect(
      brandsWorkspaceRoutes.pilotRequest({ campaignId: "campaign-1" }),
    ).toBe("/workspace/pilot-request?campaignId=campaign-1");
    expect(brandsWorkspaceRoutes.overview("brands")).toBe("/brands");
    expect(brandsWorkspaceRoutes.campaigns.review("campaign-1", "brands")).toBe(
      "/brands/campaigns/campaign-1/review",
    );
  });

  it("recognizes safe workspace-like paths without matching unrelated prefixes", () => {
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace?view=home")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace/campaigns/campaign-1")).toBe(
      true,
    );
    expect(brandsWorkspaceRoutes.isKnownPath("/brands")).toBe(true);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspace-brand")).toBe(false);
    expect(brandsWorkspaceRoutes.isKnownPath("/workspaceful")).toBe(false);
  });
});
