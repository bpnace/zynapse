import {
  assertSupabaseResult,
  mapCampaign,
  mapOrganization,
  mapPilotRequest,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

type GetPilotRequestViewParams = {
  organizationId: string;
  campaignId?: string | null;
};

export async function getPilotRequestView({
  organizationId,
  campaignId,
}: GetPilotRequestViewParams) {
  const supabase = requireServiceRoleClient();

  const { data: organizationRow, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(organizationError, "Failed to load organization");

  const organization = organizationRow ? mapOrganization(organizationRow) : null;

  if (!organization) {
    return null;
  }

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(campaignError, "Failed to load campaigns");

  const campaignsInOrg = (campaignRows ?? []).map(mapCampaign);

  const selectedCampaign =
    campaignsInOrg.find((campaign) => campaign.id === campaignId) ??
    campaignsInOrg[0] ??
    null;

  const latestRequest = selectedCampaign
    ? await supabase
        .from("pilot_requests")
        .select("*")
        .eq("campaign_id", selectedCampaign.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data, error }) => {
          assertSupabaseResult(error, "Failed to load pilot requests");
          return data ? mapPilotRequest(data) : null;
        })
    : null;

  return {
    organization,
    campaigns: campaignsInOrg,
    selectedCampaign,
    latestRequest,
  };
}
