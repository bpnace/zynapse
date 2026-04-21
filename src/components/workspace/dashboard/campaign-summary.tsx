import { ArrowRight, FolderKanban } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceLabel } from "@/lib/workspace/formatting";

type CampaignSummaryProps = {
  campaignName: string;
  campaignGoal: string;
  packageTier: string;
  currentStage: string;
  audience: string | null;
  primaryChannels: string | null;
  openReviewCount: number;
  approvedAssetCount: number;
};

export function CampaignSummary({
  campaignName,
  campaignGoal,
  packageTier,
  currentStage,
  audience,
  primaryChannels,
  openReviewCount,
  approvedAssetCount,
}: CampaignSummaryProps) {
  return (
    <section id="campaign-focus" className="workspace-panel overflow-hidden px-6 py-6 sm:px-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="workspace-section-label">Aktive Kampagne</span>
            <span className="workspace-kicker">{formatWorkspaceLabel(packageTier)}</span>
            <StatusPill value={currentStage} tone="accent" />
          </div>
          <div className="space-y-3">
            <h2 className="font-display text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              {campaignName}
            </h2>
            <p className="max-w-3xl text-[1rem] leading-7 text-[var(--workspace-copy-body)]">
              {campaignGoal}
            </p>
          </div>

          <div className="grid gap-3">
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Worum es geht</p>
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {audience ?? "Die Kampagne bleibt als ein klarer Strang sichtbar, damit Review und Übergabe an derselben Geschichte ausgerichtet bleiben."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Was heute zählt</p>
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {openReviewCount > 0
                  ? `Zuerst die offenen Rückmeldungen auflösen, danach die belastbarsten Varianten für die Übergabe bestätigen.`
                  : "Die Freigabe ist ruhig genug, um die stärksten Varianten direkt in die Übergabe zu führen."}
              </p>
            </article>
            <article className="workspace-panel-muted px-4 py-4">
              <p className="workspace-section-label">Woran ihr erkennt, dass es trägt</p>
              <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {approvedAssetCount > 0
                  ? `${approvedAssetCount} Varianten stehen bereits als belastbare Grundlage für Übergabe und nächste Schritte bereit.`
                  : "Sobald erste Varianten freigegeben sind, wird die Übergabe zum verlässlichen Nachweispunkt."}
              </p>
            </article>
          </div>
        </div>

        <div className="workspace-panel-muted flex h-full flex-col justify-between px-5 py-5">
          <div>
            <div className="flex items-center gap-2 text-[var(--workspace-copy-strong)]">
              <FolderKanban className="h-4 w-4" />
              <p className="text-sm font-semibold">Kampagnenfokus</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {primaryChannels
                ? `${primaryChannels} bilden den Rahmen für die aktuelle Freigabe- und Übergaberunde.`
                : "Diese Kundenansicht reduziert die Kampagne auf den nächsten sauberen Entscheidungspunkt."}
            </p>
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
