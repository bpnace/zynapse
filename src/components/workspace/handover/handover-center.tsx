import Link from "next/link";
import { ArrowRight, FileImage, FileVideo, FolderOutput } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";
import {
  formatWorkspaceAssetType,
  formatWorkspaceLabel,
} from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";

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
  const commercialReady =
    !demo.isReadOnly &&
    approvedAssets.length > 0 &&
    (campaign.currentStage === "approved" || campaign.currentStage === "handover_ready");

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Übergabeprotokoll</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                Diese Ansicht dokumentiert, was freigegeben ist, wie die
                Varianten referenziert werden und ob der nächste
                kommerzielle Schritt belastbar vorbereitet ist.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={`/workspace/campaigns/${campaign.id}/review`}
              className="workspace-button workspace-button-secondary"
            >
              Zurück zur Freigabe
            </Link>
            {commercialReady ? (
              <Link
                href={`/workspace/pilot-request?campaignId=${campaign.id}`}
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

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{formatWorkspaceLabel(campaign.packageTier)}</span>
            <span>{approvedAssets.length} freigegebene Varianten</span>
            <span>{groupedAssets.length} Übergabegruppen</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Freigabegrad</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {approvedAssets.length}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Freigegebene Varianten
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Quellenlage</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {sourceCoverage}/{approvedAssets.length}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Varianten mit dokumentierter Herkunft
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Referenzen</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {storageCoverage}/{approvedAssets.length}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Speicherpfade für die Übergabe hinterlegt
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Pilot-Bereitschaft</p>
              <div className="mt-2">
                <StatusPill
                  value={commercialReady ? "approved" : "pending"}
                  tone="accent"
                />
              </div>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Abgeleitet aus Freigaben und Kampagnenstatus
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Freigegebene Varianten</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Übergabepaket nach Kanal und Format
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Jede Variante bleibt mit Quelle,
                Referenzen und Hinweisen zur Übergabe sichtbar.
              </p>
            </div>

            {groupedAssets.length > 0 ? (
              <div className="mt-5 workspace-split-list">
                {groupedAssets.map((group) => (
                  <section key={group.label} className="py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="workspace-section-label">{group.label}</p>
                      <p className="text-sm text-[var(--workspace-copy-muted)]">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "Eintrag" : "Einträge"}
                      </p>
                    </div>
                    <div className="mt-3 workspace-split-list">
                      {group.items.map((asset) => (
                        <article key={asset.id} className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="overflow-hidden border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)]">
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
                                  Freigabe liegt vor. Diese Variante bleibt
                                  für Übergabe, Rückfragen und kommerzielle
                                  Anschlussarbeit referenzierbar.
                                </p>
                              </div>
                            </div>
                            <StatusPill value="approved" />
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="workspace-section-label">Quelle</p>
                              <p className="mt-2 text-sm text-[var(--workspace-copy-body)]">
                                {asset.source ?? "Noch keine Quelle dokumentiert"}
                              </p>
                            </div>
                            <div>
                              <p className="workspace-section-label">Speicherreferenz</p>
                              <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                                {asset.storagePath ?? "Noch kein Pfad hinterlegt"}
                              </p>
                            </div>
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
                  href={`/workspace/campaigns/${campaign.id}/review`}
                  className="workspace-button workspace-button-secondary"
                >
                  Freigabe erneut öffnen
                </Link>
              </div>
            )}
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Referenzprotokoll</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Storage-, Preview- und Quellenlage
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              {approvedAssets.map((asset) => (
                <article key={asset.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="overflow-hidden border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)]">
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
                        Die Freigabe ist erteilt. Die Referenzen unten
                        dokumentieren, worauf Übergabe und spätere Nutzung
                        verweisen.
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
              Live-Downloads bleiben bewusst außerhalb dieser Ansicht. Diese
              Seite dokumentiert Referenzen und Nachweise, nicht
              die finale Versandautomatisierung.
            </p>
          </section>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Vertrauenscenter</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Nutzung, Rechte und Übergabe-Sicherheit
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
                {completedStages}/{stageItems.length} Stufen haben einen
                belastbaren Arbeitsstand.
              </p>
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Kommerzieller nächster Schritt</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
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
                  href={`/workspace/pilot-request?campaignId=${campaign.id}`}
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
                href={`/workspace/campaigns/${campaign.id}/review`}
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
