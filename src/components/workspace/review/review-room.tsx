import Link from "next/link";
import { ArrowRight, FileImage, FileVideo } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { ReviewMutationPanel } from "@/components/workspace/review/review-mutation-panel";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import {
  formatWorkspaceAssetType,
  formatWorkspaceDate,
  formatWorkspaceLabel,
  formatWorkspaceRole,
  formatWorkspaceTime,
} from "@/lib/workspace/formatting";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";

type ReviewRoomProps = {
  campaign: {
    id: string;
    name: string;
    packageTier: string;
    currentStage: string;
  };
  assets: Array<{
    id: string;
    title: string;
    assetType: string;
    format: string | null;
    versionLabel: string | null;
    reviewStatus: string;
    threadCount: number;
    latestCommentType: string | null;
    previewUrl: string | null;
    posterUrl: string | null;
  }>;
  selectedAsset: {
    id: string;
    title: string;
    assetType: string;
    format: string | null;
    versionLabel: string | null;
    reviewStatus: string;
    storagePath: string | null;
    thumbnailPath: string | null;
    previewUrl: string | null;
    posterUrl: string | null;
    createdAt: Date;
    threads: Array<{
      threadId: string;
      createdBy: string;
      resolvedAt: Date | null;
      anchor: { timecode: string | null; focus: string | null } | null;
      comments: Array<{
        id: string;
        authorId: string;
        body: string;
        commentType: string;
        createdAt: Date;
      }>;
    }>;
  } | null;
  canReview: boolean;
  demo: WorkspaceDemoState;
};

function describeAssetQueueState(reviewStatus: string, threadCount: number) {
  if (reviewStatus === "approved") {
    return "Für die Übergabe vorgemerkt";
  }

  if (reviewStatus === "changes_requested") {
    return threadCount > 0
      ? `${threadCount} offene ${threadCount === 1 ? "Diskussion" : "Diskussionen"}`
      : "Änderungen angefordert";
  }

  return threadCount > 0
    ? `${threadCount} ${threadCount === 1 ? "Diskussion aktiv" : "Diskussionen aktiv"}`
    : "Wartet auf erste Entscheidung";
}

