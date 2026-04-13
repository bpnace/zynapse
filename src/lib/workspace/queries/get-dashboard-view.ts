import {
  assertSupabaseResult,
  mapAsset,
  mapBrandProfile,
  mapCampaign,
  mapCampaignStage,
  mapComment,
  mapReviewThread,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

export async function getDashboardView(organizationId: string) {
  const supabase = requireServiceRoleClient();

  const { data: organizationCampaignRows, error: organizationCampaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(organizationCampaignError, "Failed to load campaigns");

  const organizationCampaigns = (organizationCampaignRows ?? []).map(mapCampaign);

  const latestCampaign = organizationCampaigns[0] ?? null;

  const { data: profileRow, error: profileError } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(profileError, "Failed to load brand profile");

  const profile = profileRow ? mapBrandProfile(profileRow) : null;

  const stageItems = latestCampaign
    ? await supabase
        .from("campaign_stages")
        .select("*")
        .eq("campaign_id", latestCampaign.id)
        .order("stage_order", { ascending: true })
        .then(({ data, error }) => {
          assertSupabaseResult(error, "Failed to load campaign stages");
          return (data ?? []).map(mapCampaignStage);
        })
    : [];

  const latestAssets = latestCampaign
    ? await supabase
        .from("assets")
        .select("*")
        .eq("campaign_id", latestCampaign.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          assertSupabaseResult(error, "Failed to load campaign assets");
          return (data ?? []).map(mapAsset);
        })
    : [];

  const latestAssetIds = latestAssets.map((asset) => asset.id);

  const threadPreview =
    latestCampaign && latestAssetIds.length > 0
      ? await Promise.all([
          supabase
            .from("review_threads")
            .select("*")
            .in("asset_id", latestAssetIds)
            .then(({ data, error }) => {
              assertSupabaseResult(error, "Failed to load review threads");
              return (data ?? []).map(mapReviewThread);
            }),
          supabase
            .from("comments")
            .select("*")
            .then(({ data, error }) => {
              assertSupabaseResult(error, "Failed to load review comments");
              return (data ?? []).map(mapComment);
            }),
        ]).then(([threads, commentRows]) => {
          const assetTitleById = new Map(latestAssets.map((asset) => [asset.id, asset.title]));
          return threads.flatMap((thread) =>
            commentRows
              .filter((comment) => comment.threadId === thread.id)
              .map((comment) => ({
                threadId: thread.id,
                assetId: thread.assetId,
                assetTitle: assetTitleById.get(thread.assetId) ?? "Asset",
                createdBy: thread.createdBy,
                anchorJson: thread.anchorJson,
                commentBody: comment.body,
                commentType: comment.commentType,
                commentCreatedAt: comment.createdAt,
              })),
          );
        })
      : [];

  const reviewThreadsById = new Map<
    string,
    {
      threadId: string;
      assetId: string;
      assetTitle: string;
      createdBy: string;
      anchorJson: string | null;
      comments: {
        body: string;
        commentType: string;
        createdAt: Date;
      }[];
    }
  >();

  for (const item of threadPreview) {
    const existing = reviewThreadsById.get(item.threadId);

    if (existing) {
      existing.comments.push({
        body: item.commentBody,
        commentType: item.commentType,
        createdAt: item.commentCreatedAt,
      });
      continue;
    }

    reviewThreadsById.set(item.threadId, {
      threadId: item.threadId,
      assetId: item.assetId,
      assetTitle: item.assetTitle,
      createdBy: item.createdBy,
      anchorJson: item.anchorJson,
      comments: [
        {
          body: item.commentBody,
          commentType: item.commentType,
          createdAt: item.commentCreatedAt,
        },
      ],
    });
  }

  const template = latestCampaign?.seededTemplateKey
    ? getSeedTemplate(latestCampaign.seededTemplateKey)
    : null;

  return {
    profile,
    campaigns: organizationCampaigns,
    latestCampaign,
    stageItems,
    latestAssets,
    reviewThreadCount: reviewThreadsById.size,
    reviewThreads: Array.from(reviewThreadsById.values()).slice(0, 3),
    template,
  };
}
