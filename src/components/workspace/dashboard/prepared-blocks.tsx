type PreparedBlocksProps = {
  prepared: string;
  review: string;
  output: string;
  nextStep: string;
};

export function PreparedBlocks({
  prepared,
  review,
  output,
  nextStep,
}: PreparedBlocksProps) {
  const items = [
    { title: "What Zynapse already prepared for you", copy: prepared },
    { title: "What your team would review here", copy: review },
    { title: "What you receive at handover", copy: output },
    { title: "What happens if you start a paid pilot", copy: nextStep },
  ];

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/70 p-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
            {item.title}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--copy-body)]">
            {item.copy}
          </p>
        </article>
      ))}
    </section>
  );
}
