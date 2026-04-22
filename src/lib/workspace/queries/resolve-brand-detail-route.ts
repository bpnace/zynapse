import {
  assertSupabaseResult,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type ResolveBrandReviewDetailHrefParams = {
  organizationId: string;
  reviewId: string;
};

type ResolveBrandDeliveryDetailHrefParams = {
  organizationId: string;
  deliveryId: string;
};

export async function resolveBrandReviewDetailHref({
  organizationId,
  reviewId,
}: ResolveBrandReviewDetailHrefParams) {
  const supabase = requireServiceRoleClient();

  const { data: threadRow, error: threadError } = await supabase
    .from("review_threads")
    .select("asset_id")
    .eq("id", reviewId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(threadError, "Failed to load review thread");

  if (!threadRow?.asset_id) {
    return null;
  }

  const { data: assetRow, error: assetError } = await supabase
    .from("assets")
    .select("id, campaign_id")
    .eq("id", threadRow.asset_id)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(assetError, "Failed to load review asset");

  if (!assetRow?.id || !assetRow.campaign_id) {
    return null;
  }

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, organization_id")
    .eq("id", assetRow.campaign_id)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load review campaign");

  if (!campaignRow || campaignRow.organization_id !== organizationId) {
    return null;
  }

  const searchParams = new URLSearchParams({
    asset: assetRow.id,
  });

  return `${brandsWorkspaceRoutes.campaigns.review(campaignRow.id)}?${searchParams.toString()}`;
}

async function resolveBrandDeliveryCampaignId(
  supabase: ReturnType<typeof requireServiceRoleClient>,
  deliveryId: string,
) {
  const { data: workflowRow, error: workflowError } = await supabase
    .from("campaign_workflows")
    .select("campaign_id")
    .eq("id", deliveryId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(workflowError, "Failed to load delivery workflow");

  if (workflowRow?.campaign_id) {
    return workflowRow.campaign_id;
  }

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("id")
    .eq("id", deliveryId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load delivery campaign");

  return campaignRow?.id ?? null;
}

export async function resolveBrandDeliveryDetailHref({
  organizationId,
  deliveryId,
}: ResolveBrandDeliveryDetailHrefParams) {
  const supabase = requireServiceRoleClient();
  const campaignId = await resolveBrandDeliveryCampaignId(supabase, deliveryId);

  if (!campaignId) {
    return null;
  }

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, organization_id")
    .eq("id", campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load delivery campaign");

  if (!campaignRow || campaignRow.organization_id !== organizationId) {
    return null;
  }

  return brandsWorkspaceRoutes.campaigns.handover(campaignRow.id);
}
