import { describe, expect, it } from "vitest";
import { deriveOpsCreativeOptions } from "@/lib/workspace/ops-creative-options";

describe("deriveOpsCreativeOptions", () => {
  it("includes active creatives even when they have no assignments yet", () => {
    const options = deriveOpsCreativeOptions({
      memberships: [
        {
          id: "membership-1",
          organizationId: "org-1",
          userId: "user-1",
          role: "creative",
          workspaceType: "creative",
          membershipStatus: "active",
          invitedBy: null,
          acceptedAt: new Date("2026-04-20T08:00:00.000Z"),
        },
        {
          id: "membership-2",
          organizationId: "org-1",
          userId: "user-2",
          role: "creative_lead",
          workspaceType: "creative",
          membershipStatus: "active",
          invitedBy: null,
          acceptedAt: new Date("2026-04-20T08:05:00.000Z"),
        },
      ],
      creativeProfiles: [
        {
          id: "profile-2",
          userId: "user-2",
          slug: "alex-motion",
          displayName: "Alex Motion",
          headline: "Motion designer",
          bio: null,
          specialties: null,
          portfolioUrl: null,
          availabilityStatus: "available",
          createdAt: new Date("2026-04-20T08:00:00.000Z"),
        },
      ],
    });

    expect(options).toEqual([
      {
        userId: "user-2",
        displayName: "Alex Motion",
        role: "creative_lead",
        membershipStatus: "active",
      },
      {
        userId: "user-1",
        displayName: "user-1",
        role: "creative",
        membershipStatus: "active",
      },
    ]);
  });

  it("deduplicates repeated memberships and ignores non-active creatives", () => {
    const options = deriveOpsCreativeOptions({
      memberships: [
        {
          id: "membership-1",
          organizationId: "org-1",
          userId: "user-1",
          role: "creative",
          workspaceType: "creative",
          membershipStatus: "active",
          invitedBy: null,
          acceptedAt: new Date("2026-04-20T08:00:00.000Z"),
        },
        {
          id: "membership-1b",
          organizationId: "org-1",
          userId: "user-1",
          role: "creative",
          workspaceType: "creative",
          membershipStatus: "active",
          invitedBy: null,
          acceptedAt: new Date("2026-04-20T08:01:00.000Z"),
        },
        {
          id: "membership-2",
          organizationId: "org-1",
          userId: "user-2",
          role: "creative",
          workspaceType: "creative",
          membershipStatus: "paused",
          invitedBy: null,
          acceptedAt: new Date("2026-04-20T08:05:00.000Z"),
        },
      ],
      creativeProfiles: [
        {
          id: "profile-1",
          userId: "user-1",
          slug: "jordan-edit",
          displayName: "Jordan Edit",
          headline: null,
          bio: null,
          specialties: null,
          portfolioUrl: null,
          availabilityStatus: "available",
          createdAt: new Date("2026-04-20T08:00:00.000Z"),
        },
      ],
    });

    expect(options).toEqual([
      {
        userId: "user-1",
        displayName: "Jordan Edit",
        role: "creative",
        membershipStatus: "active",
      },
    ]);
  });
});
