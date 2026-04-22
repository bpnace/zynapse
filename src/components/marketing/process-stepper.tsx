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
      id="ablauf"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Ablauf"
        title={
          <>
            Vom <span data-animate-word>Kampagnenziel</span> zum fertigen{" "}
            <span className="title-accent">Creative Pack</span>.
          </>
        }
        copy="Ihr gebt Ziel, Produkt, Zielgruppe und Markenregeln vor. Zynapse Core macht daraus einen klaren Kreativplan und führt den Prozess bis zu geprüften Varianten für euer Media Team."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className={`section-card section-surface-contrast flex flex-col rounded-[var(--radius-card)] p-5 ${stepAccentClasses[index % stepAccentClasses.length]}`}
          >
            <div className="flex h-10 items-center justify-between gap-2">
              <span className="font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                0{index + 1}
              </span>
              <span className="max-w-[6rem] rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.14)] bg-[rgba(255,255,255,0.78)] px-2.5 py-1 text-end font-mono text-[10px] leading-tight tracking-[0.14em] uppercase text-[var(--copy-soft)]">
                {step.owner}
              </span>
            </div>
            <h3 className="mt-4 flex h-[3.9rem] items-start font-display text-[1.25rem] leading-[1.15] font-semibold tracking-[-0.035em] text-[var(--copy-strong)]">
              {step.title}
            </h3>
            <p className="mt-2 text-[0.975rem] leading-[1.65] text-[color:var(--copy-body)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
