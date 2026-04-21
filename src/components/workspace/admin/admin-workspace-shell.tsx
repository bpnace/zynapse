"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FolderKanban,
  GitCompareArrows,
  ListChecks,
  Radar,
  Settings2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWorkspaceRole } from "@/lib/workspace/formatting";
import { adminWorkspaceRoutes, opsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  WorkspaceAvatarSlot,
  WorkspaceIdentityActions,
  WorkspaceLogoLockup,
} from "@/components/workspace/shell/workspace-shell-primitives";

type AdminWorkspaceShellProps = {
  organizationName: string;
  role: string;
  children: React.ReactNode;
};

type NavigationItem = {
  href: string;
  label: string;
  helper: string;
  icon: typeof ClipboardList;
  active: boolean;
};

function isAnyPath(pathname: string, candidates: string[]) {
  return candidates.some(
    (candidate) => pathname === candidate || pathname.startsWith(`${candidate}/`),
  );
}

function AdminNav({
  items,
}: {
  items: NavigationItem[];
}) {
  return (
    <nav className="mt-3 space-y-1" aria-label="Navigation im Admin Workspace">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "workspace-nav-item",
              item.active ? "workspace-nav-item-active" : "workspace-nav-item-muted",
            )}
          >
            <span className="workspace-nav-icon">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 space-y-0.5">
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
  );
}

export function AdminWorkspaceShell({
  organizationName,
  role,
  children,
}: AdminWorkspaceShellProps) {
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    {
      href: adminWorkspaceRoutes.requests(),
      label: "Requests",
      helper: "Incoming campaign demand and intake",
      icon: ClipboardList,
      active:
        pathname === adminWorkspaceRoutes.root() ||
        pathname === adminWorkspaceRoutes.requests() ||
        pathname.startsWith(`${adminWorkspaceRoutes.requests()}/`) ||
        pathname === opsWorkspaceRoutes.overview() ||
        pathname === opsWorkspaceRoutes.campaigns() ||
        pathname.startsWith(`${opsWorkspaceRoutes.campaigns()}/`),
    },
    {
      href: adminWorkspaceRoutes.setups(),
      label: "Setups",
      helper: "Packaging and approval staging",
      icon: FolderKanban,
      active: pathname === adminWorkspaceRoutes.setups(),
    },
    {
      href: adminWorkspaceRoutes.matching(),
      label: "Matching",
      helper: "Creative fit and routing decisions",
      icon: GitCompareArrows,
      active: pathname === adminWorkspaceRoutes.matching(),
    },
    {
      href: adminWorkspaceRoutes.assignments(),
      label: "Assignments",
      helper: "Ownership, staffing, deadlines",
      icon: ListChecks,
      active: isAnyPath(pathname, [
        adminWorkspaceRoutes.assignments(),
        "/ops/assignments",
      ]),
    },
    {
      href: adminWorkspaceRoutes.reviews(),
      label: "Reviews",
      helper: "Readiness, approvals, change pressure",
      icon: ShieldCheck,
      active: isAnyPath(pathname, [
        adminWorkspaceRoutes.reviews(),
        "/ops/review-readiness",
      ]),
    },
    {
      href: adminWorkspaceRoutes.delivery(),
      label: "Delivery",
      helper: "Output movement and handoff state",
      icon: Radar,
      active: isAnyPath(pathname, [
        adminWorkspaceRoutes.delivery(),
        "/ops/delivery",
        "/ops/commercial-handoffs",
      ]),
    },
    {
      href: adminWorkspaceRoutes.exceptions(),
      label: "Exceptions",
      helper: "Low-confidence or blocked cases",
      icon: ShieldAlert,
      active: isAnyPath(pathname, [
        adminWorkspaceRoutes.exceptions(),
        "/ops/commercial",
      ]),
    },
    {
      href: adminWorkspaceRoutes.audit(),
      label: "Audit",
      helper: "Operational history and traceability",
      icon: Settings2,
      active: isAnyPath(pathname, [adminWorkspaceRoutes.audit(), adminWorkspaceRoutes.settings()]),
    },
  ];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1760px]">
        <aside className="workspace-sidebar hidden w-[300px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <div className="flex items-start justify-between gap-4">
              <WorkspaceLogoLockup label="Zynapse Admin Panel" />
              <WorkspaceAvatarSlot name={organizationName} />
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-base font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <p className="text-sm text-[var(--workspace-copy-muted)]">{formatWorkspaceRole(role)}</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              A practical internal panel for overrides, QA, delivery blockers, content issues, and
              exceptional cases while the ops layer continues to live behind the scenes.
            </p>

            <div className="mt-4 workspace-meta-row">
              <span>Admin</span>
              <span>Internal only</span>
            </div>

            <div className="mt-5">
              <WorkspaceIdentityActions settingsHref={adminWorkspaceRoutes.settings()} />
            </div>
          </div>

          <div className="mt-6">
            <p className="workspace-section-label">Queues</p>
          </div>
          <AdminNav items={navigation} />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <WorkspaceLogoLockup label="Zynapse Admin Panel" />
                  <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                    {organizationName}
                  </p>
                  <div className="workspace-meta-row">
                    <span>{formatWorkspaceRole(role)}</span>
                    <span>Admin</span>
                  </div>
                </div>
                <WorkspaceAvatarSlot name={organizationName} className="mt-0.5" />
              </div>

              <WorkspaceIdentityActions
                settingsHref={adminWorkspaceRoutes.settings()}
                compact
              />
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
