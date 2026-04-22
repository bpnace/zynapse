import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requireServiceRoleClient } from "@/lib/workspace/data/service-role";
import { applyReviewDecision } from "@/lib/workspace/actions/review-actions";

const { revalidatePathMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
}));

const requireWorkspaceAccessMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/auth/guards", () => ({
  requireWorkspaceAccess: () => requireWorkspaceAccessMock(),
}));

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

function createThenableResult(result: { data: unknown; error: unknown }, extensions = {}) {
  return {
    ...extensions,
    then: (
      onFulfilled?: ((value: { data: unknown; error: unknown }) => unknown) | null,
      onRejected?: ((reason: unknown) => unknown) | null,
    ) => Promise.resolve(result).then(onFulfilled ?? undefined, onRejected ?? undefined),
  };
}

function createReviewActionsSupabaseMock(input: {
  selectedAssetStatus: "pending" | "changes_requested";
  campaignAssetStatuses: Array<"approved" | "changes_requested">;
}) {
  const commentsInsert = vi.fn(() => Promise.resolve({ error: null }));
  const assetUpdates: Array<{ patch: Record<string, unknown>; assetId: string }> = [];
  const threadUpdates: Array<{
    patch: Record<string, unknown>;
    mode: "bulk" | "single";
    ids?: string[];
    id?: string;
  }> = [];
  const campaignUpdates: Array<{ patch: Record<string, unknown>; campaignId: string }> = [];
  const stageUpdates: Array<{
    patch: Record<string, unknown>;
    campaignId: string;
    stageKey: string;
  }> = [];
  const workflowUpsert = vi.fn(() => Promise.resolve({ error: null }));

  const selectedAssetRow = {
    id: "asset-1",
    campaign_id: "campaign-1",
    brief_id: null,
    asset_scope: "output",
    asset_type: "video",
    title: "Hook Cut",
    format: "9:16",
    duration_seconds: 15,
    storage_path: "https://cdn.test/hook-cut.mp4",
    thumbnail_path: "https://cdn.test/hook-cut.jpg",
    source: "seed",
    version_label: "v2",
    review_status: input.selectedAssetStatus,
    created_at: "2026-04-22T10:00:00.000Z",
  };

  const campaignAssetRows = input.campaignAssetStatuses.map((status, index) => ({
    id: `asset-${index + 1}`,
    campaign_id: "campaign-1",
    brief_id: null,
    asset_scope: "output",
    asset_type: index === 0 ? "video" : "image",
    title: index === 0 ? "Hook Cut" : "Static Cut",
    format: index === 0 ? "9:16" : "1:1",
    duration_seconds: index === 0 ? 15 : null,
    storage_path: `https://cdn.test/asset-${index + 1}`,
    thumbnail_path: `https://cdn.test/asset-${index + 1}.jpg`,
    source: "seed",
    version_label: "v2",
    review_status: status,
    created_at: `2026-04-22T10:0${index}:00.000Z`,
  }));

  const openThreadRows = [
    {
      id: "thread-1",
      asset_id: "asset-1",
      created_by: "brand_owner",
      anchor_json: null,
      resolved_at: null,
    },
  ];

  const supabase = {
    from(table: string) {
      if (table === "campaigns") {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: {
                      id: "campaign-1",
                      organization_id: "org-1",
                      brief_id: "brief-1",
                      name: "Spring Launch",
                      current_stage: "in_review",
                      package_tier: "starter",
                      seeded_template_key: null,
                      campaign_goal: "Launch a new paid-social offer",
                      created_at: "2026-04-22T09:00:00.000Z",
                    },
                    error: null,
                  }),
              }),
            }),
          }),
          update: (patch: Record<string, unknown>) => ({
            eq: (column: string, value: string) => {
              if (column !== "id") {
                throw new Error(`Unexpected campaign filter ${column}`);
              }

              campaignUpdates.push({ patch, campaignId: value });
              return Promise.resolve({ error: null });
            },
          }),
        };
      }

      if (table === "assets") {
        return {
          select: () => ({
            eq: (column: string) => {
              if (column === "id") {
                return {
                  limit: () => ({
                    maybeSingle: () =>
                      Promise.resolve({
                        data: selectedAssetRow,
                        error: null,
                      }),
                  }),
                };
              }

              if (column === "campaign_id") {
                return createThenableResult({
                  data: campaignAssetRows,
                  error: null,
                });
              }

              throw new Error(`Unexpected assets filter ${column}`);
            },
          }),
          update: (patch: Record<string, unknown>) => ({
            eq: (column: string, value: string) => {
              if (column !== "id") {
                throw new Error(`Unexpected assets update filter ${column}`);
              }

              assetUpdates.push({ patch, assetId: value });
              return Promise.resolve({ error: null });
            },
          }),
        };
      }

      if (table === "review_threads") {
        return {
          select: () => ({
            eq: () =>
              createThenableResult(
                {
                  data: openThreadRows,
                  error: null,
                },
                {
                  is: () => ({
                    limit: () =>
                      Promise.resolve({
                        data: openThreadRows,
                        error: null,
                      }),
                  }),
                },
              ),
          }),
          update: (patch: Record<string, unknown>) => ({
            in: (_column: string, ids: string[]) => {
              threadUpdates.push({ patch, mode: "bulk", ids });
              return Promise.resolve({ error: null });
            },
            eq: (_column: string, id: string) => {
              threadUpdates.push({ patch, mode: "single", id });
              return Promise.resolve({ error: null });
            },
          }),
        };
      }

      if (table === "comments") {
        return {
          insert: commentsInsert,
        };
      }

      if (table === "campaign_stages") {
        return {
          update: (patch: Record<string, unknown>) => ({
            eq: (firstColumn: string, firstValue: string) => ({
              eq: (secondColumn: string, secondValue: string) => {
                if (firstColumn !== "campaign_id" || secondColumn !== "stage_key") {
                  throw new Error("Unexpected campaign_stages filters");
                }

                stageUpdates.push({
                  patch,
                  campaignId: firstValue,
                  stageKey: secondValue,
                });

                return Promise.resolve({ error: null });
              },
            }),
          }),
        };
      }

      if (table === "campaign_workflows") {
        return {
          upsert: workflowUpsert,
        };
      }

      throw new Error(`Unexpected table ${table}`);
    },
  };

  return {
    supabase,
    spies: {
      commentsInsert,
      assetUpdates,
      threadUpdates,
      campaignUpdates,
      stageUpdates,
      workflowUpsert,
    },
  };
}

