"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  Gauge,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWorkspaceRole } from "@/lib/workspace/formatting";
import { opsWorkspaceRoutes } from "@/lib/workspace/routes";

type OpsWorkspaceShellProps = {
  organizationName: string;
  role: string;
  children: React.ReactNode;
};

export function OpsWorkspaceShell({
  organizationName,
  role,
  children,
}: OpsWorkspaceShellProps) {
  const pathname = usePathname();
  const navigation = [
    {
      href: opsWorkspaceRoutes.overview(),
      label: "Overview",
      helper: "Control plane, queues, audit",
      icon: Gauge,
      active: pathname === opsWorkspaceRoutes.overview(),
    },
    {
      href: opsWorkspaceRoutes.campaigns(),
      label: "Campaigns",
      helper: "Workflow owners and current state",
      icon: FolderKanban,
      active:
        pathname === opsWorkspaceRoutes.campaigns() ||
        pathname.startsWith(`${opsWorkspaceRoutes.campaigns()}/`),
    },
    {
      href: opsWorkspaceRoutes.assignments(),
      label: "Assignments",
      helper: "Creative staffing and due dates",
      icon: BriefcaseBusiness,
      active: pathname === opsWorkspaceRoutes.assignments(),
    },
    {
      href: opsWorkspaceRoutes.reviewReadiness(),
      label: "Review readiness",
      helper: "Submissions, blockers, revision debt",
      icon: ShieldCheck,
      active: pathname === opsWorkspaceRoutes.reviewReadiness(),
    },
    {
      href: opsWorkspaceRoutes.commercialHandoffs(),
      label: "Commercial handoffs",
      helper: "Delivery / pilot transition visibility",
      icon: ArrowUpRight,
      active: pathname === opsWorkspaceRoutes.commercialHandoffs(),
    },
  ];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1760px]">
        <aside className="workspace-sidebar hidden w-[280px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <p className="workspace-eyebrow">Ops Control Plane</p>
            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <p className="text-sm text-[var(--workspace-copy-muted)]">{formatWorkspaceRole(role)}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Assign creatives, tighten review readiness, and move delivery/commercial
              transitions forward without leaking internal mechanics into /brands or /creatives.
            </p>
          </div>

          <div className="mt-6">
            <p className="workspace-section-label">Orchestration</p>
          </div>
          <nav className="mt-3 space-y-1" aria-label="Navigation im Ops Workspace">
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
            <p className="workspace-section-label">Guardrail</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Ops owns transitions and workload. Brand and creative surfaces consume the resulting
              state, but they do not replace this control plane.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-1">
              <p className="workspace-eyebrow">Ops Workspace</p>
              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <div className="workspace-meta-row">
                <span>{formatWorkspaceRole(role)}</span>
                <span className="inline-flex items-center gap-1">
                  <Workflow className="h-3.5 w-3.5" />
                  Control plane
                </span>
              </div>
            </div>
          </div>

          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
