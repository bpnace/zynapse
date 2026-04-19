import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapCampaignAssignment,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

type GetCreativeFeedbackViewParams = {
  organizationId: string;
  userId: string;
};

export async function getCreativeFeedbackView({
  organizationId,
  userId,
}: GetCreativeFeedbackViewParams) {
  const supabase = requireServiceRoleClient();

  const { data: assignmentRows, error: assignmentError } = await supabase
    .from("campaign_assignments")
    .select("*")
    .eq("user_id", userId);

  assertSupabaseResult(assignmentError, "Failed to load creative assignments");
  const assignments = new Map((assignmentRows ?? []).map((row) => {
    const assignment = mapCampaignAssignment(row);
    return [assignment.id, assignment] as const;
  }));
  const assignmentIds = Array.from(assignments.keys());

  const [{ data: campaignRows, error: campaignError }, { data: revisionRows, error: revisionError }, { data: assetRows, error: assetError }] =
    await Promise.all([
      supabase.from("campaigns").select("*").eq("organization_id", organizationId),
      assignmentIds.length > 0
        ? supabase.from("revision_items").select("*").in("assignment_id", assignmentIds)
        : supabase.from("revision_items").select("*").limit(0),
      supabase.from("assets").select("*"),
    ]);

  assertSupabaseResult(campaignError, "Failed to load creative campaigns");
  assertSupabaseResult(revisionError, "Failed to load revision queue");
  assertSupabaseResult(assetError, "Failed to load asset context");

  const campaigns = new Map((campaignRows ?? []).map((row) => {
    const campaign = mapCampaign(row);
    return [campaign.id, campaign] as const;
  }));
  const assets = new Map((assetRows ?? []).map((row) => {
    const asset = mapAsset(row);
    return [asset.id, asset] as const;
  }));

  return {
    revisions: (revisionRows ?? [])
      .map(mapRevisionItem)
      .filter((item) => item.status !== "resolved")
      .map((item) => ({
        ...item,
        assignment: item.assignmentId ? assignments.get(item.assignmentId) ?? null : null,
        campaign: campaigns.get(item.campaignId) ?? null,
        asset: item.assetId ? assets.get(item.assetId) ?? null : null,
      }))
      .filter((item) => item.campaign),
  };
}
