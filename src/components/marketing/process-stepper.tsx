import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/lib/content/site";

const stepAccentClasses = [
  "border-t-[3px] border-t-[rgba(224,94,67,0.28)]",
  "border-t-[3px] border-t-[rgba(56,67,84,0.22)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
  "border-t-[3px] border-t-[rgba(156,244,215,0.28)]",
  "border-t-[3px] border-t-[rgba(185,178,255,0.28)]",
] as const;

export function ProcessStepper() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="So arbeitet Zynapse"
        title="Ein Produktionsfluss, der Rollen klärt und Creative beschleunigt."
        accent="Creative beschleunigt"
        copy="Das Team liefert Kontext und Freigaben. Der Manager führt Kampagnenlogik und Testing. Das Studio skaliert daraus Varianten, die schneller geprüft und ausgespielt werden können."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className={`section-card section-surface-contrast rounded-[var(--radius-card)] p-5 ${stepAccentClasses[index % stepAccentClasses.length]}`}
            data-animate-item
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[2rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                0{index + 1}
              </span>
              <span className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.14)] bg-[rgba(255,255,255,0.78)] px-2.5 py-1 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                {step.owner}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[1.35rem] leading-[1] font-semibold tracking-[-0.035em] text-[var(--copy-strong)]">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-[color:var(--copy-body)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
