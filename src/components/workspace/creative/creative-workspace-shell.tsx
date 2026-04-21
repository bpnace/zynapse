"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  BriefcaseBusiness,
  ClipboardCheck,
  Home,
  Inbox,
  Settings2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  WorkspaceAvatarSlot,
  WorkspaceIdentityActions,
  WorkspaceLogoLockup,
} from "@/components/workspace/shell/workspace-shell-primitives";

type CreativeWorkspaceShellProps = {
  organizationName: string;
  displayName: string;
  headline?: string | null;
  demo?: WorkspaceDemoState;
  children: React.ReactNode;
};

type NavigationItem = {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  helper: string;
};

function CreativeNav({
  items,
  label,
  ariaLabel,
}: {
  items: NavigationItem[];
  label: string;
  ariaLabel: string;
}) {
  return (
    <>
      <div className="mt-6">
        <p className="workspace-section-label">{label}</p>
      </div>
      <nav className="mt-3 space-y-1" aria-label={ariaLabel}>
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
    </>
  );
}

export function CreativeWorkspaceShell({
  organizationName,
  displayName,
  headline,
  demo,
  children,
}: CreativeWorkspaceShellProps) {
  const pathname = usePathname();

  const executionNavigation: NavigationItem[] = [
    {
      href: creativeWorkspaceRoutes.home(),
      label: "Home",
      icon: Home,
      active: pathname === creativeWorkspaceRoutes.home(),
      helper: "Readiness, workload, priorities",
    },
    {
      href: creativeWorkspaceRoutes.invitations.index(),
      label: "Invitations",
      icon: Inbox,
      active: pathname.startsWith(creativeWorkspaceRoutes.invitations.index()),
      helper: "Offers to accept, decline, or question",
    },
    {
      href: creativeWorkspaceRoutes.tasks(),
      label: "Tasks",
      icon: ClipboardCheck,
      active:
        pathname === creativeWorkspaceRoutes.tasks() ||
        pathname.startsWith("/creatives/tasks/") ||
        pathname.startsWith("/creatives/campaigns/") ||
        pathname === creativeWorkspaceRoutes.campaigns.index(),
      helper: "Current task room and execution queue",
    },
    {
      href: creativeWorkspaceRoutes.revisions.index(),
      label: "Revisions",
      icon: Sparkles,
      active:
        pathname.startsWith(creativeWorkspaceRoutes.revisions.index()) ||
        pathname === creativeWorkspaceRoutes.feedback(),
      helper: "Requested changes and follow-ups",
    },
  ];

  const profileNavigation: NavigationItem[] = [
    {
      href: creativeWorkspaceRoutes.profile(),
      label: "Profile",
      icon: Settings2,
      active: pathname === creativeWorkspaceRoutes.profile(),
      helper: "Capabilities, positioning, preferences",
    },
    {
      href: creativeWorkspaceRoutes.availability(),
      label: "Availability",
      icon: BriefcaseBusiness,
      active: pathname === creativeWorkspaceRoutes.availability(),
      helper: "Capacity and timing",
    },
    {
      href: creativeWorkspaceRoutes.resources(),
      label: "Resources",
      icon: BookMarked,
      active: pathname === creativeWorkspaceRoutes.resources(),
      helper: "Standards, context, source material",
    },
    {
      href: creativeWorkspaceRoutes.payouts(),
      label: "Payouts",
      icon: Wallet,
      active: pathname === creativeWorkspaceRoutes.payouts(),
      helper: "Compensation visibility",
    },
  ];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="workspace-sidebar hidden w-[280px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <div className="flex items-start justify-between gap-4">
              <WorkspaceLogoLockup
                label="Creatives Workspace"
                demoBadge={demo?.isDemoWorkspace ? demo.shellBadge : null}
              />
              <WorkspaceAvatarSlot name={displayName} />
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="text-[1.02rem] font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {displayName}
              </p>
              <p className="text-sm text-[var(--workspace-copy-muted)]">{organizationName}</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {headline ||
                "Creative partners see task context, revision expectations, and the fastest path to the next strong submission."}
            </p>

            <div className="mt-4 workspace-meta-row">
              <span>Creative lane</span>
              <span>{demo?.isDemoWorkspace ? "Read-only demo" : "Delivery-ready"}</span>
            </div>

            <div className="mt-5">
              <WorkspaceIdentityActions settingsHref={creativeWorkspaceRoutes.profile()} />
            </div>
          </div>

          <CreativeNav
            items={executionNavigation}
            label="Execution"
            ariaLabel="Execution navigation im Creatives Workspace"
          />
          <CreativeNav
            items={profileNavigation}
            label="Profile"
            ariaLabel="Profile navigation im Creatives Workspace"
          />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <WorkspaceLogoLockup
                    label="Creatives Workspace"
                    demoBadge={demo?.isDemoWorkspace ? demo.shellBadge : null}
                  />
                  <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                    {displayName}
                  </p>
                  <div className="workspace-meta-row">
                    <span>{organizationName}</span>
                    <span>Creative lane</span>
                  </div>
                </div>
                <WorkspaceAvatarSlot name={displayName} className="mt-0.5" />
              </div>

              <WorkspaceIdentityActions
                settingsHref={creativeWorkspaceRoutes.profile()}
                compact
              />
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
