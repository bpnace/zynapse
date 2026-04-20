import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignWorkflow,
  mapOrganization,
  mapPilotRequest,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";

type GetPilotRequestViewParams = {
  organizationId: string;
  campaignId?: string | null;
};

export async function getPilotRequestView({
  organizationId,
  campaignId,
}: GetPilotRequestViewParams) {
  const supabase = requireServiceRoleClient();

  const { data: organizationRow, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(organizationError, "Failed to load organization");

  const organization = organizationRow ? mapOrganization(organizationRow) : null;

  if (!organization) {
    return null;
  }

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(campaignError, "Failed to load campaigns");

  const campaignsInOrg = (campaignRows ?? []).map(mapCampaign);
  const campaignIds = campaignsInOrg.map((campaign) => campaign.id);
  const stageItemsByCampaignId = new Map<string, Array<{ stageKey: string; status: string }>>();
  const assetsByCampaignId = new Map<string, Array<{ id: string; reviewStatus: string }>>();
  const unresolvedReviewCountByCampaignId = new Map<string, number>();
  const workflowByCampaignId = new Map<string, ReturnType<typeof mapCampaignWorkflow>>();

  if (campaignIds.length > 0) {
    const [stageRows, assetRows, workflowRows] = await Promise.all([
      supabase
        .from("campaign_stages")
        .select("campaign_id,stage_key,status")
        .in("campaign_id", campaignIds),
      supabase
        .from("assets")
        .select("id,campaign_id,review_status")
        .in("campaign_id", campaignIds),
      supabase
        .from("campaign_workflows")
        .select("*")
        .in("campaign_id", campaignIds),
    ]);

    assertSupabaseResult(stageRows.error, "Failed to load pilot request stages");
    assertSupabaseResult(assetRows.error, "Failed to load pilot request assets");
    assertSupabaseResult(workflowRows.error, "Failed to load pilot request workflows");

    for (const row of stageRows.data ?? []) {
      const existing = stageItemsByCampaignId.get(row.campaign_id) ?? [];
      existing.push({
        stageKey: row.stage_key,
        status: row.status,
      });
      stageItemsByCampaignId.set(row.campaign_id, existing);
    }

    const assetIdToCampaignId = new Map<string, string>();
    for (const row of assetRows.data ?? []) {
      const existing = assetsByCampaignId.get(row.campaign_id) ?? [];
      existing.push({
        id: row.id,
        reviewStatus: row.review_status,
      });
      assetsByCampaignId.set(row.campaign_id, existing);
      assetIdToCampaignId.set(row.id, row.campaign_id);
    }

    for (const row of workflowRows.data ?? []) {
      const workflow = mapCampaignWorkflow(row);
      workflowByCampaignId.set(workflow.campaignId, workflow);
    }

    const assetIds = Array.from(assetIdToCampaignId.keys());
    if (assetIds.length > 0) {
      const { data: reviewThreadRows, error: reviewThreadError } = await supabase
        .from("review_threads")
        .select("asset_id")
        .in("asset_id", assetIds)
        .is("resolved_at", null);

      assertSupabaseResult(reviewThreadError, "Failed to load pilot request review threads");

      for (const row of reviewThreadRows ?? []) {
        const campaignId = assetIdToCampaignId.get(row.asset_id);
        if (!campaignId) continue;
        unresolvedReviewCountByCampaignId.set(
          campaignId,
          (unresolvedReviewCountByCampaignId.get(campaignId) ?? 0) + 1,
        );
      }
    }
  }

  const campaignsWithReadiness = campaignsInOrg.map((campaign) => {
    const workflowState = workflowByCampaignId.get(campaign.id) ?? null;
    const readiness = getBrandWorkspaceReadiness({
      stageItems: stageItemsByCampaignId.get(campaign.id) ?? [],
      latestAssets: assetsByCampaignId.get(campaign.id) ?? [],
      openReviewCount: unresolvedReviewCountByCampaignId.get(campaign.id) ?? 0,
      workflowState,
    });

    return {
      ...campaign,
      commercialReady: readiness.showCommercialStep,
    };
  });

  const selectedCampaign =
    campaignsWithReadiness.find((campaign) => campaign.id === campaignId) ??
    campaignsWithReadiness[0] ??
    null;

  const latestRequest = selectedCampaign
    ? await supabase
        .from("pilot_requests")
        .select("*")
        .eq("campaign_id", selectedCampaign.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          assertSupabaseResult(error, "Failed to load pilot requests");
          return data ? mapPilotRequest(data) : null;
        })
    : null;

  return {
    organization,
    campaigns: campaignsWithReadiness,
    selectedCampaign,
    latestRequest,
  };
}