export function ReviewRoom({
  campaign,
  assets,
  selectedAsset,
  canReview,
  demo,
}: ReviewRoomProps) {
  const attentionCount = assets.filter((asset) => asset.reviewStatus !== "approved").length;
  const changeRequestedCount = assets.filter(
    (asset) => asset.reviewStatus === "changes_requested",
  ).length;
  const approvedCount = assets.filter((asset) => asset.reviewStatus === "approved").length;
  const openThreadCount =
    selectedAsset?.threads.filter((thread) => !thread.resolvedAt).length ?? 0;
  const resolvedThreadCount =
    selectedAsset?.threads.filter((thread) => thread.resolvedAt).length ?? 0;
  const totalCommentCount =
    selectedAsset?.threads.reduce((sum, thread) => sum + thread.comments.length, 0) ?? 0;

  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Freigaberaum</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                Diese Ansicht zeigt, was heute entschieden werden muss, welche
                Diskussionen offen sind und welche Variante bereits belastbar für die
                Übergabe ist.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={brandsWorkspaceRoutes.campaigns.detail(campaign.id)}
              className="workspace-button workspace-button-secondary"
            >
              Kampagne öffnen
            </Link>
            <Link
              href={brandsWorkspaceRoutes.campaigns.handover(campaign.id)}
              className="workspace-button workspace-button-secondary"
            >
              Übergabeprotokoll öffnen
            </Link>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{formatWorkspaceLabel(campaign.packageTier)}</span>
            <span>
              {assets.length} {assets.length === 1 ? "Variante" : "Varianten"} in der laufenden Freigabe
            </span>
            <span>
              {changeRequestedCount} mit angeforderten Änderungen
            </span>
            {demo.isDemoWorkspace ? <span>{demo.shellBadge}</span> : null}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Braucht Rückmeldung</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {attentionCount}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Varianten ohne finale Freigabe
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Freigegeben</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {approvedCount}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Bereits für die Übergabe markiert
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Offene Diskussionen</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                {openThreadCount}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                In der aktuell ausgewählten Variante
              </p>
            </div>
            <div className="border border-[var(--workspace-line)] px-3 py-3">
              <p className="workspace-section-label">Kampagnenstatus</p>
              <div className="mt-2">
                <StatusPill value={campaign.currentStage} tone="accent" />
              </div>
              <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                Spiegelt die Freigabereife der Kampagne
              </p>
            </div>
          </div>
          {demo.isDemoWorkspace ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {demo.mutationMessage}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.12fr)_minmax(340px,0.95fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="workspace-section-label">Freigabeübersicht</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Varianten mit Entscheidungsbedarf
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--workspace-copy-muted)]">
                Diese Übersicht priorisiert Änderungsbedarf vor offenen
                Freigaben und zeigt je Variante den letzten belastbaren Signaltyp.
              </p>
            </div>
            <p className="text-sm text-[var(--workspace-copy-muted)]">
              {assets.length} {assets.length === 1 ? "Eintrag" : "Einträge"}
            </p>
          </div>

          <div className="mt-5 workspace-split-list">
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;

              return (
                <Link
                  key={asset.id}
                  href={`${brandsWorkspaceRoutes.campaigns.review(campaign.id)}?asset=${asset.id}`}
                  className={
                    isSelected
                      ? "block border-l-2 border-[var(--workspace-copy-strong)] bg-[rgba(255,255,255,0.35)] py-4 pl-3 pr-1"
                      : "block border-l-2 border-transparent py-4 pl-3 pr-1"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {asset.title}
                      </p>
                      <div className="mt-1 workspace-meta-row">
                        <span>{formatWorkspaceAssetType(asset.assetType)}</span>
                        {asset.format ? <span>{asset.format}</span> : null}
                        {asset.versionLabel ? <span>{asset.versionLabel}</span> : null}
                      </div>
                    </div>
                    <StatusPill value={asset.reviewStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--workspace-copy-muted)]">
                    <span>{describeAssetQueueState(asset.reviewStatus, asset.threadCount)}</span>
                    {asset.latestCommentType ? (
                      <span className="truncate">
                        Letztes Signal: {formatWorkspaceLabel(asset.latestCommentType)}
                      </span>
                    ) : (
                      <span>Kein protokolliertes Signal</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="workspace-panel px-5 py-5">
          {selectedAsset ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="workspace-section-label">Nachweis & Entscheidung</p>
                  <StatusPill value={selectedAsset.reviewStatus} />
                </div>
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                  {selectedAsset.title}
                </h2>
                <div className="workspace-meta-row">
                  <span>{formatWorkspaceAssetType(selectedAsset.assetType)}</span>
                  {selectedAsset.format ? <span>{selectedAsset.format}</span> : null}
                  {selectedAsset.versionLabel ? <span>{selectedAsset.versionLabel}</span> : null}
                  <span>Erfasst am {formatWorkspaceDate(selectedAsset.createdAt)}</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-[var(--workspace-line)] px-3 py-3">
                  <p className="workspace-section-label">Diskussionsstand</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                    {selectedAsset.threads.length}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                    {openThreadCount} offen, {resolvedThreadCount} geschlossen
                  </p>
                </div>
                <div className="border border-[var(--workspace-line)] px-3 py-3">
                  <p className="workspace-section-label">Kommentarspur</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--workspace-copy-strong)]">
                    {totalCommentCount}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--workspace-copy-muted)]">
                    Sichtbar für Freigabe und Übergabe
                  </p>
                </div>
                <div className="border border-[var(--workspace-line)] px-3 py-3">
                  <p className="workspace-section-label">Speicherreferenz</p>
                  <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                    {selectedAsset.storagePath ?? "Noch keine Speicherreferenz hinterlegt"}
                  </p>
                </div>
                <div className="border border-[var(--workspace-line)] px-3 py-3">
                  <p className="workspace-section-label">Thumbnail-Referenz</p>
                  <p className="mt-2 text-sm break-all text-[var(--workspace-copy-body)]">
                    {selectedAsset.thumbnailPath ?? "Noch keine Thumbnail-Referenz hinterlegt"}
                  </p>
                </div>
              </div>

              <div className="border border-[var(--workspace-line)] px-4 py-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[var(--workspace-copy-muted)]">
                    {selectedAsset.assetType.includes("video") ? (
                      <FileVideo className="h-4 w-4" />
                    ) : (
                      <FileImage className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      Vorschau und Nachweis der ausgewählten Variante
                    </span>
                  </div>
                  <WorkspaceAssetPreview
                    data-testid="review-selected-asset-preview"
                    assetType={selectedAsset.assetType}
                    title={selectedAsset.title}
                    previewUrl={selectedAsset.previewUrl}
                    posterUrl={selectedAsset.posterUrl}
                    controls={selectedAsset.assetType.includes("video")}
                    className="flex aspect-[16/10] items-center justify-center border border-dashed border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)] px-5 py-5"
                    mediaClassName="aspect-[16/10] w-full border border-[var(--workspace-line)] bg-black object-cover"
                    fallbackClassName="flex aspect-[16/10] items-center justify-center border border-dashed border-[var(--workspace-line)] bg-[rgba(255,255,255,0.35)] px-5 py-5 text-center"
                  />
                  <p className="max-w-xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    Die Vorschau bleibt neben der Entscheidungsspur sichtbar,
                    damit Freigabe-Kommentare und Übergabe-Referenzen auf
                    dieselbe
                    Variante verweisen.
                  </p>
                </div>
              </div>

              <ReviewMutationPanel
                campaignId={campaign.id}
                assetId={selectedAsset.id}
                canReview={canReview}
                demo={demo}
              />
              <Link
                href={brandsWorkspaceRoutes.campaigns.handover(campaign.id)}
                className="workspace-button workspace-button-secondary"
              >
                Übergabeprotokoll prüfen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="workspace-section-label">Nachweis & Entscheidung</p>
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                Aktuell steht noch keine Variante für die Freigabe bereit.
              </p>
            </div>
          )}
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Entscheidungsprotokoll</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
              Verlauf und Nachweise
            </h2>
            {selectedAsset ? (
              <p className="text-sm leading-6 text-[var(--workspace-copy-muted)]">
                {openThreadCount} offene Diskussionen, {resolvedThreadCount} gelöste
                Diskussionen und {totalCommentCount} protokollierte Kommentare
                für die aktuell ausgewählte Variante.
              </p>
            ) : null}
          </div>

          {selectedAsset && selectedAsset.threads.length > 0 ? (
            <div className="mt-5 workspace-split-list">
              {selectedAsset.threads.map((thread) => (
                <article key={thread.threadId} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        Diskussion von {formatWorkspaceRole(thread.createdBy)}
                      </p>
                      <div className="workspace-meta-row">
                        {thread.anchor?.timecode ? <span>{thread.anchor.timecode}</span> : null}
                        {thread.anchor?.focus ? <span>{thread.anchor.focus}</span> : null}
                        <span>{thread.resolvedAt ? "Geschlossen" : "Offen"}</span>
                        <span>
                          {thread.comments.length}{" "}
                          {thread.comments.length === 1 ? "Kommentar" : "Kommentare"}
                        </span>
                      </div>
                    </div>
                    <StatusPill value={thread.resolvedAt ? "approved" : "in_review"} />
                  </div>

                  <div className="mt-4 workspace-split-list border-t border-[var(--workspace-line)]">
                    {thread.comments.map((comment) => (
                      <div key={comment.id} className="py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[var(--workspace-copy-strong)]">
                              {formatWorkspaceRole(comment.authorId)}
                            </p>
                            <div className="workspace-meta-row">
                              <span>{formatWorkspaceDate(comment.createdAt)}</span>
                              <span>{formatWorkspaceTime(comment.createdAt)}</span>
                            </div>
                          </div>
                          <StatusPill value={comment.commentType} />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                Für die ausgewählte Variante wurde noch kein Feedback erfasst.
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
            <Link
              href={brandsWorkspaceRoutes.overview()}
              className="workspace-button workspace-button-secondary"
            >
              Zurück zur Übersicht
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
