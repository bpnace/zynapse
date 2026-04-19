import { notFound } from "next/navigation";
import { CreativeCampaignRoom } from "@/components/workspace/creative/creative-campaign-room";
import { requireCreativeWorkspaceAccess } from "@/lib/auth/guards";
import { getCreativeCampaignView } from "@/lib/workspace/queries/get-creative-campaign-view";

export const dynamic = "force-dynamic";

type CreativeCampaignPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function CreativeCampaignPage({ params }: CreativeCampaignPageProps) {
  const { campaignId } = await params;
  const bootstrap = await requireCreativeWorkspaceAccess();
  const view = await getCreativeCampaignView({
    organizationId: bootstrap.organization.id,
    campaignId,
    userId: bootstrap.membership.userId,
  });

  if (!view) {
    notFound();
  }

  return (
    <CreativeCampaignRoom
      campaign={view.campaign}
      assignment={view.assignment}
      tasks={view.tasks}
      revisions={view.revisions.filter((item) => item.status !== "resolved")}
      assets={view.assets}
    />
  );
}
