"use client";

import { usePathname } from "next/navigation";
import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isWorkspaceRoute = brandsWorkspaceRoutes.isKnownPath(pathname);

  if (isWorkspaceRoute) {
    return <main>{children}</main>;
  }

  return (
    <div className="relative">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <BackToTopButton />
    </div>
  );
}
