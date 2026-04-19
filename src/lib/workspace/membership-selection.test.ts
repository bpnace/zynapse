import { describe, expect, it } from "vitest";
import {
  selectDefaultMembership,
  selectMembershipForWorkspace,
} from "@/lib/workspace/membership-selection";

const memberships = [
  {
    id: "brand",
    organizationId: "org-brand",
    userId: "user-1",
    role: "brand_admin" as const,
    workspaceType: "brand" as const,
    acceptedAt: new Date("2026-04-10T10:00:00.000Z"),
  },
  {
    id: "creative",
    organizationId: "org-brand",
    userId: "user-1",
    role: "creative" as const,
    workspaceType: "creative" as const,
    acceptedAt: new Date("2026-04-19T10:00:00.000Z"),
  },
];

describe("workspace membership selection", () => {
  it("selects the requested workspace type deterministically", () => {
    expect(selectMembershipForWorkspace(memberships, "brand")?.id).toBe("brand");
    expect(selectMembershipForWorkspace(memberships, "creative")?.id).toBe("creative");
  });

  it("prefers the brand workspace as the default managed-service entry when available", () => {
    expect(selectDefaultMembership(memberships)?.id).toBe("brand");
  });
});
