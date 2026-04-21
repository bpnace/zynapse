import { MessageSquareText } from "lucide-react";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceRole } from "@/lib/workspace/formatting";

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
        <p className="workspace-section-label">Heute relevant</p>
        <h2 className="font-display text-[1.7rem] leading-[1.06] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
          Rückmeldungen, die die Freigabe gerade bewegen
        </h2>
      </div>

      {threads.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--workspace-copy-body)]">
          Bisher ist noch kein Feedback eingegangen. Sobald Kommentare
          vorliegen, siehst du hier die neuesten Signale aus der Freigabe.
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
                        Gestartet von {formatWorkspaceRole(thread.createdBy)}
                      </p>
                    </div>
                  </div>
                  <StatusPill value={latestComment?.commentType ?? "comment"} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--workspace-copy-body)]">
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
