import { SectionHeading } from "@/components/ui/section-heading";

const coreSteps = [
  {
    title: "Briefing und Material verdichten",
    description:
      "Website, Produkt, Zielgruppe, Markenregeln und vorhandene Assets werden zu einem belastbaren Arbeitskontext zusammengeführt.",
  },
  {
    title: "Routen, Rollen und Aufgaben führen",
    description:
      "Zynapse Core bündelt Kreativrouten, passende Rollen und klare Aufgaben, damit aus dem Briefing ein steuerbarer Arbeitsfluss wird.",
  },
  {
    title: "Review und Delivery absichern",
    description:
      "Varianten werden auf Markenfit, Format, Verständlichkeit und nächste Schritte geprüft, bevor sie in die Übergabe gehen.",
  },
];

export function CoreSection() {
  return (
    <section
      id="zynapse-core"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Zynapse Core"
        title={
          <>
            Zynapse Core macht aus Ideen einen{" "}
            <span className="title-accent">geführten Kreativprozess</span>.
          </>
        }
        copy="Nicht ein Tool neben eurem Prozess, sondern der geführte Ablauf von Briefing und vorhandenem Material bis zu Review, Qualitätssicherung und Delivery."
      />
      <div className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)]">
        <div className="grid lg:grid-cols-3">
        {coreSteps.map((step, index) => (
          <article
            key={step.title}
            className={`relative p-5 sm:p-6 ${
              index > 0 ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l" : ""
            } border-[rgba(56,67,84,0.14)] ${
              index === 1
                ? "bg-[linear-gradient(135deg,#2f3745_0%,var(--accent-strong)_46%,#f0a84d_100%)] text-white"
                : "bg-white"
            }`}
          >
            <span
              className={`font-mono text-[10px] tracking-[0.16em] uppercase ${
                index === 1 ? "text-white/56" : "text-[var(--copy-soft)]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className={`mt-5 font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] ${
                index === 1 ? "text-white" : "text-[var(--copy-strong)]"
              }`}
            >
              {step.title}
            </h3>
            <p
              className={`mt-3 text-sm leading-6 ${
                index === 1 ? "text-white/74" : "text-[color:var(--copy-body)]"
              }`}
            >
              {step.description}
            </p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
