import Link from "next/link";
import { ArrowRight, FileImage, FileVideo } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { ReviewMutationPanel } from "@/components/workspace/review/review-mutation-panel";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";
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

export function ReviewRoom({
  campaign,
  assets,
  selectedAsset,
  canReview,
  demo,
}: ReviewRoomProps) {
  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Review</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                Prüft ein Asset nach dem anderen, haltet Entscheidungen sichtbar
                und bringt die Kampagne voran, ohne Kontext zu verlieren.
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
            <Link
              href={`/workspace/campaigns/${campaign.id}/handover`}
              className="workspace-button workspace-button-secondary"
            >
              Übergabe öffnen
            </Link>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{campaign.packageTier}</span>
            <span>{assets.length} reviewbare {assets.length === 1 ? "Asset" : "Assets"}</span>
            <span>{assets.filter((asset) => asset.reviewStatus === "changes_requested").length} mit offenen Änderungen</span>
            {demo.isDemoWorkspace ? <span>{demo.shellBadge}</span> : null}
          </div>
          <div className="mt-3">
            <StatusPill value={campaign.currentStage} tone="accent" />
          </div>
          {demo.isDemoWorkspace ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
              {demo.mutationMessage}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.15fr)_minmax(340px,0.95fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="workspace-section-label">Assets</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Assets aktuell im Review
              </h2>
            </div>
            <p className="text-sm text-[var(--workspace-copy-muted)]">{assets.length} {assets.length === 1 ? "Eintrag" : "Einträge"}</p>
          </div>

          <div className="mt-5 workspace-split-list">
            {assets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;

              return (
                <Link
                  key={asset.id}
                  href={`/workspace/campaigns/${campaign.id}/review?asset=${asset.id}`}
                  className={isSelected ? "block border-l-2 border-[var(--workspace-copy-strong)] py-4 pl-3" : "block border-l-2 border-transparent py-4 pl-3"}
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
                    <span>{asset.threadCount} {asset.threadCount === 1 ? "Diskussion" : "Diskussionen"}</span>
                    {asset.latestCommentType ? (
                      <span className="truncate">{formatWorkspaceLabel(asset.latestCommentType)}</span>
                    ) : (
                      <span>Noch kein Feedback</span>
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
                  <p className="workspace-section-label">Ausgewähltes Asset</p>
                  <StatusPill value={selectedAsset.reviewStatus} />
                </div>
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                  {selectedAsset.title}
                </h2>
                <div className="workspace-meta-row">
                  <span>{formatWorkspaceAssetType(selectedAsset.assetType)}</span>
                  {selectedAsset.format ? <span>{selectedAsset.format}</span> : null}
                  {selectedAsset.versionLabel ? <span>{selectedAsset.versionLabel}</span> : null}
                  <span>Hinzugefügt am {formatWorkspaceDate(selectedAsset.createdAt)}</span>
                </div>
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
                      Vorschau des ausgewählten Assets
                    </span>
                  </div>
                  <WorkspaceAssetPreview
                    data-testid="review-selected-asset-preview"
                    assetType={selectedAsset.assetType}
                    title={selectedAsset.title}
                    previewUrl={selectedAsset.previewUrl}
                    posterUrl={selectedAsset.posterUrl}
                    controls={selectedAsset.assetType.includes("video")}
                    className="flex aspect-[16/10] items-center justify-center rounded-[10px] border border-dashed border-[var(--workspace-line)] bg-[rgba(255,255,255,0.55)] px-5 py-5"
                    mediaClassName="aspect-[16/10] w-full rounded-[10px] border border-[var(--workspace-line)] bg-black object-cover"
                    fallbackClassName="flex aspect-[16/10] items-center justify-center rounded-[10px] border border-dashed border-[var(--workspace-line)] bg-[rgba(255,255,255,0.55)] px-5 py-5 text-center"
                  />
                  <p className="max-w-xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                    Behaltet das Asset im Blick, während ihr rechts Kommentare
                    und Entscheidungen bearbeitet.
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
                href={`/workspace/campaigns/${campaign.id}/handover`}
                className="workspace-button workspace-button-secondary"
              >
                Übergabe prüfen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="workspace-section-label">Ausgewähltes Asset</p>
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                Aktuell ist noch kein Asset für das Review verfügbar.
              </p>
            </div>
          )}
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Kommentare</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
              Review-Verlauf
            </h2>
          </div>

          {selectedAsset && selectedAsset.threads.length > 0 ? (
            <div className="mt-5 workspace-split-list">
              {selectedAsset.threads.map((thread) => (
                <article key={thread.threadId} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        Erstellt von {formatWorkspaceRole(thread.createdBy)}
                      </p>
                      <div className="workspace-meta-row">
                        {thread.anchor?.timecode ? <span>{thread.anchor.timecode}</span> : null}
                        {thread.anchor?.focus ? <span>{thread.anchor.focus}</span> : null}
                        {thread.resolvedAt ? <span>Geschlossen</span> : <span>Offen</span>}
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
                Für das ausgewählte Asset wurde noch kein Feedback erfasst.
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
            <Link href="/workspace" className="workspace-button workspace-button-secondary">
              Zurück zur Übersicht
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
