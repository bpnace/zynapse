import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceRole } from "@/lib/auth/roles";
import { getWorkspaceBootstrap } from "@/lib/workspace/queries/get-workspace-bootstrap";
import { getDemoWorkspaceConfig, getWorkspaceDemoState, isDemoWorkspaceEmail } from "@/lib/workspace/demo";
import { requireServiceRoleClient } from "@/lib/workspace/data/service-role";

vi.mock("@/lib/workspace/data/service-role", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/workspace/data/service-role")>(
      "@/lib/workspace/data/service-role",
    );

  return {
    ...actual,
    requireServiceRoleClient: vi.fn(),
  };
});

vi.mock("@/lib/workspace/demo", async () => {
  const actual = await vi.importActual<typeof import("@/lib/workspace/demo")>(
    "@/lib/workspace/demo",
  );

  return {
    ...actual,
    getDemoWorkspaceConfig: vi.fn(),
    getWorkspaceDemoState: vi.fn(),
    isDemoWorkspaceEmail: vi.fn(),
  };
});

type QueryResult<T> = Promise<{ data: T; error: null }>;

function makeMembershipRow(input: {
  id: string;
  organizationId: string;
  userId?: string;
  role?: WorkspaceRole;
  acceptedAt?: string;
}) {
  return {
    id: input.id,
    organization_id: input.organizationId,
    user_id: input.userId ?? "user-1",
    role: input.role ?? "brand_owner",
    invited_by: null,
    accepted_at: input.acceptedAt ?? "2026-04-19T10:00:00.000Z",
  };
}

function makeOrganizationRow(input: { id: string; slug: string; name?: string }) {
  return {
    id: input.id,
    name: input.name ?? input.slug,
    slug: input.slug,
    industry: "beauty",
    status: "active",
    created_at: "2026-04-19T10:00:00.000Z",
  };
}

function makeBrandProfileRow(organizationId: string) {
  return {
    organization_id: organizationId,
    website: "https://example.com",
    offer_summary: "Performance creative system",
    target_audience: "Growth teams",
    primary_channels: ["meta"],
    brand_tone: "direct",
    review_notes: null,
    claim_guardrails: null,
    updated_at: "2026-04-19T10:00:00.000Z",
  };
}

function resolved<T>(data: T): QueryResult<T> {
  return Promise.resolve({ data, error: null });
}

