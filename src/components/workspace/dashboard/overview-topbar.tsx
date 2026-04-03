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
          <p className="workspace-section-label">Overview</p>
          <div className="space-y-1">
            <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              {organizationName}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
              The current workspace is set up to show one realistic campaign, the
              review path around it, and the commercial next step without sales-led
              narration.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <a
            href={campaignId ? `/workspace/campaigns/${campaignId}` : "#campaign-focus"}
            className="workspace-button workspace-button-primary"
          >
            <FolderKanban className="h-4 w-4" />
            Focus campaign
          </a>
          <a
            href={campaignId ? `/workspace/campaigns/${campaignId}/review` : "#review-queue"}
            className="workspace-button workspace-button-secondary"
          >
            <MessageSquareText className="h-4 w-4" />
            Review queue
          </a>
          <button
            type="button"
            className="workspace-button workspace-button-disabled sm:col-span-2"
            disabled
            title="Pilot request flow lands in a later redesign slice."
          >
            Request paid pilot
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
        <div className="workspace-meta-row">
          <span>Seeded workspace ready</span>
          {campaignName ? (
            <span className="inline-flex items-center gap-2">
              <FolderKanban className="h-3.5 w-3.5" />
              {campaignName}
            </span>
          ) : null}
          <span>{openReviewCount} open review {openReviewCount === 1 ? "thread" : "threads"}</span>
          <span>{approvedAssetCount} approved {approvedAssetCount === 1 ? "asset" : "assets"}</span>
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
