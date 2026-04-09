import Link from "next/link";
import { ArrowRight, FileImage, FileVideo } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { ReviewMutationPanel } from "@/components/workspace/review/review-mutation-panel";

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
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatRole(value: string) {
  return value.replaceAll("_", " ");
}

export function ReviewRoom({
  campaign,
  assets,
  selectedAsset,
  canReview,
}: ReviewRoomProps) {
  return (
    <div className="grid gap-4">
      <section className="workspace-topbar px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <p className="workspace-section-label">Review room</p>
            <div className="space-y-1">
              <h1 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-[var(--workspace-copy-body)]">
                Review is structured around one selected asset, its open threads,
                and the approval decision that moves the seeded campaign forward.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={`/workspace/campaigns/${campaign.id}`}
              className="workspace-button workspace-button-secondary"
            >
              Back to campaign
            </Link>
            <Link
              href={`/workspace/campaigns/${campaign.id}/handover`}
              className="workspace-button workspace-button-secondary"
            >
              View handover center
            </Link>
          </div>
        </div>

        <div className="mt-4 border-t border-[var(--workspace-line)] pt-4">
          <div className="workspace-meta-row">
            <span>{campaign.packageTier}</span>
            <span>{assets.length} reviewable {assets.length === 1 ? "asset" : "assets"}</span>
            <span>{assets.filter((asset) => asset.reviewStatus === "changes_requested").length} with open changes</span>
          </div>
          <div className="mt-3">
            <StatusPill value={campaign.currentStage} tone="accent" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.15fr)_minmax(340px,0.95fr)]">
        <section className="workspace-panel px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="workspace-section-label">Assets</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                Review queue
              </h2>
            </div>
            <p className="text-sm text-[var(--workspace-copy-muted)]">{assets.length} items</p>
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
                        <span>{asset.assetType}</span>
                        {asset.format ? <span>{asset.format}</span> : null}
                        {asset.versionLabel ? <span>{asset.versionLabel}</span> : null}
                      </div>
                    </div>
                    <StatusPill value={asset.reviewStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[var(--workspace-copy-muted)]">
                    <span>{asset.threadCount} {asset.threadCount === 1 ? "thread" : "threads"}</span>
                    {asset.latestCommentType ? (
                      <span className="truncate">{asset.latestCommentType.replaceAll("_", " ")}</span>
                    ) : (
                      <span>No comments yet</span>
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
                  <p className="workspace-section-label">Selected asset</p>
                  <StatusPill value={selectedAsset.reviewStatus} />
                </div>
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                  {selectedAsset.title}
                </h2>
                <div className="workspace-meta-row">
                  <span>{selectedAsset.assetType}</span>
                  {selectedAsset.format ? <span>{selectedAsset.format}</span> : null}
                  {selectedAsset.versionLabel ? <span>{selectedAsset.versionLabel}</span> : null}
                  <span>Added {formatDate(selectedAsset.createdAt)}</span>
                </div>
              </div>

              <div className="workspace-panel-muted px-4 py-4">
                <div className="aspect-[16/10] rounded-[10px] border border-dashed border-[var(--workspace-line)] bg-[rgba(255,255,255,0.55)] px-5 py-5">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center gap-2 text-[var(--workspace-copy-muted)]">
                      {selectedAsset.assetType.includes("video") ? (
                        <FileVideo className="h-4 w-4" />
                      ) : (
                        <FileImage className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        Preview surface
                      </span>
                    </div>
                    <div className="space-y-3">
                      <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
                        {selectedAsset.title}
                      </p>
                      <p className="max-w-xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
                        This slice keeps the review room grounded in the real seeded
                        asset data while using a neutral preview frame instead of a
                        decorative media card.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ReviewMutationPanel
                campaignId={campaign.id}
                assetId={selectedAsset.id}
                canReview={canReview}
              />
              <Link
                href={`/workspace/campaigns/${campaign.id}/handover`}
                className="workspace-button workspace-button-secondary"
              >
                Review delivery surface
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="workspace-section-label">Selected asset</p>
              <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
                No reviewable asset is available for this campaign yet.
              </p>
            </div>
          )}
        </section>

        <section className="workspace-panel px-5 py-5">
          <div className="space-y-2">
            <p className="workspace-section-label">Comments</p>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
              Threaded review history
            </h2>
          </div>

          {selectedAsset && selectedAsset.threads.length > 0 ? (
            <div className="mt-5 workspace-split-list">
              {selectedAsset.threads.map((thread) => (
                <article key={thread.threadId} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        Thread started by {formatRole(thread.createdBy)}
                      </p>
                      <div className="workspace-meta-row">
                        {thread.anchor?.timecode ? <span>{thread.anchor.timecode}</span> : null}
                        {thread.anchor?.focus ? <span>{thread.anchor.focus}</span> : null}
                        {thread.resolvedAt ? <span>Resolved</span> : <span>Open</span>}
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
                              {formatRole(comment.authorId)}
                            </p>
                            <div className="workspace-meta-row">
                              <span>{formatDate(comment.createdAt)}</span>
                              <span>{formatTime(comment.createdAt)}</span>
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
                No persisted threads are available for the selected asset.
              </p>
            </div>
          )}

          <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
            <Link href="/workspace" className="workspace-button workspace-button-secondary">
              Return to workspace overview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
