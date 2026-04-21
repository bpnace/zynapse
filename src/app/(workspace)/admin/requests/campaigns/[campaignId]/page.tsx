import { notFound } from "next/navigation";
import { AdminCampaignDetailScreen } from "@/components/workspace/admin/admin-campaign-detail-screen";
import { requireAdminAccess } from "@/lib/auth/guards";
import { getOpsCampaignDetail } from "@/lib/workspace/queries/get-ops-campaign-detail";

export const dynamic = "force-dynamic";

type AdminCampaignDetailPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function AdminCampaignDetailPage({
  params,
}: AdminCampaignDetailPageProps) {
  const bootstrap = await requireAdminAccess();
  const { campaignId } = await params;
  const view = await getOpsCampaignDetail({
    organizationId: bootstrap.organization.id,
    campaignId,
  });

  if (!view) {
    notFound();
  }

  return <AdminCampaignDetailScreen view={view} />;
}
