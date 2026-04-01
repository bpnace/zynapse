import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets } from "@/lib/db/schema/assets";
import { brandProfiles } from "@/lib/db/schema/brand-profiles";
import { campaigns } from "@/lib/db/schema/campaigns";
import { campaignStages } from "@/lib/db/schema/campaign-stages";
import { comments } from "@/lib/db/schema/comments";
import { reviewThreads } from "@/lib/db/schema/review-threads";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

export async function getDashboardView(organizationId: string) {
  const db = getDb();

  const organizationCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.organizationId, organizationId))
    .orderBy(desc(campaigns.createdAt));

  const latestCampaign = organizationCampaigns[0] ?? null;

  const profile = await db
    .select()
    .from(brandProfiles)
    .where(eq(brandProfiles.organizationId, organizationId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  const stageItems = latestCampaign
    ? await db
        .select()
        .from(campaignStages)
        .where(eq(campaignStages.campaignId, latestCampaign.id))
        .orderBy(campaignStages.stageOrder)
    : [];

  const latestAssets = latestCampaign
    ? await db
        .select()
        .from(assets)
        .where(eq(assets.campaignId, latestCampaign.id))
        .orderBy(desc(assets.createdAt))
    : [];

  const threadPreview = latestCampaign
    ? await db
        .select({
          threadId: reviewThreads.id,
          assetId: reviewThreads.assetId,
          assetTitle: assets.title,
          createdBy: reviewThreads.createdBy,
          anchorJson: reviewThreads.anchorJson,
          commentBody: comments.body,
          commentType: comments.commentType,
          commentCreatedAt: comments.createdAt,
        })
        .from(reviewThreads)
        .innerJoin(assets, eq(reviewThreads.assetId, assets.id))
        .innerJoin(comments, eq(comments.threadId, reviewThreads.id))
        .where(eq(assets.campaignId, latestCampaign.id))
        .orderBy(desc(comments.createdAt))
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
    reviewThreads: Array.from(reviewThreadsById.values()).slice(0, 3),
    template,
  };
}
