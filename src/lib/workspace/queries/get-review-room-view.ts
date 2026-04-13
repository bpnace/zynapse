import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapComment,
  mapReviewThread,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

type GetReviewRoomViewParams = {
  organizationId: string;
  campaignId: string;
  selectedAssetId?: string | null;
};

function getAssetPriority(reviewStatus: string) {
  if (reviewStatus === "changes_requested") {
    return 0;
  }

  if (reviewStatus === "pending") {
    return 1;
  }

  if (reviewStatus === "approved") {
    return 2;
  }

  return 3;
}

function parseAnchor(anchorJson: string | null) {
  if (!anchorJson) {
    return null;
  }

  try {
    const parsed = JSON.parse(anchorJson) as {
      timecode?: string;
      focus?: string;
    };

    return {
      timecode: parsed.timecode ?? null,
      focus: parsed.focus ?? null,
    };
  } catch {
    return null;
  }
}

export async function getReviewRoomView({
  organizationId,
  campaignId,
  selectedAssetId,
}: GetReviewRoomViewParams) {
  const supabase = requireServiceRoleClient();

  const { data: campaignRow, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(campaignError, "Failed to load campaign");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;

  if (!campaign || campaign.organizationId !== organizationId) {
    return null;
  }

  const { data: assetRows, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(assetError, "Failed to load campaign assets");

  const campaignAssets = (assetRows ?? []).map(mapAsset);

  const orderedAssets = [...campaignAssets].sort((left, right) => {
    const byStatus = getAssetPriority(left.reviewStatus) - getAssetPriority(right.reviewStatus);

    if (byStatus !== 0) {
      return byStatus;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  const assetIds = campaignAssets.map((asset) => asset.id);
  const [threadRows, commentRows] =
    assetIds.length > 0
      ? await Promise.all([
          supabase
            .from("review_threads")
            .select("*")
            .in("asset_id", assetIds)
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
        ])
      : [[], []];

  const threadsByAsset = new Map<
    string,
    Array<{
      threadId: string;
      createdBy: string;
      resolvedAt: Date | null;
      anchor: { timecode: string | null; focus: string | null } | null;
      comments: Array<{
        id: string;
        authorId: string;
        body: string;
        commentType: string;
        createdAt: Date;
      }>;
    }>
  >();

  for (const row of threadRows) {
    const assetThreads = threadsByAsset.get(row.assetId) ?? [];
    const existingThread = assetThreads.find((thread) => thread.threadId === row.id);
    const threadComments = commentRows
      .filter((comment) => comment.threadId === row.id)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

    if (existingThread) {
      existingThread.comments.push(
        ...threadComments.map((comment) => ({
          id: comment.id,
          authorId: comment.authorId,
          body: comment.body,
          commentType: comment.commentType,
          createdAt: comment.createdAt,
        })),
      );
    } else {
      assetThreads.push({
        threadId: row.id,
        createdBy: row.createdBy,
        resolvedAt: row.resolvedAt,
        anchor: parseAnchor(row.anchorJson),
        comments: threadComments.map((comment) => ({
          id: comment.id,
          authorId: comment.authorId,
          body: comment.body,
          commentType: comment.commentType,
          createdAt: comment.createdAt,
        })),
      });
    }

    threadsByAsset.set(row.assetId, assetThreads);
  }

  const enrichedAssets = orderedAssets.map((asset) => {
    const assetThreads = threadsByAsset.get(asset.id) ?? [];
    const latestComment = assetThreads.flatMap((thread) => thread.comments).at(-1) ?? null;

    return {
      ...asset,
      threads: assetThreads,
      threadCount: assetThreads.length,
      latestCommentType: latestComment?.commentType ?? null,
    };
  });

  const selectedAsset =
    enrichedAssets.find((asset) => asset.id === selectedAssetId) ??
    enrichedAssets[0] ??
    null;

  return {
    campaign,
    assets: enrichedAssets,
    selectedAsset,
  };
}
