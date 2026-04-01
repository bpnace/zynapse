type CampaignSummaryProps = {
  campaignName: string;
  campaignGoal: string;
  packageTier: string;
  currentStage: string;
};

export function CampaignSummary({
  campaignName,
  campaignGoal,
  packageTier,
  currentStage,
}: CampaignSummaryProps) {
  return (
    <section className="rounded-[1.9rem] border border-[rgba(224,94,67,0.14)] bg-[rgba(255,245,238,0.78)] p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-soft)]">
            Current campaign
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
            {campaignName}
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--copy-body)]">
            {campaignGoal}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="rounded-full border border-[rgba(224,94,67,0.16)] bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--accent-soft)]">
            {packageTier}
          </span>
          <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--copy-muted)]">
            {currentStage}
          </span>
        </div>
      </div>
    </section>
  );
}
