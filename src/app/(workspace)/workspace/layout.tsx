import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireWorkspaceAccess();
  const dashboard = await getDashboardView(bootstrap.organization.id);
  const readiness = getBrandWorkspaceReadiness({
    stageItems: dashboard.stageItems,
    latestAssets: dashboard.latestAssets,
    openReviewCount: dashboard.reviewThreadCount,
  });

  return (
    <WorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
      website={bootstrap.brandProfile?.website ?? null}
      activeCampaignId={dashboard.latestCampaign?.id ?? null}
      demo={bootstrap.demo}
      showCommercialStep={readiness.showCommercialStep}
    >
      {children}
    </WorkspaceShell>
  );
}
