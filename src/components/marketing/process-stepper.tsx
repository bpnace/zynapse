import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/lib/content/site";

export function ProcessStepper() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="So funktioniert es"
        title="Ein horizontaler Produktionsprozess mit klarer Delegationslogik."
        copy="Brands liefern Kontext und Freigaben. Manager liefern Kampagnenlogik, Hooks und Struktur. Das System liefert Skalierung, Varianten und Formate."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className="section-card rounded-[1.6rem] p-5"
            data-animate-item
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--accent)]">
                0{index + 1}
              </span>
              <span className="rounded-full border border-[color:var(--line)] px-3 py-1 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-muted)]">
                {step.owner}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[color:var(--copy-muted)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
