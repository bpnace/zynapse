import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requireServiceRoleClient } from "@/lib/workspace/data/service-role";
import { submitCampaignRequest } from "@/lib/workspace/actions/submit-campaign-request";

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

function createSubmitCampaignRequestSupabaseMock() {
  const briefInsert = vi.fn(() => ({
    select: () => ({
      single: () =>
        Promise.resolve({
          data: {
            id: "brief-1",
            organization_id: "org-1",
            created_by: "user-1",
            title: "Serum launch brief",
            status: "submitted",
            objective: "Launch a proof-led paid social creative package for the new hero serum.",
            offer: "Premium skincare serum centered on ingredient proof and visible texture.",
            audience: "Women 25-40 already buying prestige skincare online.",
            channels: "Meta paid social, TikTok cutdowns, landing page loops",
            references_json:
              '{"hooks":"Ingredient proof, founder rationale, texture-led opening","creativeReferences":"Founder card, texture reveal, current highest-performing proof frames"}',
            budget_range: "EUR 15k-25k test window",
            timeline: "Launch within the next four weeks",
            approval_notes: "Founder and growth lead approve claims before final delivery.",
            submitted_at: "2026-04-22T12:30:00.000Z",
            created_at: "2026-04-22T12:30:00.000Z",
          },
          error: null,
        }),
    }),
  }));
  const campaignInsert = vi.fn(() => ({
    select: () => ({
      single: () =>
        Promise.resolve({
          data: {
            id: "campaign-1",
            organization_id: "org-1",
            brief_id: "brief-1",
            name: "Serum launch brief",
            current_stage: "setup_planned",
            package_tier: "starter",
            seeded_template_key: null,
            campaign_goal:
              "Launch a proof-led paid social creative package for the new hero serum.",
            created_at: "2026-04-22T12:30:00.000Z",
          },
          error: null,
        }),
    }),
  }));
  const stageInsert = vi.fn(() => Promise.resolve({ error: null }));
  const workflowUpsert = vi.fn(() => Promise.resolve({ error: null }));

  const supabase = {
    from(table: string) {
      if (table === "briefs") {
        return {
          insert: briefInsert,
        };
      }

      if (table === "campaigns") {
        return {
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () =>
                  Promise.resolve({
                    data: null,
                    error: null,
                  }),
              }),
            }),
          }),
          insert: campaignInsert,
        };
      }

      if (table === "campaign_stages") {
        return {
          insert: stageInsert,
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
      briefInsert,
      campaignInsert,
      stageInsert,
      workflowUpsert,
    },
  };
}

const validInput = {
  title: "Serum launch brief",
  objective: "Launch a proof-led paid social creative package for the new hero serum.",
  offer: "Premium skincare serum centered on ingredient proof and visible texture.",
  audience: "Women 25-40 already buying prestige skincare online.",
  channels: "Meta paid social, TikTok cutdowns, landing page loops",
  hooks: "Ingredient proof, founder rationale, texture-led opening",
  creativeReferences: "Founder card, texture reveal, current highest-performing proof frames",
  budgetRange: "EUR 15k-25k test window",
  timeline: "Launch within the next four weeks",
  approvalNotes: "Founder and growth lead approve claims before final delivery.",
};

describe("submitCampaignRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-22T12:30:00.000Z"));
    vi.clearAllMocks();

    requireWorkspaceAccessMock.mockResolvedValue({
      organization: { id: "org-1" },
      membership: { role: "brand_owner", userId: "user-1" },
      demo: { isReadOnly: false, isDemoWorkspace: false },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates the submitted brief, campaign, stages, and workflow for a new request", async () => {
    const { supabase, spies } = createSubmitCampaignRequestSupabaseMock();
    vi.mocked(requireServiceRoleClient).mockReturnValue(supabase as never);

    await expect(submitCampaignRequest(validInput)).resolves.toEqual({
      success: true,
      message: "Kampagnenanfrage eingereicht. Das Setup kann jetzt geprüft werden.",
      briefId: "brief-1",
      campaignId: "campaign-1",
    });

    expect(spies.briefInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: "org-1",
        created_by: "user-1",
        title: "Serum launch brief",
        status: "submitted",
      }),
    );
    expect(spies.campaignInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        organization_id: "org-1",
        brief_id: "brief-1",
        name: "Serum launch brief",
        current_stage: "setup_planned",
        package_tier: "starter",
      }),
    );
    expect(spies.stageInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "brief_received",
        status: "completed",
      }),
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "setup_planned",
        status: "in_progress",
      }),
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "production_ready",
        status: "pending",
      }),
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "in_review",
        status: "pending",
      }),
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "approved",
        status: "pending",
      }),
      expect.objectContaining({
        campaign_id: "campaign-1",
        stage_key: "handover_ready",
        status: "pending",
      }),
    ]);
    expect(spies.workflowUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign_id: "campaign-1",
        workflow_status: "setup",
        review_status: "not_ready",
        delivery_status: "not_ready",
        commercial_status: "not_ready",
      }),
      { onConflict: "campaign_id" },
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns/new");
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/campaigns/campaign-1/setup");
    expect(revalidatePathMock).toHaveBeenCalledWith("/brands/briefs/brief-1");
  });
});
