import { ArrowRight } from "lucide-react";

type NextActionCardProps = {
  campaignId?: string | null;
  briefHref?: string;
  title: string;
  body: string;
};

export function NextActionCard({
  campaignId,
  briefHref,
  title,
  body,
}: NextActionCardProps) {
  return (
    <section className="workspace-panel px-5 py-5">
      <p className="workspace-section-label">Next allowed action</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--workspace-copy-strong)]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
        {body}
      </p>
      <div className="mt-5 border-t border-[var(--workspace-line)] pt-4">
        <div className="grid gap-3">
          <a
            href={campaignId ? `/workspace/campaigns/${campaignId}` : "#campaign-focus"}
            className="workspace-button workspace-button-primary"
          >
            Continue in workstream
            <ArrowRight className="h-4 w-4" />
          </a>
          {briefHref ? (
            <a href={briefHref} className="workspace-button workspace-button-secondary">
              Create briefing
            </a>
          ) : null}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
        Commercial handoff should only follow once review is clear and delivery
        readiness is visible.
      </p>
    </section>
  );
}
