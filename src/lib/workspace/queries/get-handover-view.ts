import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapCampaignStage,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { decorateWorkspaceAssetMedia } from "@/lib/workspace/media";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

type GetHandoverViewParams = {
  organizationId: string;
  campaignId: string;
};

function groupAssetLabel(assetType: string) {
  if (assetType.includes("video")) {
    return "Videoformate";
  }

  return "Statische Motive";
}

function buildUsageSummary(currentStage: string) {
  if (currentStage === "approved" || currentStage === "handover_ready") {
    return {
      heading: "Für die Übergabe freigegeben",
      body:
        "Diese freigegebenen Varianten stehen für das, was der Käufer am Ende des aktuellen Demo-Ablaufs erhalten würde. Rechte und Nutzung werden in diesem Schritt als Lieferhinweise dargestellt, nicht als juristische Automatisierung.",
    };
  }

  return {
    heading: "Lieferhinweise in Arbeit",
      body:
      "Die Übergabeansicht ist bereit, freigegebene Varianten zu zeigen. Die vorbereitete Kampagne hängt aber noch von der finalen Freigabe ab, bevor daraus ein abgeschlossenes Übergabepaket wird.",
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
  const campaignAssetIds = campaignAssets.map((asset) => asset.id);
  const unresolvedReviewCount =
    campaignAssetIds.length > 0
      ? await supabase
          .from("review_threads")
          .select("id", { count: "exact", head: true })
          .in("asset_id", campaignAssetIds)
          .is("resolved_at", null)
          .then(({ count, error }) => {
            assertSupabaseResult(error, "Failed to load unresolved review threads");
            return count ?? 0;
          })
      : 0;

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
    readiness: getBrandWorkspaceReadiness({
      stageItems,
      latestAssets: campaignAssets,
      openReviewCount: unresolvedReviewCount,
    }),
    approvedAssets,
    groupedAssets,
    usageSummary: buildUsageSummary(campaign.currentStage),
    campaignNotes: template?.preparedBlocks.output ?? null,
    nextStep: template?.nextAction.body ?? template?.preparedBlocks.nextStep ?? null,
  };
}
