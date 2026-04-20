import { notFound } from "next/navigation";
import { OpsCampaignDetailScreen } from "@/components/workspace/ops/ops-campaign-detail-screen";
import { requireOpsWorkspaceAccess } from "@/lib/auth/guards";
import { getOpsCampaignDetail } from "@/lib/workspace/queries/get-ops-campaign-detail";

export const dynamic = "force-dynamic";

type OpsCampaignDetailPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function OpsCampaignDetailPage({
  params,
}: OpsCampaignDetailPageProps) {
  const bootstrap = await requireOpsWorkspaceAccess();
  const { campaignId } = await params;
  const view = await getOpsCampaignDetail({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!view) {
    notFound();
  }

  return <OpsCampaignDetailScreen view={view} />;
}
