import { OpsWorkspaceShell } from "@/components/workspace/ops/ops-workspace-shell";
import { requireAdminAccess } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireAdminAccess();

  return (
    <OpsWorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
    >
      {children}
    </OpsWorkspaceShell>
  );
}
