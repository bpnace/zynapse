import { asc, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import { campaignStages } from "@/lib/db/schema/campaign-stages";
import { reviewThreads } from "@/lib/db/schema/review-threads";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

type GetCampaignDetailViewParams = {
  organizationId: string;
  campaignId: string;
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

function extractAngleLabel(title: string) {
  const [, afterDivider] = title.split("·").map((part) => part.trim());
  return afterDivider || title;
}

function buildPackageRecommendation(packageTier: string, nextStepCopy: string | null) {
  if (packageTier === "growth") {
    return {
      heading: "Growth-style package fit",
      body:
        nextStepCopy ??
        "This seeded campaign already suggests an ongoing cadence, so the stronger recommendation is continuity rather than a one-off sprint.",
    };
  }

  return {
    heading: "Starter pilot fit",
    body:
      nextStepCopy ??
      "The current campaign is structured as a focused proof of process, which aligns with a paid Starter pilot before broader rollout.",
  };
}

function buildReviewDeadlineContext(currentStage: string, changeRequestedCount: number) {
  if (currentStage === "in_review") {
    return {
      label: "Current review cycle",
      detail:
        changeRequestedCount > 0
          ? "No explicit deadline is seeded. The current review cycle stays open until the requested changes are resolved."
          : "No explicit deadline is seeded. The current review cycle stays open until final reviewer decisions land.",
    };
  }

  return {
    label: "Review timing",
    detail: "The seeded workspace does not define a hard deadline for this stage yet.",
  };
}

export async function getCampaignDetailView({
  organizationId,
  campaignId,
}: GetCampaignDetailViewParams) {
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

  const [stageItems, campaignAssets, threadCounts] = await Promise.all([
    db
      .select()
      .from(campaignStages)
      .where(eq(campaignStages.campaignId, campaignId))
      .orderBy(asc(campaignStages.stageOrder)),
    db
      .select()
      .from(assets)
      .where(eq(assets.campaignId, campaignId))
      .orderBy(desc(assets.createdAt)),
    db
      .select({
        assetId: reviewThreads.assetId,
        total: count(reviewThreads.id),
      })
      .from(reviewThreads)
      .innerJoin(assets, eq(reviewThreads.assetId, assets.id))
      .where(eq(assets.campaignId, campaignId))
      .groupBy(reviewThreads.assetId),
  ]);

  const threadCountMap = new Map(threadCounts.map((row) => [row.assetId, row.total]));

  const orderedAssets = [...campaignAssets].sort((left, right) => {
    const byStatus = getAssetPriority(left.reviewStatus) - getAssetPriority(right.reviewStatus);

    if (byStatus !== 0) {
      return byStatus;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  const template = campaign.seededTemplateKey
    ? getSeedTemplate(campaign.seededTemplateKey)
    : null;

  const prioritizedAngles = Array.from(
    new Map(
      orderedAssets.map((asset) => [
        extractAngleLabel(asset.title),
        {
          label: extractAngleLabel(asset.title),
          status: asset.reviewStatus,
          sourceTitle: asset.title,
        },
      ]),
    ).values(),
  ).slice(0, 4);

  const deliverableSummary = {
    total: orderedAssets.length,
    approved: orderedAssets.filter((asset) => asset.reviewStatus === "approved").length,
    pending: orderedAssets.filter((asset) => asset.reviewStatus === "pending").length,
    changesRequested: orderedAssets.filter((asset) => asset.reviewStatus === "changes_requested")
      .length,
    videos: orderedAssets.filter((asset) => asset.assetType.includes("video")).length,
    statics: orderedAssets.filter((asset) => !asset.assetType.includes("video")).length,
  };

  const reviewReadiness = {
    openThreads: threadCounts.reduce((sum, row) => sum + row.total, 0),
    assetsReadyForApproval: deliverableSummary.approved,
    assetsNeedingChanges: deliverableSummary.changesRequested,
    assetsAwaitingDecision: deliverableSummary.pending,
  };

  return {
    campaign,
    stageItems,
    prioritizedAngles,
    deliverableSummary,
    reviewReadiness,
    reviewDeadline: buildReviewDeadlineContext(
      campaign.currentStage,
      deliverableSummary.changesRequested,
    ),
    packageRecommendation: buildPackageRecommendation(
      campaign.packageTier,
      template?.nextAction.body ?? null,
    ),
    latestAssets: orderedAssets.slice(0, 5).map((asset) => ({
      ...asset,
      threadCount: threadCountMap.get(asset.id) ?? 0,
    })),
  };
}
