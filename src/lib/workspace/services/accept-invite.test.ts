import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensureMembershipForCurrentUser } from "@/lib/workspace/services/accept-invite";
import { getDemoWorkspaceConfig, isDemoWorkspaceEmail } from "@/lib/workspace/demo";
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
    isDemoWorkspaceEmail: vi.fn(),
  };
});

type MembershipRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: "brand_admin" | "brand_reviewer" | "zynapse_ops";
  invited_by: string | null;
  accepted_at: string;
};

type InviteRow = {
  id: string;
  organization_id: string;
  email: string;
  role: "brand_admin" | "brand_reviewer" | "zynapse_ops";
  seed_template_key: string | null;
  expires_at: string;
  accepted_at: string | null;
};

function makeMembershipRow(input: {
  id: string;
  organizationId: string;
  role?: MembershipRow["role"];
  acceptedAt?: string;
}): MembershipRow {
  return {
    id: input.id,
    organization_id: input.organizationId,
    user_id: "user-1",
    role: input.role ?? "brand_admin",
    invited_by: null,
    accepted_at: input.acceptedAt ?? "2026-04-19T10:00:00.000Z",
  };
}

function makeOrganizationRow(input: { id: string; slug: string }) {
  return {
    id: input.id,
    name: input.slug,
    slug: input.slug,
    industry: "beauty",
    status: "active",
    created_at: "2026-04-19T10:00:00.000Z",
  };
}

function makeInviteRow(input: { id: string; organizationId: string; email: string }): InviteRow {
  return {
    id: input.id,
    organization_id: input.organizationId,
    email: input.email,
    role: "brand_reviewer",
    seed_template_key: null,
    expires_at: "2026-05-01T10:00:00.000Z",
    accepted_at: null,
  };
}

function createAcceptInviteSupabaseMock(input: {
  existingMemberships?: MembershipRow[];
  transactionMembership?: MembershipRow | null;
  demoOrganization?: ReturnType<typeof makeOrganizationRow> | null;
  activeInvite?: InviteRow | null;
  upsertedMembershipRows?: MembershipRow[];
  fallbackMembership?: MembershipRow | null;
}) {
  const membershipsUpsertSelect = vi.fn(() =>
    Promise.resolve({
      data: input.upsertedMembershipRows ?? [],
      error: null,
    }),
  );
  const membershipsUpsert = vi.fn(() => ({
    select: membershipsUpsertSelect,
  }));
  const invitesUpdateEq = vi.fn(() => Promise.resolve({ error: null }));
  const invitesUpdate = vi.fn(() => ({
    eq: invitesUpdateEq,
  }));

  const supabase = {
    from(table: string) {
      if (table === "memberships") {
        return {
          select: () => ({
            eq: () => ({
              order: () =>
                Promise.resolve({
                  data: input.existingMemberships ?? [],
                  error: null,
                }),
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: input.transactionMembership ?? input.fallbackMembership ?? null,
                    error: null,
                  }),
              }),
            }),
          }),
          upsert: membershipsUpsert,
        };
      }

      if (table === "organizations") {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: input.demoOrganization ?? null,
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }

      if (table === "invites") {
        return {
          select: () => ({
            ilike: () => ({
              is: () => ({
                gt: () => ({
                  limit: () => ({
                    maybeSingle: () =>
                      Promise.resolve({
                        data: input.activeInvite ?? null,
                        error: null,
                      }),
                  }),
                }),
              }),
            }),
          }),
          update: invitesUpdate,
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
  };

  return {
    supabase,
    spies: {
      membershipsUpsert,
      membershipsUpsertSelect,
      invitesUpdate,
      invitesUpdateEq,
    },
  };
}

describe("ensureMembershipForCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDemoWorkspaceConfig).mockReturnValue({
      canonicalEmail: "demo@zynapse.eu",
      organizationSlug: "zynapse-closed-demo",
      loginRoute: "/demo-login",
      isEnabled: true,
    });
  });

  it("reuses the canonical demo membership even when a newer non-demo membership exists", async () => {
    vi.mocked(isDemoWorkspaceEmail).mockReturnValue(true);

    const { supabase, spies } = createAcceptInviteSupabaseMock({
      existingMemberships: [
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
      demoOrganization: makeOrganizationRow({
        id: "org-demo",
        slug: "zynapse-closed-demo",
      }),
    });

    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    const membership = await ensureMembershipForCurrentUser({
      id: "user-1",
      email: "demo@zynapse.eu",
    } as never);

    expect(membership?.organizationId).toBe("org-demo");
    expect(membership?.role).toBe("brand_reviewer");
    expect(spies.membershipsUpsert).not.toHaveBeenCalled();
    expect(spies.invitesUpdate).not.toHaveBeenCalled();
  });

  it("accepts an active invite by creating membership state and marking the invite consumed", async () => {
    vi.mocked(isDemoWorkspaceEmail).mockReturnValue(false);

    const invite = makeInviteRow({
      id: "invite-1",
      organizationId: "org-brand",
      email: "owner@acme.test",
    });

    const { supabase, spies } = createAcceptInviteSupabaseMock({
      existingMemberships: [],
      transactionMembership: null,
      activeInvite: invite,
      upsertedMembershipRows: [
        makeMembershipRow({
          id: "membership-1",
          organizationId: "org-brand",
          role: "brand_reviewer",
        }),
      ],
    });

    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    const membership = await ensureMembershipForCurrentUser({
      id: "user-1",
      email: "owner@acme.test",
    } as never);

    expect(membership?.organizationId).toBe("org-brand");
    expect(spies.membershipsUpsert).toHaveBeenCalledTimes(1);
    expect(spies.membershipsUpsertSelect).toHaveBeenCalledTimes(1);
    expect(spies.invitesUpdate).toHaveBeenCalledWith({
      accepted_at: expect.any(String),
    });
    expect(spies.invitesUpdateEq).toHaveBeenCalledWith("id", "invite-1");
  });
});
