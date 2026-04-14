import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapCampaignStage,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { decorateWorkspaceAssetMedia } from "@/lib/workspace/media";
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

  const [stageItems, campaignAssets] = await Promise.all([
    supabase
      .from("campaign_stages")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("stage_order", { ascending: true })
      .then(({ data, error }) => {
        assertSupabaseResult(error, "Failed to load campaign stages");
        return (data ?? []).map(mapCampaignStage);
      }),
    supabase
      .from("assets")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        assertSupabaseResult(error, "Failed to load campaign assets");
        return (data ?? []).map(mapAsset).map(decorateWorkspaceAssetMedia);
      }),
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
