import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";

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
    { title: "Prepared for you", copy: prepared },
    { title: "Review clarity", copy: review },
    { title: "Handover value", copy: output },
    { title: "Paid pilot path", copy: nextStep },
  ];

  return (
    <section className="workspace-panel px-5 py-4">
      <div className="grid gap-4 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={index === 0 ? "min-w-0" : "min-w-0 xl:border-l xl:border-[var(--workspace-line)] xl:pl-4"}
          >
            <p className="workspace-section-label">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--workspace-copy-body)]">
              <BoldZynapseCore>{item.copy}</BoldZynapseCore>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
