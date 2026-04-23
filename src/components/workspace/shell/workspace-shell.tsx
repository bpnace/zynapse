"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  ClipboardList,
  FolderKanban,
  LayoutGrid,
  Rocket,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceShellProps = {
  organizationName: string;
  role: string;
  website?: string | null;
  activeCampaignId?: string | null;
  pathnameOverride?: string;
  children: React.ReactNode;
};

type PlannedNavigationItem = {
  label: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
};

const plannedNavigation: PlannedNavigationItem[] = [];

function formatRole(role: string) {
  return role.replaceAll("_", " ");
}

export function WorkspaceShell({
  organizationName,
  role,
  website,
  activeCampaignId,
  pathnameOverride,
  children,
}: WorkspaceShellProps) {
  const pathnameFromRouter = usePathname();
  const pathname = pathnameOverride ?? pathnameFromRouter;
  const mobileLocationLabel = pathname.includes("/review")
    ? "Review room"
    : pathname.includes("/handover")
      ? "Handover center"
    : pathname.includes("/onboarding")
      ? "Setup"
    : pathname.includes("/briefs/")
      ? "Briefs"
    : pathname.includes("/campaigns/")
      ? "Campaign"
      : "Overview active";
  const navigation = [
    {
      href: "/workspace",
      label: "Overview",
      helper: "Current campaign and next actions",
      icon: LayoutGrid,
      active: pathname === "/workspace",
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}`
        : undefined,
      label: "Campaign",
      helper: "Strategy, angles, deliverables",
      icon: FolderKanban,
      active:
        Boolean(activeCampaignId) &&
        pathname === `/workspace/campaigns/${activeCampaignId}`,
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}/review`
        : undefined,
      label: "Review Room",
      helper: "Comments, approvals, change requests",
      icon: ShieldCheck,
      active: pathname.includes("/review"),
    },
    {
      href: "/workspace/onboarding",
      label: "Setup",
      helper: "Brand profile and stakeholders",
      icon: Settings2,
      active: pathname === "/workspace/onboarding",
    },
    {
      href: "/workspace/briefs/new",
      label: "Briefs",
      helper: "In-product intake and submissions",
      icon: ClipboardList,
      active: pathname.includes("/briefs/"),
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}/handover`
        : undefined,
      label: "Handover Center",
      helper: "Approved outputs and delivery notes",
      icon: Rocket,
      active: pathname.includes("/handover"),
    },
  ];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="workspace-sidebar hidden w-[288px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <div className="space-y-2">
              <p className="workspace-eyebrow">Brand Workspace</p>
              <div className="space-y-1">
                <p className="text-lg font-semibold tracking-[-0.02em]">
                  {organizationName}
                </p>
                {website ? (
                  <p className="text-sm text-[var(--workspace-copy-muted)]">
                    {website}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-4 workspace-meta-row text-[var(--workspace-sidebar-copy-muted)]">
              <span>{formatRole(role)}</span>
              <span>Invite-only buyer workspace</span>
            </div>
          </div>

          <nav className="mt-6 space-y-2" aria-label="Workspace navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const className = cn(
                "workspace-nav-item",
                item.active ? "workspace-nav-item-active" : "workspace-nav-item-muted",
                !item.href && "opacity-60",
              );

              if (!item.href) {
                return (
                  <div key={item.label} className={className}>
                    <span className="workspace-nav-icon">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-semibold tracking-[-0.01em]">
                        {item.label}
                      </span>
                      <span className="block text-xs text-[var(--workspace-copy-muted)]">
                        {item.helper}
                      </span>
                    </span>
                  </div>
                );
              }

              return (
                <Link key={item.label} href={item.href} className={className}>
                  <span className="workspace-nav-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="space-y-0.5">
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

          <div className="mt-8 space-y-3">
            <p className="workspace-section-label">Planned next</p>
            <div className="space-y-2">
              {plannedNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="workspace-nav-item workspace-nav-item-muted">
                    <span className="workspace-nav-icon workspace-nav-icon-muted">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-sm font-medium text-[var(--workspace-copy-strong)]">
                        {item.label}
                      </span>
                      <span className="block text-xs text-[var(--workspace-copy-muted)]">
                        {item.helper}
                      </span>
                    </span>
                    <span className="workspace-coming-soon">Planned</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-auto border-t border-[var(--workspace-line)] pt-4">
            <p className="workspace-section-label">Why this workspace exists</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Show the campaign structure, review path, and handover quality before
              asking the buyer to commit to a paid pilot.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[rgba(248,250,252,0.92)] px-4 py-3 backdrop-blur lg:hidden">
            <div className="space-y-1">
              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <div className="workspace-meta-row">
                <span>{mobileLocationLabel}</span>
                <span>{formatRole(role)}</span>
              </div>
            </div>
          </div>

          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
