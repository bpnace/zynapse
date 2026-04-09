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
      <p className="workspace-section-label">Decision point</p>
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
          Continue with current campaign
          <ArrowRight className="h-4 w-4" />
        </a>
        <button
          type="button"
          className="workspace-button workspace-button-disabled"
          disabled
          title="Pilot request flow lands in the next redesign slice."
        >
          Request paid pilot
        </button>
        {briefHref ? (
          <a href={briefHref} className="workspace-button workspace-button-secondary">
            Create real brief
          </a>
        ) : null}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--workspace-copy-muted)]">
        Pilot request remains part of the roadmap and stays intentionally visible,
        but the functional flow is left for the next slice.
      </p>
    </section>
  );
}
