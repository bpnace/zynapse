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
    <section className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/70 p-6">
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Review preview
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
          What your team would review here
        </h2>
      </div>

      {threads.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--copy-body)]">
          Noch keine Review-Spuren vorhanden.
        </p>
      ) : (
        <div className="mt-5 grid gap-4">
          {threads.map((thread) => {
            const latestComment = thread.comments[0];

            return (
              <article
                key={thread.threadId}
                className="rounded-[1.3rem] border border-[color:var(--line)] bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--copy-strong)]">
                    {thread.assetTitle}
                  </p>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                    {thread.createdBy}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--copy-body)]">
                  {latestComment?.body}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                  {latestComment?.commentType}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
