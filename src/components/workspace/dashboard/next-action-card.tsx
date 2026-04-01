type NextActionCardProps = {
  title: string;
  body: string;
};

export function NextActionCard({ title, body }: NextActionCardProps) {
  return (
    <section className="rounded-[1.7rem] border border-[rgba(224,94,67,0.18)] bg-[rgba(255,245,238,0.75)] p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-soft)]">
        Next step
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--copy-body)]">
        {body}
      </p>
    </section>
  );
}
