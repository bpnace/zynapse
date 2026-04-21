import { notFound } from "next/navigation";
import { SetupProposalScreen } from "@/components/workspace/campaign/setup-proposal-screen";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getBriefView } from "@/lib/workspace/queries/get-brief-view";
import { getCampaignDetailView } from "@/lib/workspace/queries/get-campaign-detail-view";

export const dynamic = "force-dynamic";

type CampaignSetupPageProps = {
  params: Promise<{ campaignId: string }>;
};

export default async function CampaignSetupPage({
  params,
}: CampaignSetupPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { campaignId } = await params;

  const campaignDetail = await getCampaignDetailView({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!campaignDetail) {
    notFound();
  }

  const briefView = campaignDetail.campaign.briefId
    ? await getBriefView(bootstrap.organization.id, campaignDetail.campaign.briefId)
    : null;

  return (
    <SetupProposalScreen
      campaign={campaignDetail.campaign}
      proposal={campaignDetail.packageRecommendation}
      stageItems={campaignDetail.stageItems}
      brief={briefView?.values ?? null}
    />
  );
}
