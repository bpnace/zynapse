import { SectionHeading } from "@/components/ui/section-heading";
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
            Drei Schritte. Ein{" "}
            <span className="title-accent">Zynapse-Core-Prozess</span>.
          </>
        }
        copy="Zynapse Core übersetzt Briefing und Material in klare Kreativrouten, geführte Aufgaben und geprüfte Varianten für euer Media Team."
      />
      <div className="grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)] lg:grid-cols-3">
        {processSteps.map((step, index) => (
          <article
            key={step.title}
            className={`flex min-h-[15rem] flex-col p-5 sm:p-6 ${
              index > 0 ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l" : ""
            } border-[rgba(56,67,84,0.14)] ${
              step.title === "Zynapse Core"
                ? "bg-[linear-gradient(135deg,#2f3745_0%,var(--accent-strong)_46%,#f0a84d_100%)] text-white"
                : "bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] ${
                  step.title === "Zynapse Core" ? "text-white" : "text-[var(--copy-strong)]"
                }`}
              >
                0{index + 1}
              </span>
              <span
                className={`max-w-[7rem] text-right font-mono text-[10px] leading-tight tracking-[0.14em] uppercase ${
                  step.title === "Zynapse Core" ? "text-white/58" : "text-[var(--copy-soft)]"
                }`}
              >
                {step.owner}
              </span>
            </div>
            <h3
              className={`mt-6 font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] ${
                step.title === "Zynapse Core" ? "text-white" : "text-[var(--copy-strong)]"
              }`}
            >
              {step.title}
            </h3>
            <p
              className={`mt-4 text-[0.975rem] leading-[1.65] ${
                step.title === "Zynapse Core" ? "text-white/74" : "text-[color:var(--copy-body)]"
              }`}
            >
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