function createBootstrapSupabaseMock(input: {
  demoOrganization: ReturnType<typeof makeOrganizationRow> | null;
  memberships: ReturnType<typeof makeMembershipRow>[];
  organizationsById: Record<string, ReturnType<typeof makeOrganizationRow> | null>;
  brandProfilesByOrganizationId: Record<string, ReturnType<typeof makeBrandProfileRow> | null>;
}) {
  return {
    from(table: string) {
      if (table === "memberships") {
        return {
          select: () => ({
            eq: () => resolved(input.memberships),
          }),
        };
      }

      if (table === "organizations") {
        return {
          select: () => ({
            eq: (column: string, value: string) => ({
              limit: () => ({
                maybeSingle: () =>
                  resolved(
                    column === "slug"
                      ? input.demoOrganization
                      : (input.organizationsById[value] ?? null),
                  ),
              }),
            }),
          }),
        };
      }

      if (table === "brand_profiles") {
        return {
          select: () => ({
            eq: (_column: string, value: string) => ({
              limit: () => ({
                maybeSingle: () =>
                  resolved(input.brandProfilesByOrganizationId[value] ?? null),
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
  };
}

describe("getWorkspaceBootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDemoWorkspaceConfig).mockReturnValue({
      canonicalEmail: "demo@zynapse.eu",
      organizationSlug: "zynapse-closed-demo",
      loginRoute: "/demo-login",
      isEnabled: true,
    });
    vi.mocked(getWorkspaceDemoState).mockImplementation(({ userEmail, organizationSlug }) => ({
      canonicalEmail: "demo@zynapse.eu",
      organizationSlug: organizationSlug ?? "unknown",
      loginRoute: "/demo-login",
      isEnabled: true,
      isDemoWorkspace: userEmail === "demo@zynapse.eu",
      isReadOnly: userEmail === "demo@zynapse.eu",
      shellBadge: "Geschlossene Demo",
      shellDescription: "Demo workspace",
      mutationMessage: "Read only",
    }));
  });

  it("pins canonical demo users to the demo organization even when other memberships exist", async () => {
    vi.mocked(isDemoWorkspaceEmail).mockReturnValue(true);

    vi.mocked(requireServiceRoleClient).mockReturnValue(
      createBootstrapSupabaseMock({
        demoOrganization: makeOrganizationRow({
          id: "org-demo",
          slug: "zynapse-closed-demo",
          name: "Demo Org",
        }),
        memberships: [
          makeMembershipRow({
            id: "membership-brand",
            organizationId: "org-brand",
            acceptedAt: "2026-04-19T12:00:00.000Z",
          }),
          makeMembershipRow({
            id: "membership-demo",
            organizationId: "org-demo",
            role: "brand_reviewer",
            acceptedAt: "2026-04-19T08:00:00.000Z",
          }),
        ],
        organizationsById: {
          "org-brand": makeOrganizationRow({ id: "org-brand", slug: "acme" }),
          "org-demo": makeOrganizationRow({
            id: "org-demo",
            slug: "zynapse-closed-demo",
            name: "Demo Org",
          }),
        },
        brandProfilesByOrganizationId: {
          "org-demo": makeBrandProfileRow("org-demo"),
        },
      }) as never,
    );

    const bootstrap = await getWorkspaceBootstrap({
      id: "user-1",
      email: "demo@zynapse.eu",
    });

    expect(bootstrap).not.toBeNull();
    expect(bootstrap?.membership.organizationId).toBe("org-demo");
    expect(bootstrap?.organization.slug).toBe("zynapse-closed-demo");
    expect(bootstrap?.brandProfile?.organizationId).toBe("org-demo");
    expect(bootstrap?.demo.isDemoWorkspace).toBe(true);
  });

  it("falls back to the first membership for non-demo users", async () => {
    vi.mocked(isDemoWorkspaceEmail).mockReturnValue(false);

    vi.mocked(requireServiceRoleClient).mockReturnValue(
      createBootstrapSupabaseMock({
        demoOrganization: null,
        memberships: [
          makeMembershipRow({
            id: "membership-brand",
            organizationId: "org-brand",
          }),
          makeMembershipRow({
            id: "membership-second",
            organizationId: "org-second",
          }),
        ],
        organizationsById: {
          "org-brand": makeOrganizationRow({ id: "org-brand", slug: "acme" }),
          "org-second": makeOrganizationRow({ id: "org-second", slug: "globex" }),
        },
        brandProfilesByOrganizationId: {
          "org-brand": makeBrandProfileRow("org-brand"),
        },
      }) as never,
    );

    const bootstrap = await getWorkspaceBootstrap({
      id: "user-1",
      email: "owner@acme.test",
    });

    expect(bootstrap?.membership.organizationId).toBe("org-brand");
    expect(bootstrap?.organization.slug).toBe("acme");
    expect(bootstrap?.demo.isDemoWorkspace).toBe(false);
  });

  it("selects the ops membership when the bootstrap is requested for the ops control plane", async () => {
    vi.mocked(isDemoWorkspaceEmail).mockReturnValue(false);

    vi.mocked(requireServiceRoleClient).mockReturnValue(
      createBootstrapSupabaseMock({
        demoOrganization: null,
        memberships: [
          makeMembershipRow({
            id: "membership-brand",
            organizationId: "org-brand",
            role: "brand_owner",
            acceptedAt: "2026-04-19T12:00:00.000Z",
          }),
          makeMembershipRow({
            id: "membership-ops",
            organizationId: "org-ops",
            role: "ops_admin",
            acceptedAt: "2026-04-19T09:00:00.000Z",
          }),
        ],
        organizationsById: {
          "org-brand": makeOrganizationRow({ id: "org-brand", slug: "acme" }),
          "org-ops": makeOrganizationRow({ id: "org-ops", slug: "zynapse-ops" }),
        },
        brandProfilesByOrganizationId: {
          "org-ops": makeBrandProfileRow("org-ops"),
        },
      }) as never,
    );

    const bootstrap = await getWorkspaceBootstrap(
      {
        id: "user-1",
        email: "ops@zynapse.eu",
      },
      {
        workspaceType: "ops",
      },
    );

    expect(bootstrap).not.toBeNull();
    expect(bootstrap?.membership.role).toBe("ops_admin");
    expect(bootstrap?.membership.organizationId).toBe("org-ops");
    expect(bootstrap?.organization.slug).toBe("zynapse-ops");
    expect(bootstrap?.brandProfile?.organizationId).toBe("org-ops");
    expect(bootstrap?.demo.isDemoWorkspace).toBe(false);
  });
});
