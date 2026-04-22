import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requireServiceRoleClient } from "@/lib/workspace/data/service-role";
import { approveCampaignSetup } from "@/lib/workspace/actions/approve-campaign-setup";

const { revalidatePathMock, redirectMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

const requireWorkspaceAccessMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
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

function createApproveSetupSupabaseMock(input?: {
  currentStage?: string;
  workflowStatus?: string;
}) {
  const workflowUpsert = vi.fn(() => Promise.resolve({ error: null }));
  const campaignUpdates: Array<{ patch: Record<string, unknown>; id: string }> = [];
  const stageUpdates: Array<{
    patch: Record<string, unknown>;
    campaignId: string;
    stageKey: string;
  }> = [];

  const campaignRow = {
    id: "campaign-1",
    organization_id: "org-1",
    brief_id: "brief-1",
    name: "Spring Launch",
    current_stage: input?.currentStage ?? "setup_planned",
    package_tier: "starter",
    seeded_template_key: null,
    campaign_goal: "Launch new paid-social campaign",
    created_at: "2026-04-22T09:00:00.000Z",
  };

  const workflowRow = {
    id: "workflow-1",
    campaign_id: "campaign-1",
    ops_owner_user_id: "ops-1",
    workflow_status: input?.workflowStatus ?? "setup",
    review_status: "not_ready",
    delivery_status: "not_ready",
    commercial_status: "not_ready",
    blocked_reason: "Waiting for setup approval",
    sla_due_at: "2026-04-30T09:00:00.000Z",
    last_transition_at: "2026-04-22T09:00:00.000Z",
  };

  const supabase = {
    from(table: string) {
      if (table === "campaigns") {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: campaignRow,
                    error: null,
                  }),
              }),
            }),
          }),
          update: (patch: Record<string, unknown>) => ({
            eq: (column: string, value: string) => {
              if (column !== "id") {
                throw new Error(`Unexpected campaigns update filter ${column}`);
              }

              campaignUpdates.push({ patch, id: value });
              return Promise.resolve({ error: null });
            },
          }),
        };
      }

      if (table === "campaign_workflows") {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: workflowRow,
                    error: null,
                  }),
              }),
            }),
          }),
          upsert: workflowUpsert,
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

      throw new Error(`Unexpected table ${table}`);
    },
  };

  return {
    supabase,
    spies: {
      workflowUpsert,
      campaignUpdates,
      stageUpdates,
    },
  };
}

describe("approveCampaignSetup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-22T12:00:00.000Z"));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("moves a setup-planned campaign into production ready and revalidates brand routes", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      membership: { role: "brand_owner" },
      demo: { isReadOnly: false },
    });

    const { supabase, spies } = createApproveSetupSupabaseMock();
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    await expect(approveCampaignSetup("campaign-1")).rejects.toThrow(
      "NEXT_REDIRECT:/brands/campaigns/campaign-1",
    );

    expect(spies.workflowUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign_id: "campaign-1",
        workflow_status: "production",
        review_status: "not_ready",
        delivery_status: "not_ready",
        commercial_status: "not_ready",
        blocked_reason: null,
        ops_owner_user_id: "ops-1",
        sla_due_at: "2026-04-30T09:00:00.000Z",
        last_transition_at: "2026-04-22T12:00:00.000Z",
      }),
      { onConflict: "campaign_id" },
    );

    expect(spies.campaignUpdates).toEqual([
      {
        patch: {
          current_stage: "production_ready",
        },
        id: "campaign-1",
      },
    ]);

    expect(
      spies.stageUpdates.map((entry) => [entry.stageKey, entry.patch.status]),
    ).toEqual([
      ["brief_received", "completed"],
      ["setup_planned", "completed"],
      ["production_ready", "in_progress"],
      ["in_review", "pending"],
      ["approved", "pending"],
      ["handover_ready", "pending"],
    ]);

    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns/campaign-1/setup");
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns/campaign-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns");
  });

  it("does not regress campaigns that are already past setup", async () => {
    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      membership: { role: "brand_owner" },
      demo: { isReadOnly: false },
    });

    const { supabase, spies } = createApproveSetupSupabaseMock({
      currentStage: "production_ready",
      workflowStatus: "production",
    });
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    await expect(approveCampaignSetup("campaign-1")).rejects.toThrow(
      "NEXT_REDIRECT:/brands/campaigns/campaign-1",
    );

    expect(spies.workflowUpsert).not.toHaveBeenCalled();
    expect(spies.campaignUpdates).toHaveLength(0);
    expect(spies.stageUpdates).toHaveLength(0);
  });
});
