import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { buildMetadata } from "@/lib/seo";
import { getDashboardView } from "@/lib/workspace/queries/get-dashboard-view";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Workspace | Zynapse",
  description: "Geschützter Zynapse Workspace für eingeladene Teams.",
  path: "/workspace",
  indexable: false,
});

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireWorkspaceAccess();
  const dashboard = await getDashboardView(bootstrap.organization.id);

  return (
    <WorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
      website={bootstrap.brandProfile?.website ?? null}
      activeCampaignId={dashboard.latestCampaign?.id ?? null}
    >
      {children}
    </WorkspaceShell>
  );
}