describe("applyReviewDecision", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-22T12:00:00.000Z"));
    vi.clearAllMocks();

    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      membership: { role: "brand_owner" },
      demo: { isReadOnly: false, isDemoWorkspace: false },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("moves the campaign toward delivery preparation when the final asset is approved", async () => {
    const { supabase, spies } = createReviewActionsSupabaseMock({
      selectedAssetStatus: "pending",
      campaignAssetStatuses: ["approved", "approved"],
    });
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    await expect(
      applyReviewDecision("campaign-1", "asset-1", {
        decision: "approved",
        note: "Ready for handover.",
      }),
    ).resolves.toEqual({
      success: true,
      message: "Asset freigegeben.",
    });

    expect(spies.commentsInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        thread_id: "thread-1",
        comment_type: "approval_note",
        body: "Ready for handover.",
      }),
    );
    expect(spies.assetUpdates).toEqual([
      {
        patch: { review_status: "approved" },
        assetId: "asset-1",
      },
    ]);
    expect(spies.threadUpdates).toContainEqual({
      patch: { resolved_at: "2026-04-22T12:00:00.000Z" },
      mode: "bulk",
      ids: ["thread-1"],
    });
    expect(spies.campaignUpdates).toEqual([
      {
        patch: { current_stage: "approved" },
        campaignId: "campaign-1",
      },
    ]);
    expect(spies.workflowUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign_id: "campaign-1",
        workflow_status: "handover",
        review_status: "approved",
        delivery_status: "preparing",
        commercial_status: "ready_for_pilot",
      }),
      { onConflict: "campaign_id" },
    );
    expect(
      spies.stageUpdates.map((entry) => [entry.stageKey, entry.patch.status]),
    ).toEqual([
      ["in_review", "completed"],
      ["approved", "in_progress"],
      ["handover_ready", "pending"],
    ]);
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns/campaign-1/review");
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/deliveries");
  });

  it("keeps the campaign in review when changes are requested", async () => {
    const { supabase, spies } = createReviewActionsSupabaseMock({
      selectedAssetStatus: "pending",
      campaignAssetStatuses: ["changes_requested", "approved"],
    });
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    await expect(
      applyReviewDecision("campaign-1", "asset-1", {
        decision: "changes_requested",
        note: "Please tighten the first second.",
      }),
    ).resolves.toEqual({
      success: true,
      message: "Änderungswunsch gespeichert.",
    });

    expect(spies.assetUpdates).toEqual([
      {
        patch: { review_status: "changes_requested" },
        assetId: "asset-1",
      },
    ]);
    expect(spies.threadUpdates).toContainEqual({
      patch: { resolved_at: null },
      mode: "single",
      id: "thread-1",
    });
    expect(spies.campaignUpdates).toEqual([
      {
        patch: { current_stage: "in_review" },
        campaignId: "campaign-1",
      },
    ]);
    expect(spies.workflowUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign_id: "campaign-1",
        workflow_status: "review",
        review_status: "in_review",
        delivery_status: "not_ready",
        commercial_status: "not_ready",
      }),
      { onConflict: "campaign_id" },
    );
    expect(
      spies.stageUpdates.map((entry) => [entry.stageKey, entry.patch.status]),
    ).toEqual([
      ["in_review", "in_progress"],
      ["approved", "pending"],
      ["handover_ready", "pending"],
    ]);
  });
});
