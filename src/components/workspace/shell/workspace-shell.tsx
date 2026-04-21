"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardList,
  FolderKanban,
  FolderOpen,
  Home,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWorkspaceRole } from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  WorkspaceAvatarSlot,
  WorkspaceIdentityActions,
  WorkspaceLogoLockup,
} from "@/components/workspace/shell/workspace-shell-primitives";

type WorkspaceShellProps = {
  organizationName: string;
  role: string;
  website?: string | null;
  activeCampaignId?: string | null;
  demo?: WorkspaceDemoState;
  showCommercialStep?: boolean;
  children: React.ReactNode;
};

type NavigationItem = {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  helper?: string;
};

function WorkspaceNavSection({
  label,
  items,
  ariaLabel,
}: {
  label: string;
  items: NavigationItem[];
  ariaLabel?: string;
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
                {item.helper ? (
                  <span className="block text-xs text-[var(--workspace-copy-muted)]">
                    {item.helper}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

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
  const mobileLocationLabel =
    pathname === brandsWorkspaceRoutes.home() || pathname === brandsWorkspaceRoutes.overview()
      ? "Home"
      : pathname.startsWith(brandsWorkspaceRoutes.campaigns.index())
        ? "Campaigns"
        : pathname.startsWith(brandsWorkspaceRoutes.reviews.index()) || pathname.includes("/review")
          ? "Reviews"
          : pathname.startsWith(brandsWorkspaceRoutes.deliveries.index()) ||
              pathname.includes("/handover")
            ? "Deliveries"
            : pathname.startsWith(brandsWorkspaceRoutes.assets())
              ? "Assets"
              : pathname.startsWith(brandsWorkspaceRoutes.profile()) ||
                  pathname.startsWith(brandsWorkspaceRoutes.onboarding())
                ? "Brand Profile"
                : pathname.startsWith(brandsWorkspaceRoutes.team())
                  ? "Team"
                  : pathname.startsWith(brandsWorkspaceRoutes.billing())
                    ? "Billing"
                    : "Workspace";

  const primaryNavigation: NavigationItem[] = [
    {
      href: brandsWorkspaceRoutes.home(),
      label: "Home",
      icon: Home,
      active:
        pathname === brandsWorkspaceRoutes.home() || pathname === brandsWorkspaceRoutes.overview(),
      helper: "Dashboard, status, next action",
    },
    {
      href: brandsWorkspaceRoutes.campaigns.index(),
      label: "Campaigns",
      icon: FolderKanban,
      active:
        pathname === brandsWorkspaceRoutes.campaigns.index() ||
        pathname.startsWith("/brands/campaigns/"),
      helper: activeCampaignId ? "Current campaign room and archive" : "Current campaign room",
    },
    {
      href: brandsWorkspaceRoutes.campaigns.new(),
      label: "New Campaign",
      icon: ClipboardList,
      active: pathname === brandsWorkspaceRoutes.campaigns.new(),
      helper: "Start the next request",
    },
    {
      href: brandsWorkspaceRoutes.reviews.index(),
      label: "Reviews",
      icon: ShieldCheck,
      active:
        pathname === brandsWorkspaceRoutes.reviews.index() || pathname.includes("/review"),
      helper: "Approvals and change requests",
    },
    {
      href: brandsWorkspaceRoutes.deliveries.index(),
      label: "Deliveries",
      icon: Sparkles,
      active:
        pathname === brandsWorkspaceRoutes.deliveries.index() || pathname.includes("/handover"),
      helper: "Approved output packs",
    },
    {
      href: brandsWorkspaceRoutes.assets(),
      label: "Assets",
      icon: FolderOpen,
      active: pathname === brandsWorkspaceRoutes.assets(),
      helper: "Library and references",
    },
  ];

  const accountNavigation: NavigationItem[] = [
    {
      href: brandsWorkspaceRoutes.profile(),
      label: "Brand Profile",
      icon: Settings2,
      active:
        pathname === brandsWorkspaceRoutes.profile() || pathname === brandsWorkspaceRoutes.onboarding(),
      helper: "Context, approvals, guardrails",
    },
    {
      href: brandsWorkspaceRoutes.team(),
      label: "Team",
      icon: Users,
      active: pathname === brandsWorkspaceRoutes.team(),
      helper: "Stakeholders and access",
    },
    {
      href: brandsWorkspaceRoutes.billing(),
      label: "Billing",
      icon: CircleDollarSign,
      active: pathname === brandsWorkspaceRoutes.billing(),
      helper: "Commercial readiness and spend",
    },
  ];

  if (showCommercialStep) {
    accountNavigation.unshift({
      href: brandsWorkspaceRoutes.pilotRequest({
        campaignId: activeCampaignId,
      }),
      label: "Pilot Request",
      icon: BriefcaseBusiness,
      active: pathname === brandsWorkspaceRoutes.pilotRequest(),
      helper: "Move the approved campaign forward",
    });
  }

  return (
    <div className="workspace-app min-h-screen text-[var(--workspace-copy-strong)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <aside className="workspace-sidebar hidden w-[280px] shrink-0 flex-col border-r border-[var(--workspace-line)] px-5 py-5 lg:flex">
          <div className="workspace-brand-card">
            <div className="flex items-start justify-between gap-4">
              <WorkspaceLogoLockup
                label="Brands Workspace"
                demoBadge={demo?.isDemoWorkspace ? demo.shellBadge : null}
              />
              <WorkspaceAvatarSlot name={organizationName} />
            </div>

            <div className="mt-4 space-y-1.5">
              <p className="text-[1.02rem] font-semibold tracking-[-0.02em] text-[var(--workspace-copy-strong)]">
                {organizationName}
              </p>
              <p className="text-sm text-[var(--workspace-copy-muted)]">
                {website || formatWorkspaceRole(role)}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Brand teams see clear campaign movement, review state, and the one obvious next action
              without production complexity leaking into the workspace.
            </p>

            <div className="mt-4 workspace-meta-row">
              <span>{formatWorkspaceRole(role)}</span>
              <span>{showCommercialStep ? "Pilot-ready" : "Review active"}</span>
            </div>

            <div className="mt-5">
              <WorkspaceIdentityActions settingsHref={brandsWorkspaceRoutes.profile()} />
            </div>
          </div>

          <WorkspaceNavSection
            label="Navigation"
            ariaLabel="Navigation im Brands Workspace"
            items={primaryNavigation}
          />
          <WorkspaceNavSection label="Account" items={accountNavigation} />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="border-b border-[var(--workspace-line)] bg-[var(--workspace-panel)] px-4 py-3 lg:hidden">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <WorkspaceLogoLockup
                    label="Brands Workspace"
                    demoBadge={demo?.isDemoWorkspace ? demo.shellBadge : null}
                  />
                  <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[var(--workspace-copy-strong)]">
                    {organizationName}
                  </p>
                  <div className="workspace-meta-row">
                    <span>{mobileLocationLabel}</span>
                    <span>{formatWorkspaceRole(role)}</span>
                  </div>
                </div>
                <WorkspaceAvatarSlot name={organizationName} className="mt-0.5" />
              </div>

              <WorkspaceIdentityActions
                settingsHref={brandsWorkspaceRoutes.profile()}
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
