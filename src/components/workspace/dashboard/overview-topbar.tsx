import { ArrowRight, FolderKanban, MessageSquareText } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type OverviewTopBarProps = {
  organizationName: string;
  campaignId: string | null;
  campaignName: string | null;
  currentStage: string | null;
  openReviewCount: number;
  approvedAssetCount: number;
};

export function OverviewTopBar({
  organizationName,
  campaignId,
  campaignName,
  currentStage,
  openReviewCount,
  approvedAssetCount,
}: OverviewTopBarProps) {
  return (
    <section className="workspace-topbar px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-3">
          <p className="workspace-section-label">Übersicht</p>
          <div className="space-y-1">
            <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              {organizationName}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--workspace-copy-body)]">
              Zeigt, wo die Kampagne steht, welche Entscheidungen noch offen sind
              und ob das Team bereit für einen bezahlten Piloten ist.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={campaignId ? `/workspace/campaigns/${campaignId}` : "#campaign-focus"}
            className="workspace-button workspace-button-primary"
          >
            <FolderKanban className="h-4 w-4" />
            Kampagne öffnen
          </a>
          <a
            href={campaignId ? `/workspace/campaigns/${campaignId}/review` : "#review-queue"}
            className="workspace-button workspace-button-secondary"
          >
            <MessageSquareText className="h-4 w-4" />
            Review öffnen
          </a>
          <a
            href={campaignId ? `/workspace/pilot-request?campaignId=${campaignId}` : "/workspace/pilot-request"}
            className="workspace-button workspace-button-secondary sm:col-span-2"
          >
            Bezahlten Piloten anfragen
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
        <div className="workspace-meta-row">
          <span>Workspace vorbereitet</span>
          {campaignName ? (
            <span className="inline-flex items-center gap-2">
              <FolderKanban className="h-3.5 w-3.5" />
              {campaignName}
            </span>
          ) : null}
          <span>{openReviewCount} offene Review-{openReviewCount === 1 ? "Diskussion" : "Diskussionen"}</span>
          <span>{approvedAssetCount} freigegebene {approvedAssetCount === 1 ? "Asset" : "Assets"}</span>
        </div>
        {campaignName ? (
          <div className="mt-3">
            {currentStage ? <StatusPill value={currentStage} tone="accent" /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
