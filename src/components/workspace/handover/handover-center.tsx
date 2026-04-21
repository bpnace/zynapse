import Link from "next/link";
import { ArrowRight, FileImage, FileVideo, FolderOutput } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  formatWorkspaceAssetType,
  formatWorkspaceLabel,
} from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";
import type { BrandWorkspaceReadiness } from "@/lib/workspace/readiness";

type HandoverCenterProps = {
  campaign: {
    id: string;
    name: string;
    packageTier: string;
    currentStage: string;
  };
  stageItems: Array<{
    stageKey: string;
    status: string;
  }>;
  readiness: BrandWorkspaceReadiness;
  approvedAssets: Array<{
    id: string;
    title: string;
    assetType: string;
    format: string | null;
    versionLabel: string | null;
    storagePath: string | null;
    thumbnailPath: string | null;
    source: string | null;
    previewUrl: string | null;
    posterUrl: string | null;
  }>;
  groupedAssets: Array<{
    label: string;
    items: Array<{
      id: string;
      title: string;
      assetType: string;
      format: string | null;
      versionLabel: string | null;
      storagePath: string | null;
      thumbnailPath: string | null;
      source: string | null;
      previewUrl: string | null;
      posterUrl: string | null;
    }>;
  }>;
  usageSummary: {
    heading: string;
    body: string;
  };
  campaignNotes: string | null;
  nextStep: string | null;
  demo: WorkspaceDemoState;
};

function hasOperationalStatus(value: string) {
  return value === "approved" || value === "completed" || value === "in_progress";
}

