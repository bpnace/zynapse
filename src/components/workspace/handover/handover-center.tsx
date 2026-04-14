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
  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Übergabe</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                Diese Ansicht bündelt freigegebene Assets, Übergabedetails und den
                nächsten kommerziellen Schritt, sobald die Arbeit bereit ist.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={`/workspace/campaigns/${campaign.id}`}
              className="workspace-button workspace-button-secondary"
            >
              Zurück zur Kampagne
            </Link>
            {demo.isReadOnly ? (
              <div className="workspace-button workspace-button-secondary workspace-button-disabled">
                Demo ist schreibgeschützt
              </div>
            ) : (
              <Link
                href={`/workspace/pilot-request?campaignId=${campaign.id}`}
                className="workspace-button workspace-button-secondary"
              >
                Bezahlten Piloten anfragen
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{campaign.packageTier}</span>
            <span>{approvedAssets.length} freigegebene Assets</span>
            <span>{groupedAssets.length} Übergabegruppen</span>
          </div>
          <div className="mt-3">
            <StatusPill value={campaign.currentStage} tone="accent" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <div className="grid gap-4">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Freigegebene Outputs</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Freigegebene Assets für die Übergabe
              </h2>
            </div>

            {groupedAssets.length > 0 ? (
              <div className="mt-5 workspace-split-list">
                {groupedAssets.map((group) => (
                  <section key={group.label} className="py-4">
                    <p className="workspace-section-label">{group.label}</p>
                    <div className="mt-3 workspace-split-list">
                      {group.items.map((asset) => (
                        <article key={asset.id} className="py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="overflow-hidden rounded-[12px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.65)]">
                                <WorkspaceAssetPreview
                                  data-testid={`handover-asset-preview-${asset.id}`}
                                  assetType={asset.assetType}
                                  title={asset.title}
                                  previewUrl={asset.previewUrl}
                                  posterUrl={asset.posterUrl}
                                  autoPlay={asset.assetType.includes("video")}
                                  loop={asset.assetType.includes("video")}
                                  muted={asset.assetType.includes("video")}
                                  className="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.55)]"
                                  mediaClassName="h-[4.75rem] w-[6rem] object-cover"
                                  fallbackClassName="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.55)] px-2 text-center"
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
                            </div>
                            </div>
                            <StatusPill value="approved" />
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
                  Noch keine freigegebenen Assets sind bereit für die Übergabe.
                </p>
                <Link
                  href={`/workspace/campaigns/${campaign.id}/review`}
                  className="workspace-button workspace-button-secondary"
                >
                  Zurück ins Review
                </Link>
              </div>
            )}
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Liefer-Metadaten</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Liefer-Referenzen
              </h2>
            </div>

            <div className="mt-5 workspace-split-list">
              {approvedAssets.map((asset) => (
                <article key={asset.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="overflow-hidden rounded-[12px] border border-[var(--workspace-line)] bg-[rgba(255,255,255,0.65)]">
                      <WorkspaceAssetPreview
                        assetType={asset.assetType}
                        title={asset.title}
                        previewUrl={asset.previewUrl}
                        posterUrl={asset.posterUrl}
                        autoPlay={asset.assetType.includes("video")}
                        loop={asset.assetType.includes("video")}
                        muted={asset.assetType.includes("video")}
                        className="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.55)]"
                        mediaClassName="h-[4.75rem] w-[6rem] object-cover"
                        fallbackClassName="flex h-[4.75rem] w-[6rem] items-center justify-center bg-[rgba(255,255,255,0.55)] px-2 text-center"
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
                        Das Deliverable-Paket ist vorbereitet. Die Referenzen
                        unten bleiben für Übergabe und späteren Austausch sichtbar.
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
                      <p className="workspace-section-label">Thumbnail-Pfad</p>
                      <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                        {asset.thumbnailPath ?? "Kein Thumbnail-Pfad vorhanden"}
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
              Die Liefer-Referenzen sind hier verfügbar. Eine Live-Download-Automatisierung
              ist in diesem Workspace bewusst nicht enthalten.
            </p>
          </section>
        </div>

        <div className="grid gap-4 xl:sticky xl:top-5 xl:self-start">
          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Nutzungs- und Rechteübersicht</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Nutzung und Rechte
              </h2>
            </div>
            <p className="mt-4 text-base font-semibold text-[var(--workspace-copy-strong)]">
              {usageSummary.heading}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {usageSummary.body}
            </p>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Kampagnenhinweise</p>
              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-body)]">
                {campaignNotes ??
                  "Für diese Übergabe liegen noch keine zusätzlichen Lieferhinweise vor."}
              </p>
            </div>

            <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
              <p className="workspace-section-label">Workflow-Status</p>
              <div className="mt-3 workspace-split-list">
                {stageItems.map((stage) => (
                  <div key={stage.stageKey} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-sm text-[var(--workspace-copy-body)]">
                      {formatWorkspaceLabel(stage.stageKey)}
                    </span>
                    <StatusPill value={stage.status} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="workspace-panel px-5 py-5">
            <div className="space-y-2">
              <p className="workspace-section-label">Nächster Schritt</p>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Nächster Schritt
              </h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
              {nextStep ??
                "Nutzt diese Übergabeansicht, um zu entscheiden, ob die Kampagne bereit für einen bezahlten Piloten ist."}
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href={`/workspace/campaigns/${campaign.id}/review`}
                className="workspace-button workspace-button-secondary"
              >
                Zurück ins Review
              </Link>
              {demo.isReadOnly ? (
                <div className="workspace-button workspace-button-disabled">
                  Pilot-Anfrage in der Demo deaktiviert
                </div>
              ) : (
                <Link
                  href={`/workspace/pilot-request?campaignId=${campaign.id}`}
                  className="workspace-button workspace-button-primary"
                >
                  Bezahlten Piloten anfragen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
              {demo.isReadOnly
                ? demo.mutationMessage
                : "Wenn das Deliverable-Paket stimmig ist, schickt die Pilot-Anfrage ab, um in den nächsten kommerziellen Schritt zu gehen."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
