import { OpsWorkspaceShell } from "@/components/workspace/ops/ops-workspace-shell";
import { requireOpsWorkspaceAccess } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function OpsWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireOpsWorkspaceAccess();

  return (
    <OpsWorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
    >
      {children}
    </OpsWorkspaceShell>
  );
}
