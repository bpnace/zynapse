"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
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

type PlannedNavigationItem = {
  label: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
};

const plannedNavigation: PlannedNavigationItem[] = [];

type WorkspaceShellProps = {
  organizationName: string;
  role: string;
  website?: string | null;
  activeCampaignId?: string | null;
  children: React.ReactNode;
};

export function WorkspaceShell({
  organizationName,
  role,
  website,
  activeCampaignId,
  children,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const mobileLocationLabel = pathname.includes("/review")
    ? "Review"
    : pathname.includes("/handover")
      ? "Übergabe"
    : pathname.includes("/onboarding")
      ? "Setup"
    : pathname.includes("/briefs/")
      ? "Briefings"
    : pathname.includes("/pilot-request")
      ? "Pilot-Anfrage"
    : pathname.includes("/campaigns/")
      ? "Kampagne"
      : "Übersicht";
  const navigation = [
    {
      href: "/workspace",
      label: "Übersicht",
      helper: "Aktuelle Kampagne und nächste Schritte",
      icon: LayoutGrid,
      active: pathname === "/workspace",
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}`
        : undefined,
      label: "Kampagne",
      helper: "Strategie, Angles und Assets",
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
      helper: "Kommentare, Freigaben, Änderungswünsche",
      icon: ShieldCheck,
      active: pathname.includes("/review"),
    },
    {
      href: "/workspace/onboarding",
      label: "Setup",
      helper: "Brand-Profil und Stakeholder",
      icon: Settings2,
      active: pathname === "/workspace/onboarding",
    },
    {
      href: "/workspace/briefs/new",
      label: "Briefings",
      helper: "Intake und Freigabe im Produkt",
      icon: ClipboardList,
      active: pathname.includes("/briefs/"),
    },
    {
      href: activeCampaignId
        ? `/workspace/campaigns/${activeCampaignId}/handover`
        : undefined,
      label: "Übergabe",
      helper: "Freigegebene Assets und Liefernotizen",
      icon: Rocket,
      active: pathname.includes("/handover"),
    },
    {
      href: activeCampaignId
        ? `/workspace/pilot-request?campaignId=${activeCampaignId}`
        : "/workspace/pilot-request",
      label: "Pilot-Anfrage",
      helper: "Kommerzielle Übergabe an Ops",
      icon: ArrowUpRight,
      active: pathname === "/workspace/pilot-request",
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
              <span>{formatWorkspaceRole(role)}</span>
              <span>Privater Brand-Workspace</span>
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

          {plannedNavigation.length > 0 ? (
            <div className="mt-8 space-y-3">
              <p className="workspace-section-label">Als Nächstes geplant</p>
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
                      <span className="workspace-coming-soon">Geplant</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-auto border-t border-[var(--workspace-line)] pt-4">
            <p className="workspace-section-label">Warum es diesen Workspace gibt</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Zeigt Kampagnenstruktur, Review-Pfad und Übergabequalität, bevor ein
              Buyer sich auf einen bezahlten Piloten festlegt.
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
                <span>{formatWorkspaceRole(role)}</span>
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
