import { beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrapCreativeWorkspaceForUser } from "@/lib/workspace/seeds/bootstrap-creative-workspace";
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

function createCreativeProfileRow(userId: string) {
  return {
    id: "creative-profile-1",
    user_id: userId,
    slug: "alex-motion",
    display_name: "Alex Motion",
    headline: "Motion creative lead",
    bio: "Focused on launch-ready delivery",
    specialties: "Motion, Hooks",
    portfolio_url: null,
    availability_status: "active",
    created_at: "2026-04-19T10:00:00.000Z",
  };
}

function createCampaignRow(organizationId: string) {
  return {
    id: "campaign-1",
    organization_id: organizationId,
    brief_id: null,
    name: "Launch Sprint",
    current_stage: "in_review",
    package_tier: "Growth",
    seeded_template_key: "d2c_product_launch",
    campaign_goal: "Launch hero campaign",
    created_at: "2026-04-19T10:00:00.000Z",
  };
}

function createAssignmentRow(userId: string) {
  return {
    id: "assignment-1",
    campaign_id: "campaign-1",
    user_id: userId,
    assignment_role: "creative_lead",
    status: "in_progress",
    assigned_by: null,
    scope_summary: "Own execution quality for the current sprint",
    due_at: "2026-04-22T10:00:00.000Z",
    accepted_at: "2026-04-20T10:00:00.000Z",
    submitted_at: null,
    created_at: "2026-04-19T10:00:00.000Z",
  };
}

function createAssetRows() {
  return [
    {
      id: "asset-1",
      campaign_id: "campaign-1",
      brief_id: null,
      asset_scope: "output",
      asset_type: "video",
      title: "Hero Cut",
      format: "9:16",
      duration_seconds: 15,
      storage_path: "seed/hero-cut.mp4",
      thumbnail_path: "seed/hero-cut.jpg",
      source: "seed",
      version_label: "v1",
      review_status: "changes_requested",
      created_at: "2026-04-19T10:00:00.000Z",
    },
    {
      id: "asset-2",
      campaign_id: "campaign-1",
      brief_id: null,
      asset_scope: "output",
      asset_type: "image",
      title: "Offer Static",
      format: "1:1",
      duration_seconds: null,
      storage_path: "seed/offer-static.png",
      thumbnail_path: "seed/offer-static.jpg",
      source: "seed",
      version_label: "v1",
      review_status: "pending",
      created_at: "2026-04-19T11:00:00.000Z",
    },
  ];
}

function createCreativeBootstrapSupabaseMock(input?: {
  campaignRows?: ReturnType<typeof createCampaignRow>[];
  taskRows?: unknown[];
  revisionRows?: unknown[];
}) {
  const creativeTaskInsert = vi.fn(() => Promise.resolve({ error: null }));
  const revisionInsert = vi.fn(() => Promise.resolve({ error: null }));

  const supabase = {
    from(table: string) {
      if (table === "creative_profiles") {
        return {
          upsert: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: createCreativeProfileRow("user-1"),
                  error: null,
                }),
            }),
          }),
        };
      }

      if (table === "campaigns") {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: input?.campaignRows ?? [createCampaignRow("org-1")],
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }

      if (table === "campaign_assignments") {
        return {
          upsert: () => ({
            select: () =>
              Promise.resolve({
                data: [createAssignmentRow("user-1")],
                error: null,
              }),
          }),
        };
      }

      if (table === "creative_tasks") {
        return {
          select: () => ({
            eq: () => ({
              limit: () =>
                Promise.resolve({
                  data: input?.taskRows ?? [],
                  error: null,
                }),
            }),
          }),
          insert: creativeTaskInsert,
        };
      }

      if (table === "assets") {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: createAssetRows(),
                    error: null,
                  }),
              }),
            }),
          }),
        };
      }

      if (table === "revision_items") {
        return {
          select: () => ({
            eq: () => ({
              limit: () =>
                Promise.resolve({
                  data: input?.revisionRows ?? [],
                  error: null,
                }),
            }),
          }),
          insert: revisionInsert,
        };
      }

      if (table === "review_threads") {
        return {
          select: () => ({
            in: () =>
              Promise.resolve({
                data: [
                  {
                    id: "thread-1",
                    asset_id: "asset-1",
                    created_by: "ops-user-1",
                    anchor_json: null,
                    resolved_at: null,
                  },
                ],
                error: null,
              }),
          }),
        };
      }

      if (table === "comments") {
        return {
          select: () =>
            Promise.resolve({
              data: [
                {
                  id: "comment-1",
                  thread_id: "thread-1",
                  author_id: "ops-user-1",
                  body: "Tighten the first second and clarify the CTA.",
                  comment_type: "change_request",
                  created_at: "2026-04-20T09:00:00.000Z",
                },
              ],
              error: null,
            }),
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
  };

  return {
    supabase,
    spies: {
      creativeTaskInsert,
      revisionInsert,
    },
  };
}

describe("bootstrapCreativeWorkspaceForUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("seeds creative tasks and revisions for the latest campaign when the creative workspace is empty", async () => {
    const { supabase, spies } = createCreativeBootstrapSupabaseMock();
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    const bootstrap = await bootstrapCreativeWorkspaceForUser({
      organizationId: "org-1",
      userId: "user-1",
      userEmail: "alex.motion@studio.test",
      role: "creative_lead",
    });

    expect(bootstrap.creativeProfile?.displayName).toBe("Alex Motion");
    expect(bootstrap.assignment?.id).toBe("assignment-1");
    expect(spies.creativeTaskInsert).toHaveBeenCalledTimes(1);
    expect(spies.creativeTaskInsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          assignment_id: "assignment-1",
          asset_id: "asset-1",
          owner_user_id: "user-1",
          title: "Refine Hero Cut",
          task_type: "revision",
          status: "in_progress",
        }),
        expect.objectContaining({
          assignment_id: "assignment-1",
          asset_id: "asset-2",
          owner_user_id: "user-1",
          title: "Package Offer Static",
          task_type: "delivery",
          status: "todo",
        }),
      ]),
    );
    expect(spies.revisionInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        assignment_id: "assignment-1",
        asset_id: "asset-1",
        review_thread_id: "thread-1",
        source_comment_id: "comment-1",
        created_by: "ops-user-1",
        title: "Resolve feedback for Hero Cut",
        detail: "Tighten the first second and clarify the CTA.",
        status: "open",
        priority: "high",
      }),
    ]);
  });

  it("returns a creative profile without seeding assignment state when no campaign exists yet", async () => {
    const { supabase, spies } = createCreativeBootstrapSupabaseMock({
      campaignRows: [],
    });
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    const bootstrap = await bootstrapCreativeWorkspaceForUser({
      organizationId: "org-1",
      userId: "user-1",
      userEmail: "alex.motion@studio.test",
      role: "creative_lead",
    });

    expect(bootstrap.creativeProfile?.displayName).toBe("Alex Motion");
    expect(bootstrap.assignment).toBeNull();
    expect(spies.creativeTaskInsert).not.toHaveBeenCalled();
    expect(spies.revisionInsert).not.toHaveBeenCalled();
  });
});
