import { CreativeWorkspaceShell } from "@/components/workspace/creative/creative-workspace-shell";
import { requireCreativeWorkspaceAccess } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function CreativeWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await requireCreativeWorkspaceAccess();

  return (
    <CreativeWorkspaceShell
      organizationName={bootstrap.organization.name}
      displayName={bootstrap.creativeProfile?.displayName ?? "Creative Partner"}
      headline={bootstrap.creativeProfile?.headline ?? null}
    >
      {children}
    </CreativeWorkspaceShell>
  );
}
