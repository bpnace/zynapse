import { MessageSquareText } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type ReviewThreadPreviewItem = {
  threadId: string;
  assetTitle: string;
  createdBy: string;
  comments: {
    body: string;
    commentType: string;
    createdAt: Date;
  }[];
};

type ReviewThreadsPreviewProps = {
  threads: ReviewThreadPreviewItem[];
};

export function ReviewThreadsPreview({
  threads,
}: ReviewThreadsPreviewProps) {
  return (
    <section id="review-queue" className="workspace-panel px-5 py-5">
      <div className="space-y-2">
        <p className="workspace-section-label">Review queue</p>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
          Open stakeholder threads
        </h2>
      </div>

      {threads.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
          No review threads are visible yet.
        </p>
      ) : (
        <div className="mt-5 workspace-split-list">
          {threads.map((thread) => {
            const latestComment = thread.comments[0];

            return (
              <article
                key={thread.threadId}
                className="py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <MessageSquareText className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                        {thread.assetTitle}
                      </p>
                      <p className="mt-1 text-sm text-[var(--workspace-copy-muted)]">
                        Started by {thread.createdBy.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>
                  <StatusPill value={latestComment?.commentType ?? "comment"} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
                  {latestComment?.body}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
