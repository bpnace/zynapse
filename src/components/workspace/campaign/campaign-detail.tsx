import Link from "next/link";
import { ArrowRight, FileImage, FileVideo, FolderKanban } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceAssetType, formatWorkspaceLabel } from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

type CampaignDetailProps = {
  campaign: {
    id: string;
    name: string;
    campaignGoal: string | null;
    packageTier: string;
    currentStage: string;
  };
  stageItems: Array<{
    stageKey: string;
    status: string;
  }>;
  prioritizedAngles: Array<{
    label: string;
    status: string;
    sourceTitle: string;
  }>;
  deliverableSummary: {
    total: number;
    approved: number;
    pending: number;
    changesRequested: number;
    videos: number;
    statics: number;
  };
  reviewReadiness: {
    openThreads: number;
    assetsReadyForApproval: number;
    assetsNeedingChanges: number;
    assetsAwaitingDecision: number;
  };
  reviewDeadline: {
    label: string;
    detail: string;
  };
  packageRecommendation: {
    heading: string;
    body: string;
  };
  latestAssets: Array<{
    id: string;
    title: string;
    assetType: string;
    format: string | null;
    versionLabel: string | null;
    reviewStatus: string;
    threadCount: number;
  }>;
  demo: WorkspaceDemoState;
};

export function CampaignDetail({
  campaign,
  stageItems,
  prioritizedAngles,
  deliverableSummary,
  reviewReadiness,
  reviewDeadline,
  packageRecommendation,
  latestAssets,
  demo,
}: CampaignDetailProps) {
  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="workspace-section-label">Kampagne</span>
              {demo.isDemoWorkspace ? (
                <span className="workspace-demo-badge">{demo.shellBadge}</span>
              ) : null}
              <StatusPill value={campaign.currentStage} tone="accent" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-[2.2rem] leading-[0.98] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
                Hier verdichtet sich die Kampagne auf Zielbild, führende
                Richtungen und die Punkte, die die laufende Freigabe noch
                beeinflussen.
              </p>
            </div>
            <div className="workspace-stat-strip">
              <span className="workspace-stat-chip">{formatWorkspaceLabel(campaign.packageTier)}</span>
              <span className="workspace-stat-chip">{deliverableSummary.total} Varianten</span>
              <span className="workspace-stat-chip">
                {reviewReadiness.openThreads} offene Diskussionen
              </span>
              <span className="workspace-stat-chip">
                {reviewReadiness.assetsNeedingChanges} mit Änderungsbedarf
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={brandsWorkspaceRoutes.overview()}
              className="workspace-button workspace-button-secondary"
            >
              Zur Übersicht
            </Link>
            <div className="grid gap-2 sm:grid-cols-2 sm:col-span-2">
              <Link
                href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
                className="workspace-button workspace-button-primary"
              >
                Freigabe öffnen
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={brandsWorkspaceRoutes.campaigns.handover(campaign.id)}
                className="workspace-button workspace-button-secondary"
              >
                Übergabe öffnen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-5 py-5">
            <p className="workspace-section-label">Ziel</p>
            <h2 className="mt-3 font-display text-[1.95rem] leading-[1.04] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              {campaign.campaignGoal ?? "Für diese Kampagne ist noch kein Ziel hinterlegt."}
            </h2>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Empfohlener nächster Schritt</p>
              <p className="mt-2 text-base font-semibold text-[var(--workspace-copy-strong)]">
                {packageRecommendation.heading}
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                {packageRecommendation.body}
              </p>
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Führende Richtungen</p>
              <h2 className="font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Führende Richtungen
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              {prioritizedAngles.map((angle) => (
                <article key={angle.label} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {angle.label}
                      </p>
                      <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">
                        Derzeit am klarsten sichtbar in {angle.sourceTitle}
                      </p>
                    </div>
                    <StatusPill value={angle.status} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Varianten-Mix</p>
              <h2 className="font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Aktueller Stand der Varianten
              </h2>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="grid gap-4">
                <div className="workspace-panel-muted px-4 py-4">
                  <p className="workspace-section-label">Mengenbild</p>
                  <div className="mt-3 workspace-split-list">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[var(--workspace-copy-body)]">Videos</span>
                      <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {deliverableSummary.videos}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[var(--workspace-copy-body)]">Statische Motive</span>
                      <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {deliverableSummary.statics}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[var(--workspace-copy-body)]">Freigegeben</span>
                      <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {deliverableSummary.approved}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-[var(--workspace-copy-body)]">Offen</span>
                      <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {deliverableSummary.pending}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="workspace-split-list">
                {latestAssets.map((asset) => (
                  <article key={asset.id} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {asset.assetType.includes("video") ? (
                            <FileVideo className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                          ) : (
                            <FileImage className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                          )}
                          <p className="truncate text-sm font-semibold text-[var(--workspace-copy-strong)]">
                            {asset.title}
                          </p>
                        </div>
                        <div className="mt-2 workspace-meta-row">
                          <span>{formatWorkspaceAssetType(asset.assetType)}</span>
                          {asset.format ? <span>{asset.format}</span> : null}
                          {asset.versionLabel ? <span>{asset.versionLabel}</span> : null}
                          <span>{asset.threadCount} {asset.threadCount === 1 ? "Diskussion" : "Diskussionen"}</span>
                        </div>
                      </div>
                      <StatusPill value={asset.reviewStatus} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Workflow-Status</p>
              <h2 className="font-display text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Aktueller Workflow-Stand
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              {stageItems.map((stage) => (
                <div key={stage.stageKey} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                    <span className="text-sm font-medium text-[var(--workspace-copy-strong)]">
                      {formatWorkspaceLabel(stage.stageKey)}
                    </span>
                  </div>
                  <StatusPill value={stage.status} />
                </div>
              ))}
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Freigabereife</p>
              <h2 className="font-display text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Was in der Freigabe noch offen ist
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">Offene Freigabe-Diskussionen</span>
                <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  {reviewReadiness.openThreads}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">Freigabereif</span>
                <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  {reviewReadiness.assetsReadyForApproval}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">Braucht Änderungen</span>
                <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  {reviewReadiness.assetsNeedingChanges}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">Wartet auf Entscheidung</span>
                <span className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                  {reviewReadiness.assetsAwaitingDecision}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">{reviewDeadline.label}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {reviewDeadline.detail}
              </p>
            </div>

            <div className="mt-5">
              <Link
                href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
                className="workspace-button workspace-button-primary"
              >
                Zur Freigabe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
