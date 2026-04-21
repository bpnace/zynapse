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
  const approvedCount = assets.filter((asset) => asset.reviewStatus === "approved").length;
  const openThreadCount =
    selectedAsset?.threads.filter((thread) => !thread.resolvedAt).length ?? 0;
  const resolvedThreadCount =
    selectedAsset?.threads.filter((thread) => thread.resolvedAt).length ?? 0;
  const totalCommentCount =
    selectedAsset?.threads.reduce((sum, thread) => sum + thread.comments.length, 0) ?? 0;

  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="workspace-section-label">Freigaberaum</span>
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
                Hier wird entschieden, welche Variante tragfähig genug für die
                Übergabe ist und wo noch Präzision oder Korrektur nötig bleibt.
              </p>
            </div>
            <div className="workspace-stat-strip">
              <span className="workspace-stat-chip">
                {attentionCount} offen
              </span>
              <span className="workspace-stat-chip">
                {approvedCount} freigegeben
              </span>
              <span className="workspace-stat-chip">
                {openThreadCount} Diskussion{openThreadCount === 1 ? "" : "en"} aktiv
              </span>
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
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.18fr)_minmax(320px,0.86fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="workspace-section-label">Entscheidungsqueue</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Varianten im Fokus
              </h2>
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
                        {formatWorkspaceLabel(asset.latestCommentType)}
                      </span>
                    ) : (
                      <span>Ohne Signal</span>
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
                  <p className="workspace-section-label">Ausgewählte Variante</p>
                  <StatusPill value={selectedAsset.reviewStatus} />
                </div>
                <h2 className="font-display text-[1.95rem] leading-[1.02] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
                  {selectedAsset.title}
                </h2>
                <div className="workspace-meta-row">
                  <span>{formatWorkspaceAssetType(selectedAsset.assetType)}</span>
                  {selectedAsset.format ? <span>{selectedAsset.format}</span> : null}
                  {selectedAsset.versionLabel ? <span>{selectedAsset.versionLabel}</span> : null}
                  <span>Erfasst am {formatWorkspaceDate(selectedAsset.createdAt)}</span>
                </div>
              </div>

              <div className="workspace-stat-strip">
                <span className="workspace-stat-chip">
                  {selectedAsset.threads.length} Threads
                </span>
                <span className="workspace-stat-chip">
                  {totalCommentCount} Kommentare
                </span>
                {selectedAsset.storagePath ? (
                  <span className="workspace-stat-chip">Storage erfasst</span>
                ) : null}
                {selectedAsset.thumbnailPath ? (
                  <span className="workspace-stat-chip">Thumbnail erfasst</span>
                ) : null}
              </div>

              <div className="workspace-panel-muted px-4 py-4">
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
                    Vorschau, Entscheidung und Verlauf bleiben an derselben
                    Variante verankert.
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
              <p className="workspace-section-label">Ausgewählte Variante</p>
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                Aktuell steht noch keine Variante für die Freigabe bereit.
              </p>
            </div>
          )}
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Verlauf</p>
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
              href={brandsWorkspaceRoutes.home()}
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
