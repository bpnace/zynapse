import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
  };
});

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/auth/session", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("@/lib/workspace/services/accept-invite", () => ({
  ensureMembershipForCurrentUser: vi.fn(),
}));

vi.mock("@/lib/workspace/queries/get-workspace-bootstrap", () => ({
  getWorkspaceBootstrap: vi.fn(),
  getCreativeWorkspaceBootstrap: vi.fn(),
}));

vi.mock("@/lib/workspace/seeds/bootstrap-workspace", () => ({
  bootstrapWorkspaceForOrganization: vi.fn(),
}));

vi.mock("@/lib/workspace/seeds/bootstrap-creative-workspace", () => ({
  bootstrapCreativeWorkspaceForUser: vi.fn(),
}));

import { getSessionUser } from "@/lib/auth/session";
import {
  requireCreativeWorkspaceAccess,
  requireWorkspaceResolverPath,
} from "@/lib/auth/guards";
import { ensureMembershipForCurrentUser } from "@/lib/workspace/services/accept-invite";
import {
  getCreativeWorkspaceBootstrap,
  getWorkspaceBootstrap,
} from "@/lib/workspace/queries/get-workspace-bootstrap";
import { bootstrapWorkspaceForOrganization } from "@/lib/workspace/seeds/bootstrap-workspace";
import { bootstrapCreativeWorkspaceForUser } from "@/lib/workspace/seeds/bootstrap-creative-workspace";

function makeMembership(input: {
  id: string;
  organizationId: string;
  role: "brand_owner" | "creative_lead" | "ops_admin";
  acceptedAt?: string;
}) {
  return {
    id: input.id,
    organizationId: input.organizationId,
    userId: "user-1",
    role: input.role,
    workspaceType:
      input.role === "creative_lead"
        ? "creative"
        : input.role === "ops_admin"
          ? "ops"
          : "brand",
    membershipStatus: "active",
    invitedBy: null,
    acceptedAt: new Date(input.acceptedAt ?? "2026-04-19T10:00:00.000Z"),
  } as const;
}

function makeCreativeBootstrap() {
  return {
    membership: makeMembership({
      id: "membership-creative",
      organizationId: "org-creative",
      role: "creative_lead",
    }),
    organization: {
      id: "org-creative",
      slug: "creative-studio",
      name: "Creative Studio",
      industry: "creative",
      status: "active",
      createdAt: new Date("2026-04-19T10:00:00.000Z"),
    },
    creativeProfile: {
      id: "creative-profile-1",
      userId: "user-1",
      slug: "alex-motion",
      displayName: "Alex Motion",
      headline: "Motion creative lead",
      bio: "Focused on launch-ready delivery",
      specialties: "Motion, Hooks",
      portfolioUrl: null,
      availabilityStatus: "active",
      createdAt: new Date("2026-04-19T10:00:00.000Z"),
    },
    demo: {
      canonicalEmail: "demo@zynapse.eu",
      organizationSlug: "creative-studio",
      loginRoute: "/demo-login",
      isEnabled: true,
      isDemoWorkspace: false,
      isReadOnly: false,
      shellBadge: null,
      shellDescription: null,
      mutationMessage: null,
    },
  };
}

describe("guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSessionUser).mockResolvedValue({
      id: "user-1",
      email: "user@zynapse.eu",
    } as never);
  });

  it("routes users to the creative task surface when creative is their only resolved workspace", async () => {
    const creativeBootstrap = makeCreativeBootstrap();

    vi.mocked(ensureMembershipForCurrentUser).mockResolvedValue(
      creativeBootstrap.membership as never,
    );
    vi.mocked(getWorkspaceBootstrap).mockResolvedValueOnce(null as never);
    vi.mocked(getCreativeWorkspaceBootstrap).mockResolvedValue(
      creativeBootstrap as never,
    );
    vi.mocked(getWorkspaceBootstrap).mockResolvedValueOnce(null as never);

    await expect(requireWorkspaceResolverPath()).resolves.toBe("/creatives/tasks");
  });

  it("routes users to the ops surface when ops is the strongest resolved workspace", async () => {
    const opsMembership = makeMembership({
      id: "membership-ops",
      organizationId: "org-ops",
      role: "ops_admin",
    });

    vi.mocked(ensureMembershipForCurrentUser).mockResolvedValue(opsMembership as never);
    vi.mocked(getWorkspaceBootstrap).mockResolvedValueOnce(null as never);
    vi.mocked(getCreativeWorkspaceBootstrap).mockResolvedValue(null as never);
    vi.mocked(getWorkspaceBootstrap).mockResolvedValueOnce({
      membership: opsMembership,
      organization: {
        id: "org-ops",
        slug: "zynapse-ops",
        name: "Zynapse Ops",
        industry: "ops",
        status: "active",
        createdAt: new Date("2026-04-19T10:00:00.000Z"),
      },
      brandProfile: null,
      demo: {
        canonicalEmail: "demo@zynapse.eu",
        organizationSlug: "zynapse-ops",
        loginRoute: "/demo-login",
        isEnabled: true,
        isDemoWorkspace: false,
        isReadOnly: false,
        shellBadge: null,
        shellDescription: null,
        mutationMessage: null,
      },
    } as never);

    await expect(requireWorkspaceResolverPath()).resolves.toBe("/ops");
  });

  it("bootstraps the creative workspace before returning creative access", async () => {
    const creativeBootstrap = makeCreativeBootstrap();

    vi.mocked(ensureMembershipForCurrentUser).mockResolvedValue(
      creativeBootstrap.membership as never,
    );
    vi.mocked(getCreativeWorkspaceBootstrap).mockResolvedValue(
      creativeBootstrap as never,
    );
    vi.mocked(bootstrapWorkspaceForOrganization).mockResolvedValue(undefined as never);
    vi.mocked(bootstrapCreativeWorkspaceForUser).mockResolvedValue({
      creativeProfile: creativeBootstrap.creativeProfile,
      assignment: null,
    } as never);

    await expect(requireCreativeWorkspaceAccess()).resolves.toEqual(creativeBootstrap);
    expect(bootstrapWorkspaceForOrganization).toHaveBeenCalledWith("org-creative");
    expect(bootstrapCreativeWorkspaceForUser).toHaveBeenCalledWith({
      organizationId: "org-creative",
      userId: "user-1",
      userEmail: "user@zynapse.eu",
      role: "creative_lead",
    });
  });

  it("redirects creative users to the creative landing path when no creative workspace bootstrap exists", async () => {
    vi.mocked(ensureMembershipForCurrentUser).mockResolvedValue(
      makeMembership({
        id: "membership-creative",
        organizationId: "org-creative",
        role: "creative_lead",
      }) as never,
    );
    vi.mocked(getCreativeWorkspaceBootstrap).mockResolvedValue(null as never);

    await expect(requireCreativeWorkspaceAccess()).rejects.toThrow(
      "NEXT_REDIRECT:/login?error=invite_required&next=%2Fcreatives%2Ftasks",
    );
    expect(redirectMock).toHaveBeenCalledWith(
      "/login?error=invite_required&next=%2Fcreatives%2Ftasks",
    );
  });
});
