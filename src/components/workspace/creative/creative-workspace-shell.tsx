"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutGrid, MessageSquareMore, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeWorkspaceShellProps = {
  organizationName: string;
  displayName: string;
  headline?: string | null;
  children: React.ReactNode;
};

export function CreativeWorkspaceShell({
  organizationName,
  displayName,
  headline,
  children,
}: CreativeWorkspaceShellProps) {
  const pathname = usePathname();
  const navigation = [
    {
      href: creativeWorkspaceRoutes.tasks(),
      label: "Today / Queue",
      helper: "Heute fällige Arbeit und Fokus",
      icon: LayoutGrid,
      active: pathname === creativeWorkspaceRoutes.tasks(),
    },
    {
      href: creativeWorkspaceRoutes.tasks(),
      label: "Assigned campaigns",
      helper: "Task rooms und aktive Delivery-Sprints",
      icon: FolderKanban,
      active: pathname.startsWith("/creatives/campaigns/"),
    },
    {
      href: creativeWorkspaceRoutes.feedback(),
      label: "Feedback",
      helper: "Revisionen und offene Rückfragen",
      icon: MessageSquareMore,
      active: pathname === creativeWorkspaceRoutes.feedback(),
    },
  ];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="workspace-sidebar hidden w-[264px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <p className="workspace-eyebrow">Creatives Workspace</p>
            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {displayName}
              </p>
              <p className="text-sm text-[var(--workspace-copy-muted)]">{organizationName}</p>
            </div>
            {headline ? (
              <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                {headline}
              </p>
            ) : null}
          </div>

          <div className="mt-6">
            <p className="workspace-section-label">Execution</p>
          </div>
          <nav className="mt-3 space-y-1" aria-label="Navigation im Creatives Workspace">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "workspace-nav-item",
                    item.active ? "workspace-nav-item-active" : "workspace-nav-item-muted",
                  )}
                >
                  <span className="workspace-nav-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="space-y-0.5 min-w-0">
                    <span className="block text-sm font-semibold tracking-[-0.01em]">
                      {item.label}
                    </span>
                    <span className="block text-xs text-[var(--workspace-copy-muted)]">
                      {item.helper}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[var(--workspace-line)] pt-4">
            <p className="workspace-section-label">Managed-service guardrail</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Du arbeitest innerhalb eines kuratierten Delivery-Flows. Brands sehen
              Entscheidungen und Outcomes — nicht interne Produktionsmechanik.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-1">
              <p className="workspace-eyebrow">Creatives Workspace</p>
              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                {displayName}
              </p>
              <div className="workspace-meta-row">
                <span>{organizationName}</span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Delivery lane
                </span>
              </div>
            </div>
          </div>
          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
