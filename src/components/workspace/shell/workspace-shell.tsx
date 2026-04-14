"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardList,
  FolderKanban,
  LayoutGrid,
  Rocket,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWorkspaceRole } from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";

type WorkspaceShellProps = {
  organizationName: string;
  role: string;
  website?: string | null;
  activeCampaignId?: string | null;
  demo?: WorkspaceDemoState;
  showCommercialStep?: boolean;
  children: React.ReactNode;
};

export function WorkspaceShell({
  organizationName,
  role,
  website,
  activeCampaignId,
  demo,
  showCommercialStep = false,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const mobileLocationLabel = pathname.includes("/review")
    ? "Review"
    : pathname.includes("/handover")
      ? "Delivery"
    : pathname.includes("/onboarding")
      ? "Brand Context"
    : pathname.includes("/briefs/")
      ? "Briefings"
    : pathname.includes("/pilot-request")
      ? "Commercial"
    : pathname.includes("/campaigns/")
      ? "Workstream"
      : "Today";
  const primaryNavigation = [
    {
      href: "/workspace",
      label: "Today",
      helper: "Status, decisions, readiness",
      icon: LayoutGrid,
      active: pathname === "/workspace",
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}`
        : undefined,
      label: "Workstream",
      helper: "Objective, stage, deliverables",
      icon: FolderKanban,
      active:
        Boolean(activeCampaignId) &&
        pathname === `/workspace/campaigns/${activeCampaignId}`,
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}/review`
        : undefined,
      label: "Review",
      helper: "Decisions, changes, approvals",
      icon: ShieldCheck,
      active: pathname.includes("/review"),
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}/handover`
        : undefined,
      label: "Delivery",
      helper: "Approved outputs and ledger",
      icon: Rocket,
      active: pathname.includes("/handover"),
    },
  ];
  const secondaryNavigation = [
    {
      href: "/workspace/onboarding",
      label: "Brand Context",
      helper: "Channels, guardrails, reviewers",
      icon: Settings2,
      active: pathname === "/workspace/onboarding",
    },
    {
      href: "/workspace/briefs/new",
      label: "Briefings",
      helper: "Structured requests and intake",
      icon: ClipboardList,
      active: pathname.includes("/briefs/"),
    },
  ];
  const commercialNavigation = showCommercialStep
    ? [
        {
          href: activeCampaignId
            ? `/workspace/pilot-request?campaignId=${activeCampaignId}`
            : "/workspace/pilot-request",
          label: "Commercial",
          helper: "Next engagement and handoff",
          icon: ArrowUpRight,
          active: pathname === "/workspace/pilot-request",
        },
      ]
    : [];

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="workspace-sidebar hidden w-[264px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <p className="workspace-eyebrow">Client Operations</p>
            <div className="mt-3 space-y-1">
              <p className="text-base font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              {website ? (
                <p className="text-sm text-[var(--workspace-copy-muted)]">
                  {website}
                </p>
              ) : null}
            </div>
            <div className="mt-4 space-y-1 text-sm text-[var(--workspace-copy-muted)]">
              <p>{demo?.isDemoWorkspace ? demo.shellBadge : formatWorkspaceRole(role)}</p>
              <p>{showCommercialStep ? "Commercial step available" : "Delivery in progress"}</p>
            </div>
          </div>

          {demo?.isDemoWorkspace ? (
            <div className="mt-4 border border-[var(--workspace-line)] bg-[var(--workspace-panel-muted)] px-4 py-4">
              <p className="workspace-eyebrow">
                {demo.shellBadge}
              </p>
              <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                Read-only delivery view
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                {demo.shellDescription}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <p className="workspace-section-label">Core surfaces</p>
          </div>
          <nav className="mt-3 space-y-1" aria-label="Workspace navigation">
            {primaryNavigation.map((item) => {
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

          <div className="mt-8">
            <p className="workspace-section-label">Context</p>
          </div>
          <nav className="mt-3 space-y-1">
            {[...secondaryNavigation, ...commercialNavigation].map((item) => {
              const Icon = item.icon;
              const className = cn(
                "workspace-nav-item workspace-nav-item-secondary",
                item.active ? "workspace-nav-item-active" : "workspace-nav-item-muted",
                !item.href && "opacity-60",
              );

              if (!item.href) {
                return (
                  <div key={item.label} className={className}>
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
                  </div>
                );
              }

              return (
                <Link key={item.label} href={item.href} className={className}>
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
            <p className="workspace-section-label">Delivery stance</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Follow the workstream, clear decisions in review, and use delivery
              as the source of truth for approvals, provenance, and next steps.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-1">
              <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <div className="workspace-meta-row">
                <span>{mobileLocationLabel}</span>
                <span>{demo?.isDemoWorkspace ? demo.shellBadge : formatWorkspaceRole(role)}</span>
              </div>
            </div>
          </div>

          <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
