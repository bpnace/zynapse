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

const coreCardStyles = [
  {
    borderColor: "rgba(56,67,84,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(236,240,246,0.9)), radial-gradient(circle at top left, rgba(47,55,69,0.16), transparent 54%)",
  },
  {
    borderColor: "rgba(92,89,100,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(239,235,239,0.9)), radial-gradient(circle at top left, rgba(96,88,96,0.14), transparent 54%)",
  },
  {
    borderColor: "rgba(191,106,83,0.2)",
    background:
      "linear-gradient(180deg, rgba(255,252,248,0.96), rgba(251,235,228,0.9)), radial-gradient(circle at top left, rgba(224,94,67,0.2), transparent 56%)",
  },
  {
    borderColor: "rgba(212,125,77,0.2)",
    background:
      "linear-gradient(180deg, rgba(255,252,246,0.96), rgba(250,238,224,0.9)), radial-gradient(circle at top left, rgba(232,132,79,0.2), transparent 56%)",
  },
  {
    borderColor: "rgba(228,156,74,0.22)",
    background:
      "linear-gradient(180deg, rgba(255,252,244,0.96), rgba(251,242,222,0.91)), radial-gradient(circle at top left, rgba(240,168,77,0.22), transparent 58%)",
  },
] as const;

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
            Zynapse Core bringt die richtigen{" "}
            <span data-animate-word>AI Creatives</span> für euer Briefing{" "}
            <span className="title-accent">zusammen</span>.
          </>
        }
        copy="Unsere KI plant nicht einfach mehr Output. Sie hilft dabei, aus eurem Ziel den richtigen Kreativplan zu bauen, passende AI Creatives auszuwählen, Qualität zu prüfen und Feedback in klare nächste Schritte zu übersetzen."
      />
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[72%] -translate-y-1/2 rounded-[calc(var(--radius-panel)+0.25rem)] blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(47,55,69,0.08) 0%, rgba(83,88,100,0.08) 22%, rgba(224,94,67,0.14) 56%, rgba(240,168,77,0.16) 100%)",
          }}
        />
        <div className="grid gap-4 lg:grid-cols-5">
        {coreSteps.map((step, index) => (
          <article
            key={step.title}
            className="section-card relative overflow-hidden rounded-[var(--radius-card)] p-5"
            style={coreCardStyles[index]}
          >
            <h3 className="mt-4 font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
