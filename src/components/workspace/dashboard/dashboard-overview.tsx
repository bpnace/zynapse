type DashboardOverviewProps = {
  organizationName: string;
  audience: string | null;
  primaryChannels: string | null;
  packageTier: string | null;
  campaignCount: number;
  assetCount: number;
};

export function DashboardOverview({
  organizationName,
  audience,
  primaryChannels,
  packageTier,
  campaignCount,
  assetCount,
}: DashboardOverviewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-4">
      <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Organisation
        </p>
        <p className="mt-3 text-lg font-medium">{organizationName}</p>
      </article>
      <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Kampagnen
        </p>
        <p className="mt-3 text-lg font-medium">{campaignCount}</p>
      </article>
      <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Assets
        </p>
        <p className="mt-3 text-lg font-medium">{assetCount}</p>
      </article>
      <article className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
          Package fit
        </p>
        <p className="mt-3 text-lg font-medium">{packageTier ?? "starter"}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--copy-body)]">
          {primaryChannels ?? audience ?? "Seeded workspace context follows with the selected template."}
        </p>
      </article>
    </section>
  );
}
