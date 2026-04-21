import { AdminWorkspaceShell } from "@/components/workspace/admin/admin-workspace-shell";
import { requireAdminAccess } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireAdminAccess();

  return (
    <AdminWorkspaceShell
      organizationName={bootstrap.organization.name}
      role={bootstrap.membership.role}
    >
      {children}
    </AdminWorkspaceShell>
  );
}
