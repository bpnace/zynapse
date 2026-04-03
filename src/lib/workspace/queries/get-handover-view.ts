import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import { campaignStages } from "@/lib/db/schema/campaign-stages";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

type GetHandoverViewParams = {
  organizationId: string;
  campaignId: string;
};

function groupAssetLabel(assetType: string) {
  if (assetType.includes("video")) {
    return "Video-Deliverables";
  }

  return "Statische Deliverables";
}

function buildUsageSummary(currentStage: string) {
  if (currentStage === "approved" || currentStage === "handover_ready") {
    return {
      heading: "Für die Übergabe freigegeben",
      body:
        "Diese freigegebenen Assets stehen für das, was der Buyer am Ende des aktuellen Seed-Workflows erhalten würde. Rechte und Nutzung werden in diesem Schritt als Lieferhinweise dargestellt, nicht als juristische Automatisierung.",
    };
  }

  return {
    heading: "Lieferhinweise in Arbeit",
    body:
      "Die Übergabeansicht ist bereit, freigegebene Outputs zu zeigen. Die Seed-Kampagne hängt aber noch vom finalen Review ab, bevor daraus ein abgeschlossenes Deliverable-Paket wird.",
  };
}

export async function getHandoverView({
  organizationId,
  campaignId,
}: GetHandoverViewParams) {
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

  const [stageItems, campaignAssets] = await Promise.all([
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
  ]);

  const template = campaign.seededTemplateKey
    ? getSeedTemplate(campaign.seededTemplateKey)
    : null;

  const approvedAssets = campaignAssets.filter((asset) => asset.reviewStatus === "approved");

  const groupedAssets = Array.from(
    approvedAssets.reduce((map, asset) => {
      const key = groupAssetLabel(asset.assetType);
      const existing = map.get(key) ?? [];
      existing.push(asset);
      map.set(key, existing);
      return map;
    }, new Map<string, typeof approvedAssets>()),
  ).map(([label, items]) => ({
    label,
    items,
  }));

  return {
    campaign,
    stageItems,
    approvedAssets,
    groupedAssets,
    usageSummary: buildUsageSummary(campaign.currentStage),
    campaignNotes: template?.preparedBlocks.output ?? null,
    nextStep: template?.nextAction.body ?? template?.preparedBlocks.nextStep ?? null,
  };
}
