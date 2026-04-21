import { CreativeCampaignIndex } from "@/components/workspace/creative/creative-campaign-index";
import { requireCreativeWorkspaceAccess } from "@/lib/auth/guards";
import { getCreativeTasksView } from "@/lib/workspace/queries/get-creative-tasks-view";

export const dynamic = "force-dynamic";

export default async function CreativeCampaignsPage() {
  const bootstrap = await requireCreativeWorkspaceAccess();
  const view = await getCreativeTasksView({
    organizationId: bootstrap.organization.id,
    userId: bootstrap.membership.userId,
  });

  return <CreativeCampaignIndex assignments={view.assignments} summary={view.summary} />;
}
