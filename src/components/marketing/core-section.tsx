import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const coreSteps = [
  {
    title: "Versteht eure Marke",
    description:
      "Zynapse Core liest Website, Produkt, Zielgruppe, Markenregeln und bisherige Assets, damit neue Creatives nicht bei null starten.",
  },
  {
    title: "Plant passende Kreativrouten",
    description:
      "Aus Ziel, Angebot und Kanal entstehen unterschiedliche Richtungen für Hooks, Botschaften, Formate und CTAs.",
  },
  {
    title: "Wählt die richtigen AI Creatives aus",
    description:
      "Nicht jede Kampagne braucht dieselben Rollen. Zynapse Core schlägt vor, welche Kreativrollen für starken Output gebraucht werden.",
  },
  {
    title: "Prüft den Output vor dem Review",
    description:
      "Varianten werden auf Markenfit, Format, Verständlichkeit, Wiederholung und mögliche Risiken geprüft, bevor euer Team sie sieht.",
  },
  {
    title: "Macht Feedback umsetzbar",
    description:
      "Aus Kommentaren werden klare Änderungsaufgaben, damit keine Runde Richtung verliert und das Review nicht im Kreis läuft.",
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
            Zynapse Core führt euer <span data-animate-word>Briefing</span> zum{" "}
            fertigen <span className="title-accent">Creative Pack</span>.
          </>
        }
        copy="Unsere KI plant nicht einfach mehr Output. Sie hilft dabei, aus eurem Ziel den richtigen Kreativplan zu bauen, passende AI Creatives auszuwählen, Qualität zu prüfen und Feedback in klare nächste Schritte zu übersetzen."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {coreSteps.map((step, index) => (
          <article
            key={step.title}
            className={`section-card rounded-[var(--radius-card)] p-5 ${
              index === 0 || index === 3
                ? "section-surface-paper"
                : index === 1 || index === 4
                  ? "section-surface-contrast"
                  : "section-surface-warm"
            }`}
          >
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              0{index + 1}
            </span>
            <h3 className="mt-4 font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
      <div className="flex justify-start">
        <ButtonLink href="/#ablauf" variant="secondary" size="lg">
          So arbeitet Zynapse Core
        </ButtonLink>
      </div>
    </section>
  );
}
