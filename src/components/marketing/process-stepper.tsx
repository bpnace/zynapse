import { SectionHeading } from "@/components/ui/section-heading";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { AiSparkleMark } from "@/components/ui/ai-sparkle-mark";
import { processSteps } from "@/lib/content/site";

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
            Vom Briefing zum{" "}
            <span className="title-accent">testbaren Creative Pack</span>.
          </>
        }
        copy="Der Sprint bleibt bewusst auf drei Schritte reduziert, damit euer Team nicht in Prozessdetails hängen bleibt. Ihr liefert Richtung und vorhandenes Material, Zynapse Core übersetzt daraus testbare Szenarien und am Ende steht ein Paket, das nicht erst intern zusammengesucht werden muss."
      />
      <div className="grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)] lg:grid-cols-3">
        {processSteps.map((step, index) => {
          const isAiStep = index === 1;

          return (
            <article
              key={step.title}
              className={`flex min-h-[15rem] flex-col p-5 sm:p-6 ${
                index > 0 ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l" : ""
              } border-[rgba(56,67,84,0.14)] ${
                isAiStep
                  ? "bg-[linear-gradient(180deg,rgba(255,249,239,0.92),rgba(255,255,255,0.98))] ring-1 ring-inset ring-[rgba(246,107,76,0.16)]"
                  : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                  0{index + 1}
                </span>
                <span className="flex max-w-[7rem] items-center justify-end gap-1 text-right font-mono text-[10px] leading-tight tracking-[0.14em] text-[var(--copy-soft)] uppercase">
                  <span>{step.owner}</span>
                  {isAiStep ? <AiSparkleMark /> : null}
                </span>
              </div>
              <h3 className="mt-6 font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                {step.title}
              </h3>
              <p className="mt-4 text-[0.975rem] leading-[1.65] text-[color:var(--copy-body)]">
                <BoldZynapseCore>{step.description}</BoldZynapseCore>
              </p>
            </article>
          );
        })}
      </div>
      <p className="border-t border-[rgba(56,67,84,0.12)] pt-6 text-base leading-7 text-[color:var(--copy-body)]">
        Pilot-Sprints laufen typisch über drei Wochen. Der Zeitraum reicht, um
        aus einem kompakten Briefing erste Kreativrichtungen zu entwickeln,
        Feedback in einer zentralen Runde zu bündeln und die finalen Varianten
        sauber für Paid Social zu übergeben.
      </p>
    </section>
  );
}
