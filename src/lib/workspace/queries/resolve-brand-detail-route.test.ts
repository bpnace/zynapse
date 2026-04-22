import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resolveBrandDeliveryDetailHref,
  resolveBrandReviewDetailHref,
} from "@/lib/workspace/queries/resolve-brand-detail-route";

const { queryState } = vi.hoisted(() => ({
  queryState: {
    review_threads: [] as Array<{ data: unknown; error: unknown }>,
    assets: [] as Array<{ data: unknown; error: unknown }>,
    campaigns: [] as Array<{ data: unknown; error: unknown }>,
    campaign_workflows: [] as Array<{ data: unknown; error: unknown }>,
  },
}));

const fromMock = vi.fn((table: keyof typeof queryState) => ({
  select: vi.fn(() => ({
    eq: vi.fn(() => ({
      limit: vi.fn(() => ({
        maybeSingle: vi.fn(async () => {
          const nextResult = queryState[table].shift();

          if (!nextResult) {
            throw new Error(`No queued result for ${table}`);
          }

          return nextResult;
        }),
      })),
    })),
  })),
}));

vi.mock("@/lib/workspace/data/service-role", () => ({
  assertSupabaseResult: (error: unknown, message: string) => {
    if (error) {
      throw new Error(message);
    }
  },
  requireServiceRoleClient: () => ({
    from: fromMock,
  }),
}));

afterEach(() => {
  fromMock.mockClear();
  queryState.review_threads = [];
  queryState.assets = [];
  queryState.campaigns = [];
  queryState.campaign_workflows = [];
});

describe("resolveBrandReviewDetailHref", () => {
  it("maps a review thread to the campaign review route with the selected asset", async () => {
    queryState.review_threads.push({
      data: { asset_id: "asset-1" },
      error: null,
    });
    queryState.assets.push({
      data: { id: "asset-1", campaign_id: "campaign-1" },
      error: null,
    });
    queryState.campaigns.push({
      data: { id: "campaign-1", organization_id: "org-1" },
      error: null,
    });

    await expect(
      resolveBrandReviewDetailHref({
        organizationId: "org-1",
        reviewId: "thread-1",
      }),
    ).resolves.toBe("/brands/campaigns/campaign-1/review?asset=asset-1");
  });

  it("returns null when the resolved campaign belongs to a different organization", async () => {
    queryState.review_threads.push({
      data: { asset_id: "asset-1" },
      error: null,
    });
    queryState.assets.push({
      data: { id: "asset-1", campaign_id: "campaign-1" },
      error: null,
    });
    queryState.campaigns.push({
      data: { id: "campaign-1", organization_id: "org-2" },
      error: null,
    });

    await expect(
      resolveBrandReviewDetailHref({
        organizationId: "org-1",
        reviewId: "thread-1",
      }),
    ).resolves.toBeNull();
  });
});

describe("resolveBrandDeliveryDetailHref", () => {
  it("resolves workflow-backed delivery ids to the handover route", async () => {
    queryState.campaign_workflows.push({
      data: { campaign_id: "campaign-1" },
      error: null,
    });
    queryState.campaigns.push({
      data: { id: "campaign-1", organization_id: "org-1" },
      error: null,
    });

    await expect(
      resolveBrandDeliveryDetailHref({
        organizationId: "org-1",
        deliveryId: "workflow-1",
      }),
    ).resolves.toBe("/brands/campaigns/campaign-1/handover");
  });

  it("falls back to a campaign id when no workflow row exists", async () => {
    queryState.campaign_workflows.push({
      data: null,
      error: null,
    });
    queryState.campaigns.push(
      {
        data: { id: "campaign-1" },
        error: null,
      },
      {
        data: { id: "campaign-1", organization_id: "org-1" },
        error: null,
      },
    );

    await expect(
      resolveBrandDeliveryDetailHref({
        organizationId: "org-1",
        deliveryId: "campaign-1",
      }),
    ).resolves.toBe("/brands/campaigns/campaign-1/handover");
  });
});
