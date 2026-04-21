import { FolderKanban, MessageSquareText } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type OverviewTopBarProps = {
  organizationName: string;
  campaignId: string | null;
  campaignName: string | null;
  currentStage: string | null;
  openReviewCount: number;
  approvedAssetCount: number;
  demo?: WorkspaceDemoState;
};

export function OverviewTopBar({
  organizationName,
  campaignId,
  campaignName,
  currentStage,
  openReviewCount,
  approvedAssetCount,
  demo,
}: OverviewTopBarProps) {
  return (
    <section className="workspace-topbar px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Heute</span>
            {demo?.isDemoWorkspace ? (
              <span className="workspace-demo-badge">{demo.shellBadge}</span>
            ) : null}
            {currentStage ? <StatusPill value={currentStage} tone="accent" /> : null}
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-[2.35rem] leading-[0.96] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              {campaignName ?? "Was heute ansteht"}
            </h1>
            <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
              Heute geht es darum, die laufende Kampagne sauber durch die
              Freigabe zu führen und bereits vorbereitete Ergebnisse mit
              genügend Sicherheit in die Übergabe mitzunehmen.
            </p>
          </div>
          <div className="workspace-stat-strip">
            <span className="workspace-stat-chip">{organizationName}</span>
            <span className="workspace-stat-chip">
              {openReviewCount} offene {openReviewCount === 1 ? "Diskussion" : "Diskussionen"}
            </span>
            <span className="workspace-stat-chip">
              {approvedAssetCount} freigegebene {approvedAssetCount === 1 ? "Variante" : "Varianten"}
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={campaignId ? brandsWorkspaceRoutes.campaigns.detail(campaignId) : "#campaign-focus"}
            className="workspace-button workspace-button-primary"
          >
            <FolderKanban className="h-4 w-4" />
            Kampagne öffnen
          </a>
          <a
            href={campaignId ? brandsWorkspaceRoutes.campaigns.review(campaignId) : "#review-queue"}
            className="workspace-button workspace-button-secondary"
          >
            <MessageSquareText className="h-4 w-4" />
            Freigabe öffnen
          </a>
        </div>
      </div>
    </section>
  );
}
