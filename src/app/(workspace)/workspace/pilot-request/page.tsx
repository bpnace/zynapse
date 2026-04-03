import { PilotRequestFlow } from "@/components/workspace/pilot/pilot-request-flow";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getPilotRequestView } from "@/lib/workspace/queries/get-pilot-request-view";

export const dynamic = "force-dynamic";

type PilotRequestPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PilotRequestPage({
  searchParams,
}: PilotRequestPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const query = (await searchParams) ?? {};
  const campaignId =
    typeof query.campaignId === "string" && query.campaignId.length > 0
      ? query.campaignId
      : null;

  const pilotRequestView = await getPilotRequestView({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!pilotRequestView) {
    return null;
  }

  return (
    <PilotRequestFlow
      organizationName={pilotRequestView.organization.name}
      campaign={
        pilotRequestView.selectedCampaign
          ? {
              id: pilotRequestView.selectedCampaign.id,
              name: pilotRequestView.selectedCampaign.name,
              packageTier: pilotRequestView.selectedCampaign.packageTier,
              currentStage: pilotRequestView.selectedCampaign.currentStage,
            }
          : null
      }
      campaigns={pilotRequestView.campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        packageTier: campaign.packageTier,
        currentStage: campaign.currentStage,
      }))}
      latestRequest={
        pilotRequestView.latestRequest
          ? {
              desiredTier: pilotRequestView.latestRequest.desiredTier,
              startWindow: pilotRequestView.latestRequest.startWindow,
              internalStakeholders:
                pilotRequestView.latestRequest.internalStakeholders,
              message: pilotRequestView.latestRequest.message,
              status: pilotRequestView.latestRequest.status,
              handoffMode: pilotRequestView.latestRequest.handoffMode,
              submittedAt: pilotRequestView.latestRequest.submittedAt,
            }
          : null
      }
      initialValues={{
        desiredTier:
          pilotRequestView.selectedCampaign?.packageTier ?? "Starter",
        startWindow: "Innerhalb der nächsten 30 Tage",
        internalStakeholders: "",
        message: pilotRequestView.selectedCampaign
          ? `Wir möchten ${pilotRequestView.selectedCampaign.name} in einen bezahlten Piloten überführen.`
          : "",
      }}
    />
  );
}
