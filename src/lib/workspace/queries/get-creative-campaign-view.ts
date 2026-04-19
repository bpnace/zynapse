import { decorateWorkspaceAssetMedia } from "@/lib/workspace/media";
import {
  assertSupabaseResult,
  mapAsset,
  mapAssetVersion,
  mapCampaign,
  mapCampaignAssignment,
  mapCreativeTask,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

type GetCreativeCampaignViewParams = {
  organizationId: string;
  campaignId: string;
  userId: string;
};

export async function getCreativeCampaignView({
  organizationId,
  campaignId,
  userId,
}: GetCreativeCampaignViewParams) {
  const supabase = requireServiceRoleClient();

  const [{ data: campaignRow, error: campaignError }, { data: assignmentRow, error: assignmentError }, { data: taskRows, error: taskError }, { data: assetRows, error: assetError }, { data: versionRows, error: versionError }, { data: revisionRows, error: revisionError }] =
    await Promise.all([
      supabase.from("campaigns").select("*").eq("id", campaignId).limit(1).maybeSingle(),
      supabase
        .from("campaign_assignments")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle(),
      supabase.from("creative_tasks").select("*").eq("campaign_id", campaignId).eq("owner_user_id", userId),
      supabase.from("assets").select("*").eq("campaign_id", campaignId).order("created_at", { ascending: false }),
      supabase.from("asset_versions").select("*").eq("campaign_id", campaignId).order("created_at", { ascending: false }),
      supabase.from("revision_items").select("*").eq("campaign_id", campaignId).order("created_at", { ascending: false }),
    ]);

  assertSupabaseResult(campaignError, "Failed to load creative campaign");
  assertSupabaseResult(assignmentError, "Failed to load campaign assignment");
  assertSupabaseResult(taskError, "Failed to load creative tasks");
  assertSupabaseResult(assetError, "Failed to load campaign assets");
  assertSupabaseResult(versionError, "Failed to load asset versions");
  assertSupabaseResult(revisionError, "Failed to load revision items");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;
  const assignment = assignmentRow ? mapCampaignAssignment(assignmentRow) : null;

  if (!campaign || campaign.organizationId !== organizationId || !assignment) {
    return null;
  }

  const assets = (assetRows ?? []).map(mapAsset).map(decorateWorkspaceAssetMedia);
  const tasks = (taskRows ?? []).map(mapCreativeTask);
  const revisions = (revisionRows ?? []).map(mapRevisionItem);
  const versionsByAssetId = new Map<string, ReturnType<typeof mapAssetVersion>[]>();

  for (const versionRow of versionRows ?? []) {
    const version = mapAssetVersion(versionRow);
    const bucket = versionsByAssetId.get(version.assetId) ?? [];
    bucket.push(version);
    versionsByAssetId.set(version.assetId, bucket);
  }

  return {
    campaign,
    assignment,
    tasks,
    revisions,
    assets: assets.map((asset) => ({
      ...asset,
      versions: versionsByAssetId.get(asset.id) ?? [],
      linkedTasks: tasks.filter((task) => task.assetId === asset.id),
      openRevisions: revisions.filter(
        (revision) => revision.assetId === asset.id && revision.status !== "resolved",
      ),
    })),
  };
}
