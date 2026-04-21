import { StatusPill } from "@/components/workspace/dashboard/status-pill";

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
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Feedback</span>
            <span className="workspace-stat-chip">{revisions.length} offene Punkte</span>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-[2.05rem] leading-[1] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              Offene Revisionen und Rückfragen
            </h1>
            <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
              Diese Ansicht bündelt die Punkte, die noch präzisiert, überarbeitet oder für die nächste Submission geklärt werden müssen.
            </p>
          </div>
        </div>
      </section>

      {revisions.length === 0 ? (
        <section className="workspace-panel px-6 py-6">
          <p className="workspace-section-label">Revision queue</p>
          <h2 className="mt-3 font-display text-[1.7rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
            Keine offenen Revisionen
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
            Aktuell ist kein offener Änderungsbedarf für deine zugewiesenen Kampagnen erfasst.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {revisions.map((revision) => (
            <article key={revision.id} className="workspace-panel px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="workspace-section-label">
                    {revision.campaign?.name ?? "Campaign"} · {revision.asset?.title ?? "Asset"}
                  </p>
                  <h2 className="font-display text-[1.65rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                    {revision.title}
                  </h2>
                </div>
                <StatusPill value={revision.priority} />
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--workspace-copy-body)]">
                {revision.detail}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
