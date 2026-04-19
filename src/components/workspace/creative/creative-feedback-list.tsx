type CreativeFeedbackListProps = {
  revisions: Array<{
    id: string;
    title: string;
    detail: string;
    priority: string;
    campaign: { name: string } | null;
    asset: { title: string } | null;
  }>;
};

export function CreativeFeedbackList({ revisions }: CreativeFeedbackListProps) {
  return (
    <div className="grid gap-4">
      {revisions.length === 0 ? (
        <section className="workspace-panel rounded-[1.6rem] p-6">
          <p className="workspace-eyebrow">Revision queue</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
            No open revision items
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
            Everything assigned to you is either already submitted or waiting for the next ops pass.
          </p>
        </section>
      ) : null}

      {revisions.map((revision) => (
        <article key={revision.id} className="workspace-panel rounded-[1.6rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="workspace-eyebrow">
                {revision.campaign?.name ?? "Campaign"} · {revision.asset?.title ?? "Asset"}
              </p>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                {revision.title}
              </h2>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
              {revision.priority}
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--workspace-copy-muted)]">
            {revision.detail}
          </p>
        </article>
      ))}
    </div>
  );
}
