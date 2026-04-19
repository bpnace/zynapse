import { ArrowRight, FolderKanban } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceLabel } from "@/lib/workspace/formatting";

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
            <span className="workspace-section-label">Aktive Kampagne</span>
            <span className="text-sm font-medium text-[var(--workspace-copy-body)]">
              {formatWorkspaceLabel(packageTier)}
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
              <p className="workspace-section-label">Aktuelles Ziel</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Die laufende Kampagne bleibt sichtbar, damit Strategie,
                Freigabe und Übergabe am selben Ziel ausgerichtet bleiben.
              </p>
            </div>
            <div className="py-4">
              <p className="workspace-section-label">Nächster Entscheidungspunkt</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                Kläre zuerst offenes Feedback und bestätige danach, was wirklich
                freigabereif für Übergabe oder Pilotanfrage ist.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm border-t border-[var(--workspace-line)] pt-4 xl:border-t-0 xl:border-l xl:pl-6 xl:pt-0">
          <div className="flex items-center gap-2 text-[var(--workspace-copy-strong)]">
            <FolderKanban className="h-4 w-4" />
            <p className="text-sm font-semibold">Signalbild</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
            Eine klar geführte Kampagne hält die Zusammenarbeit an echten
            Varianten fest statt an abstrakten Statusfeldern.
          </p>
          <div className="mt-4 workspace-meta-row">
            <span>1 Kampagne</span>
            <span>1 Freigabepfad</span>
            <span>1 nächste Entscheidung</span>
          </div>
          <a href="#review-queue" className="mt-5 workspace-button workspace-button-secondary">
            Zur Freigabeübersicht
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
