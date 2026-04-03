import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { campaigns } from "@/lib/db/schema/campaigns";
import { organizations } from "@/lib/db/schema/organizations";
import { pilotRequests } from "@/lib/db/schema/pilot-requests";

type GetPilotRequestViewParams = {
  organizationId: string;
  campaignId?: string | null;
};

export async function getPilotRequestView({
  organizationId,
  campaignId,
}: GetPilotRequestViewParams) {
  const db = getDb();

  const organization = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!organization) {
    return null;
  }

  const campaignsInOrg = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.organizationId, organizationId))
    .orderBy(desc(campaigns.createdAt));

  const selectedCampaign =
    campaignsInOrg.find((campaign) => campaign.id === campaignId) ??
    campaignsInOrg[0] ??
    null;

  const latestRequest = selectedCampaign
    ? await db
        .select()
        .from(pilotRequests)
        .where(eq(pilotRequests.campaignId, selectedCampaign.id))
        .orderBy(desc(pilotRequests.submittedAt))
        .limit(1)
        .then((rows) => rows[0] ?? null)
    : null;

  return {
    organization,
    campaigns: campaignsInOrg,
    selectedCampaign,
    latestRequest,
  };
}
