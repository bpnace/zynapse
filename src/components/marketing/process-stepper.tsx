import { SectionHeading } from "@/components/ui/section-heading";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { processSteps } from "@/lib/content/site";

function AiSparkleMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-[var(--accent-strong)] opacity-75"
      fill="currentColor"
      viewBox="-0.75 -0.75 16 16"
    >
      <path d="M5.9286875 9.608666666666666 5.4375 11.328125l-0.49118749999999994 -1.7194583333333333a2.71875 2.71875 0 0 0 -1.8668749999999998 -1.8668749999999998L1.359375 7.25l1.7194583333333333 -0.49118749999999994a2.71875 2.71875 0 0 0 1.8668749999999998 -1.8668749999999998L5.4375 3.171875l0.49118749999999994 1.7194583333333333a2.71875 2.71875 0 0 0 1.8668749999999998 1.8668749999999998L9.515625 7.25l-1.7194583333333333 0.49118749999999994a2.71875 2.71875 0 0 0 -1.8668749999999998 1.8668749999999998Zm5.102791666666667 -4.343354166666667L10.875 5.890625l-0.15647916666666667 -0.6253124999999999a2.0390625 2.0390625 0 0 0 -1.4832291666666666 -1.4838333333333331L8.609375 3.625l0.6259166666666667 -0.15647916666666667a2.0390625 2.0390625 0 0 0 1.4832291666666666 -1.4838333333333331L10.875 1.359375l0.15647916666666667 0.6253124999999999a2.0390625 2.0390625 0 0 0 1.4838333333333331 1.4838333333333331L13.140625 3.625l-0.6253124999999999 0.15647916666666667a2.0390625 2.0390625 0 0 0 -1.4838333333333331 1.4838333333333331Zm-0.8246874999999999 7.160583333333333L9.96875 13.140625l-0.23804166666666665 -0.7147291666666666a1.359375 1.359375 0 0 0 -0.8597291666666667 -0.8597291666666667L8.15625 11.328125l0.7147291666666666 -0.23804166666666665a1.359375 1.359375 0 0 0 0.8597291666666667 -0.8597291666666667l0.23804166666666665 -0.7147291666666666 0.23804166666666665 0.7147291666666666a1.359375 1.359375 0 0 0 0.8597291666666667 0.8597291666666667l0.7147291666666666 0.23804166666666665 -0.7147291666666666 0.23804166666666665a1.359375 1.359375 0 0 0 -0.8597291666666667 0.8597291666666667Z" />
    </svg>
  );
}

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
