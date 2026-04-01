import { WorkspaceShell } from "@/components/workspace/shell/workspace-shell";
import { requireWorkspaceAccess } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireWorkspaceAccess();

  return (
    <WorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
      website={bootstrap.brandProfile?.website ?? null}
    >
      {children}
    </WorkspaceShell>
  );
}
