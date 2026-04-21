import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/workspace/campaign/campaign-detail";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getCampaignDetailView } from "@/lib/workspace/queries/get-campaign-detail-view";

export const dynamic = "force-dynamic";

type CampaignPageProps = {
  params: Promise<{ campaignId: string }>;
};

export default async function CampaignPage({ params }: CampaignPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { campaignId } = await params;

  const campaignDetail = await getCampaignDetailView({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!campaignDetail) {
    notFound();
  }

  return (
    <CampaignDetail
      campaign={campaignDetail.campaign}
      stageItems={campaignDetail.stageItems}
      prioritizedAngles={campaignDetail.prioritizedAngles}
      deliverableSummary={campaignDetail.deliverableSummary}
      reviewReadiness={campaignDetail.reviewReadiness}
      reviewDeadline={campaignDetail.reviewDeadline}
      packageRecommendation={campaignDetail.packageRecommendation}
      latestAssets={campaignDetail.latestAssets}
      demo={bootstrap.demo}
    />
  );
}