export function HandoverCenter({
  campaign,
  stageItems,
  readiness,
  approvedAssets,
  groupedAssets,
  usageSummary,
  campaignNotes,
  nextStep,
  demo,
}: HandoverCenterProps) {
  const sourceCoverage = approvedAssets.filter((asset) => asset.source).length;
  const storageCoverage = approvedAssets.filter((asset) => asset.storagePath).length;
  const previewCoverage = approvedAssets.filter(
    (asset) => asset.previewUrl || asset.posterUrl || asset.thumbnailPath,
  ).length;
  const completedStages = stageItems.filter((stage) => hasOperationalStatus(stage.status)).length;
  const commercialReady = !demo.isReadOnly && readiness.showCommercialStep;

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="workspace-section-label">Übergabeprotokoll</span>
              {demo.isDemoWorkspace ? (
                <span className="workspace-demo-badge">{demo.shellBadge}</span>
              ) : null}
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-[2.15rem] leading-[0.98] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
                Diese Seite bündelt die freigegebenen Deliverables, ihre Referenzen und die Hinweise,
                die für eine sichere Übergabe relevant bleiben.
              </p>
            </div>
            <div className="workspace-stat-strip">
              <span className="workspace-stat-chip">{formatWorkspaceLabel(campaign.packageTier)}</span>
              <span className="workspace-stat-chip">
                {approvedAssets.length} freigegebene Varianten
              </span>
              <span className="workspace-stat-chip">
                {groupedAssets.length} Übergabegruppen
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
              className="workspace-button workspace-button-secondary"
            >
              Zurück zur Freigabe
            </Link>
            {commercialReady ? (
              <Link
                href={brandsWorkspaceRoutes.pilotRequest({ campaignId: campaign.id })}
                className="workspace-button workspace-button-primary"
              >
                Kommerziellen Schritt öffnen
              </Link>
            ) : (
              <div className="workspace-button workspace-button-secondary workspace-button-disabled">
                Kommerzieller Schritt noch gesperrt
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Freigegebene Varianten</p>
              <h2 className="font-display text-[1.85rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Übergabepaket
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Die freigegebenen Varianten bleiben ruhig gruppiert, damit Übergabe, Rückfragen und
                spätere Nutzung auf dieselben Nachweise verweisen.
              </p>
            </div>

            {groupedAssets.length > 0 ? (
              <div className="mt-5 workspace-split-list">
                {groupedAssets.map((group) => (
                  <section key={group.label} className="py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="workspace-section-label">{group.label}</p>
                      <p className="text-sm text-[var(--workspace-copy-muted)]">
                        {group.items.length} {group.items.length === 1 ? "Eintrag" : "Einträge"}
                      </p>
                    </div>
                    <div className="mt-3 workspace-split-list">
                      {group.items.map((asset) => (
                        <article key={asset.id} className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="overflow-hidden rounded-[18px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)]">
                                <WorkspaceAssetPreview
                                  data-testid={`handover-asset-preview-${asset.id}`}
                                  assetType={asset.assetType}
                                  title={asset.title}
                                  previewUrl={asset.previewUrl}
                                  posterUrl={asset.posterUrl}
                                  autoPlay={asset.assetType.includes("video")}
                                  loop={asset.assetType.includes("video")}
                                  muted={asset.assetType.includes("video")}
                                  className="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.25)]"
                                  mediaClassName="h-[4.75rem] w-[6rem] object-cover"
                                  fallbackClassName="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.25)] px-2 text-center"
                                />
                              </div>
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
                                </div>
                                <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                                  Diese Variante ist freigegeben und bleibt als verlässlicher Referenzpunkt
                                  für Übergabe und Folgearbeit dokumentiert.
                                </p>
                              </div>
                            </div>
                            <StatusPill value="approved" />
                          </div>
                          <div className="mt-4 workspace-stat-strip">
                            <span className="workspace-stat-chip">
                              {asset.source ? "Quelle erfasst" : "Quelle offen"}
                            </span>
                            <span className="workspace-stat-chip">
                              {asset.storagePath ? "Storage erfasst" : "Storage offen"}
                            </span>
                            <span className="workspace-stat-chip">
                              {asset.previewUrl || asset.posterUrl || asset.thumbnailPath
                                ? "Preview erfasst"
                                : "Preview offen"}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                  Noch keine freigegebenen Varianten sind bereit für die Übergabe.
                </p>
                <Link
                  href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
                  className="workspace-button workspace-button-secondary"
                >
                  Freigabe erneut öffnen
                </Link>
              </div>
            )}
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Referenzanhang</p>
              <h2 className="font-display text-[1.75rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Storage-, Preview- und Quellenlage
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Dieser Anhang hält die Referenzen fest, auf die spätere Übergabe, QA oder Rückfragen verweisen.
              </p>
            </div>

            <div className="mt-5 workspace-split-list">
              {approvedAssets.map((asset) => (
                <article key={asset.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="overflow-hidden rounded-[18px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)]">
                      <WorkspaceAssetPreview
                        assetType={asset.assetType}
                        title={asset.title}
                        previewUrl={asset.previewUrl}
                        posterUrl={asset.posterUrl}
                        autoPlay={asset.assetType.includes("video")}
                        loop={asset.assetType.includes("video")}
                        muted={asset.assetType.includes("video")}
                        className="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.25)]"
                        mediaClassName="h-[4.75rem] w-[6rem] object-cover"
                        fallbackClassName="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.25)] px-2 text-center"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <FolderOutput className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                        <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                          {asset.title}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                        Die Referenzen unten dokumentieren, worauf Übergabe und spätere Nutzung verweisen.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="workspace-section-label">Speicherpfad</p>
                      <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                        {asset.storagePath ?? "Kein Speicherpfad vorhanden"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Preview / Poster</p>
                      <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                        {asset.previewUrl ?? asset.posterUrl ?? asset.thumbnailPath ?? "Kein Preview-Pfad hinterlegt"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Version</p>
                      <p className="mt-2 text-sm text-[var(--workspace-copy-body)]">
                        {asset.versionLabel ?? "Keine Versionsangabe"}
                      </p>
                    </div>
                    <div>
                      <p className="workspace-section-label">Quelle</p>
                      <p className="mt-2 text-sm text-[var(--workspace-copy-body)]">
                        {asset.source ?? "Keine Quellen-Metadaten"}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-[var(--workspace-copy-muted)]">
              Diese Seite dokumentiert Referenzen und Nachweise, nicht die finale Versandautomatisierung.
            </p>
          </section>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Übergabe-Readiness</p>
              <h2 className="font-display text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Lieferhinweise und Sicherheit
              </h2>
            </div>
            <p className="mt-4 text-base font-semibold text-[var(--workspace-copy-strong)]">
              {usageSummary.heading}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {usageSummary.body}
            </p>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Übergabe-Checks</p>
              <div className="mt-3 workspace-split-list">
                <div className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-[var(--workspace-copy-body)]">
                    Freigegebene Varianten vorhanden
                  </span>
                  <StatusPill value={approvedAssets.length > 0 ? "approved" : "pending"} />
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-[var(--workspace-copy-body)]">
                    Quellen dokumentiert
                  </span>
                  <StatusPill
                    value={sourceCoverage === approvedAssets.length && approvedAssets.length > 0 ? "approved" : "pending"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-[var(--workspace-copy-body)]">
                    Speicherreferenzen hinterlegt
                  </span>
                  <StatusPill
                    value={storageCoverage === approvedAssets.length && approvedAssets.length > 0 ? "approved" : "pending"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-[var(--workspace-copy-body)]">
                    Preview-/Posterpfade erfasst
                  </span>
                  <StatusPill
                    value={previewCoverage === approvedAssets.length && approvedAssets.length > 0 ? "approved" : "pending"}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm text-[var(--workspace-copy-body)]">
                    KI-Kennzeichnung vor Versand prüfen
                  </span>
                  <StatusPill value="pending" />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Kampagnenhinweise</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {campaignNotes ??
                  "Für diese Übergabe liegen noch keine zusätzlichen Hinweise vor."}
              </p>
            </div>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Workflow-Status</p>
              <div className="mt-3 workspace-split-list">
                {stageItems.map((stage) => (
                  <div
                    key={stage.stageKey}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="text-sm text-[var(--workspace-copy-body)]">
                      {formatWorkspaceLabel(stage.stageKey)}
                    </span>
                    <StatusPill value={stage.status} />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                {completedStages}/{stageItems.length} Stufen haben einen belastbaren Arbeitsstand.
              </p>
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Kommerzieller nächster Schritt</p>
              <h2 className="font-display text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                Pilot-Bereitschaft
              </h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {nextStep ??
                "Die Übergabeseite prüft zuerst Freigaben, Referenzen und Übergabesicherheit. Erst danach sollte der kommerzielle Anschluss gestartet werden."}
            </p>

            <div className="mt-5 workspace-split-list border-t border-[var(--workspace-line)] pt-4">
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">
                  Kampagne ist freigegeben
                </span>
                <StatusPill
                  value={
                    campaign.currentStage === "approved" || campaign.currentStage === "handover_ready"
                      ? "approved"
                      : "pending"
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">
                  Varianten dokumentiert
                </span>
                <StatusPill value={approvedAssets.length > 0 ? "approved" : "pending"} />
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <span className="text-sm text-[var(--workspace-copy-body)]">
                  Nachweise für die Übergabe vorhanden
                </span>
                <StatusPill
                  value={storageCoverage === approvedAssets.length && approvedAssets.length > 0 ? "approved" : "pending"}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {commercialReady ? (
                <Link
                  href={brandsWorkspaceRoutes.pilotRequest({ campaignId: campaign.id })}
                  className="workspace-button workspace-button-primary"
                >
                  Kommerziellen Schritt starten
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : demo.isReadOnly ? (
                <div className="workspace-button workspace-button-disabled">
                  Pilot-Anfrage in der Demo deaktiviert
                </div>
              ) : (
                <div className="workspace-button workspace-button-secondary workspace-button-disabled">
                  Noch nicht bereit für den Piloten
                </div>
              )}
              <Link
                href={brandsWorkspaceRoutes.campaigns.review(campaign.id)}
                className="workspace-button workspace-button-secondary"
              >
                Freigabe erneut prüfen
              </Link>
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
              {demo.isReadOnly
                ? demo.mutationMessage
                : commercialReady
                  ? "Alle sichtbaren Nachweise sprechen für einen belastbaren kommerziellen Anschluss."
                  : "Der kommerzielle Schritt bleibt nachrangig, bis Freigaben und Übergabe-Nachweise sauber stehen."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
