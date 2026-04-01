import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets } from "@/lib/db/schema/assets";
import { brandProfiles } from "@/lib/db/schema/brand-profiles";
import { campaignStages } from "@/lib/db/schema/campaign-stages";
import { campaigns } from "@/lib/db/schema/campaigns";
import { comments } from "@/lib/db/schema/comments";
import { invites } from "@/lib/db/schema/invites";
import { organizations } from "@/lib/db/schema/organizations";
import { reviewThreads } from "@/lib/db/schema/review-threads";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

export async function bootstrapWorkspaceForOrganization(organizationId: string) {
  const db = getDb();

  return db.transaction(async (tx) => {
    const existingCampaign = await tx
      .select()
      .from(campaigns)
      .where(eq(campaigns.organizationId, organizationId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (existingCampaign) {
      return existingCampaign;
    }

    const organization = await tx
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!organization) {
      throw new Error("Cannot bootstrap workspace without organization.");
    }

    const sourceInvite = await tx
      .select()
      .from(invites)
      .where(eq(invites.organizationId, organizationId))
      .orderBy(desc(invites.acceptedAt), desc(invites.expiresAt))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    const template = getSeedTemplate(sourceInvite?.seedTemplateKey);

    await tx
      .update(organizations)
      .set({
        status: "active",
      })
      .where(eq(organizations.id, organizationId));

    const existingBrandProfile = await tx
      .select()
      .from(brandProfiles)
      .where(eq(brandProfiles.organizationId, organizationId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    if (!existingBrandProfile) {
      await tx.insert(brandProfiles).values({
        organizationId,
        website: `https://${organization.slug}.example.com`,
        offerSummary: template.brandProfile.offerSummary,
        targetAudience: template.brandProfile.targetAudience,
        primaryChannels: template.brandProfile.primaryChannels,
        brandTone: template.brandProfile.brandTone,
        reviewNotes: template.brandProfile.reviewNotes,
        claimGuardrails: template.brandProfile.claimGuardrails,
      });
    }

    const [campaign] = await tx
      .insert(campaigns)
      .values({
        organizationId,
        name: template.campaignName,
        currentStage: template.currentStage,
        packageTier: template.packageTier,
        seededTemplateKey: template.key,
        campaignGoal: template.campaignGoal,
      })
      .returning();

    await tx.insert(campaignStages).values(
      template.stageDefinitions.map((stage, index) => ({
        campaignId: campaign.id,
        stageKey: stage.key,
        stageOrder: index + 1,
        status: stage.status,
        startedAt:
          stage.status === "completed" || stage.status === "in_progress"
            ? new Date()
            : null,
        completedAt: stage.status === "completed" ? new Date() : null,
      })),
    );

    const insertedAssets = await tx
      .insert(assets)
      .values(
        template.assets.map((asset) => ({
          campaignId: campaign.id,
          assetScope: "output" as const,
          assetType: asset.assetType,
          title: asset.title,
          format: asset.format,
          durationSeconds: asset.durationSeconds ?? null,
          storagePath: asset.storagePath,
          thumbnailPath: asset.thumbnailPath,
          source: asset.source,
          versionLabel: asset.versionLabel,
          reviewStatus: asset.reviewStatus,
        })),
      )
      .returning();

    const assetMap = new Map(
      template.assets.map((asset, index) => [asset.key, insertedAssets[index]]),
    );

    for (const thread of template.reviewThreads) {
      const asset = assetMap.get(thread.assetKey);

      if (!asset) {
        continue;
      }

      const [insertedThread] = await tx
        .insert(reviewThreads)
        .values({
          assetId: asset.id,
          createdBy: thread.createdBy,
          anchorJson: thread.anchorJson,
        })
        .returning();

      await tx.insert(comments).values(
        thread.comments.map((comment) => ({
          threadId: insertedThread.id,
          authorId: comment.authorId,
          body: comment.body,
          commentType: comment.commentType,
        })),
      );
    }

    return campaign;
  });
}
