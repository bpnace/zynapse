import { ArrowRight, FolderKanban } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type CampaignSummaryProps = {
  campaignName: string;
  campaignGoal: string;
  packageTier: string;
  currentStage: string;
};

export function CampaignSummary({
  campaignName,
  campaignGoal,
  packageTier,
  currentStage,
}: CampaignSummaryProps) {
  return (
    <section id="campaign-focus" className="workspace-panel overflow-hidden px-6 py-6 sm:px-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="workspace-section-label">Active campaign</span>
            <span className="text-sm font-medium text-[var(--workspace-copy-body)]">
              {packageTier}
            </span>
            <StatusPill value={currentStage} tone="accent" />
          </div>
          <div className="space-y-3">
            <h2 className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              {campaignName}
            </h2>
            <p className="max-w-2xl text-[0.95rem] leading-7 text-[var(--workspace-copy-body)]">
              {campaignGoal}
            </p>
          </div>
          <div className="workspace-panel-muted workspace-split-list px-4">
            <div className="py-4">
              <p className="workspace-section-label">Why it is visible now</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                The seeded campaign is the proof point for how Zynapse organizes
                campaign setup, review, and handover before a paid pilot starts.
              </p>
            </div>
            <div className="py-4">
              <p className="workspace-section-label">What to do next</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Use the overview to judge review readiness first, then follow the
                open review items before moving into a paid pilot conversation.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm border-t border-[var(--workspace-line)] pt-4 xl:border-t-0 xl:border-l xl:pl-6 xl:pt-0">
          <div className="flex items-center gap-2 text-[var(--workspace-copy-strong)]">
            <FolderKanban className="h-4 w-4" />
            <p className="text-sm font-semibold">Current operating view</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
            This first slice keeps the seeded campaign visually central and uses the
            surrounding modules to show review clarity, not unsupported scale.
          </p>
          <div className="mt-4 workspace-meta-row">
            <span>One campaign</span>
            <span>One review path</span>
            <span>One next decision</span>
          </div>
          <a href="#review-queue" className="mt-5 workspace-button workspace-button-secondary">
            Jump to review queue
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
