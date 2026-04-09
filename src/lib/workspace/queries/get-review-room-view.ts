import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import { comments } from "@/lib/db/schema/comments";
import { reviewThreads } from "@/lib/db/schema/review-threads";

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
  const db = getDb();

  const campaign = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!campaign || campaign.organizationId !== organizationId) {
    return null;
  }

  const campaignAssets = await db
    .select()
    .from(assets)
    .where(eq(assets.campaignId, campaignId))
    .orderBy(desc(assets.createdAt));

  const orderedAssets = [...campaignAssets].sort((left, right) => {
    const byStatus = getAssetPriority(left.reviewStatus) - getAssetPriority(right.reviewStatus);

    if (byStatus !== 0) {
      return byStatus;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  const threadRows = await db
    .select({
      threadId: reviewThreads.id,
      assetId: reviewThreads.assetId,
      createdBy: reviewThreads.createdBy,
      anchorJson: reviewThreads.anchorJson,
      resolvedAt: reviewThreads.resolvedAt,
      commentId: comments.id,
      authorId: comments.authorId,
      body: comments.body,
      commentType: comments.commentType,
      createdAt: comments.createdAt,
    })
    .from(reviewThreads)
    .innerJoin(comments, eq(comments.threadId, reviewThreads.id))
    .innerJoin(assets, eq(reviewThreads.assetId, assets.id))
    .where(eq(assets.campaignId, campaignId))
    .orderBy(asc(reviewThreads.id), asc(comments.createdAt));

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
    const existingThread = assetThreads.find((thread) => thread.threadId === row.threadId);

    if (existingThread) {
      existingThread.comments.push({
        id: row.commentId,
        authorId: row.authorId,
        body: row.body,
        commentType: row.commentType,
        createdAt: row.createdAt,
      });
    } else {
      assetThreads.push({
        threadId: row.threadId,
        createdBy: row.createdBy,
        resolvedAt: row.resolvedAt,
        anchor: parseAnchor(row.anchorJson),
        comments: [
          {
            id: row.commentId,
            authorId: row.authorId,
            body: row.body,
            commentType: row.commentType,
            createdAt: row.createdAt,
          },
        ],
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
