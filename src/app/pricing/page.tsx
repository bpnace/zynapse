import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { pricingPlans } from "@/lib/content/pricing";
import { caseStudies } from "@/lib/content/cases";

export const metadata = buildMetadata({
  title: "Preise | Zynapse",
  description:
    "Drei Einstiegspunkte für Brand-, Growth- und Agentur-Teams plus Beispiel-Referenzen auf derselben Seite.",
  path: "/pricing",
});

function buildContactHref(planId: string) {
  return `/contact?tier=${encodeURIComponent(planId)}#kontaktformular`;
}

const serviceComparisons = [
  {
    label: "Agentur",
    zynapse:
      "Feste Rollen, Kampagnenlogik vor Produktion und ein planbarer Review-Fluss. Vom Briefing zum fertigen Pack in 72h statt in Wochen.",
    traditional:
      "Projektbasiert, wechselnde Ansprechpartner und lange Abstimmungsschleifen. Jede Iteration kostet extra Zeit und Budget.",
  },
  {
    label: "Creator-Marktplatz",
    zynapse:
      "Strategie, Testing-Richtung und Output laufen in einem System zusammen. Du bekommst ein fertiges Kampagnen-Pack – nicht einzelne Assets ohne Kontext.",
    traditional:
      "Creator-Sourcing steht oft vor Messaging und Testing. Das Ergebnis: einzelne Videos ohne Angle-Logik, Hook-Varianten oder Formatstrategie.",
  },
  {
    label: "Inhouse-Aufbau",
    zynapse:
      "Skalierbarer Output ohne zusätzliches Team, Tool-Stack oder Recruiting. 18+ Varianten pro Briefing ohne interne Kapazitätsplanung.",
    traditional:
      "Eigenes Creative-Team aufbauen heißt: Recruiting, Toolkosten, Management-Overhead und monatelange Vorlaufzeit bis zum ersten Output.",
  },
  {
    label: "Freelancer-Setups",
    zynapse:
      "Ein gemeinsamer Produktionsfluss mit klaren Übergaben, Review-Logik und zentralem Export. Alle Beteiligten arbeiten in derselben Struktur.",
    traditional:
      "Fragmentierte Kommunikation über E-Mail, Slack und WeTransfer. Keine zentrale Freigabelogik, keine sichtbare Verantwortung.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="Preise"
        title="Drei Pakete. Vom ersten Test bis zur laufenden Creative-Produktion."
        description="Jedes Paket ist auf einen klaren Einstieg gebaut: ein schneller Pilotstart, laufendes Creative Testing oder ein Multi-Brand-Setup mit mehreren Stakeholdern."
        badges={["Starter", "Growth", "Pro", "Referenzen"]}
      />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-end">
          <SectionHeading
            eyebrow="Pakete"
            title="Nicht mehr Optionen. Sondern drei Einstiege, die operativ Sinn machen."
            accent="drei Einstiege"
            copy="Jedes Paket ist so gebaut, dass Teams schneller entscheiden können: Wie viel Struktur wird gebraucht, wie laufend soll produziert werden und wie komplex ist das Freigabe-Setup wirklich?"
          />
          <div className="section-card section-surface-contrast rounded-[var(--radius-card)] border-[rgba(56,67,84,0.14)] p-5">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              Orientierung
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[0.9rem] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--copy-strong)]">
                  Starter
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--copy-body)]">
                  Für ein fokussiertes Pilot-Setup.
                </p>
              </div>
              <div className="rounded-[0.9rem] bg-[rgba(255,244,231,0.88)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--copy-strong)]">
                  Growth
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--copy-body)]">
                  Für laufende Testing-Rhythmen.
                </p>
              </div>
              <div className="rounded-[0.9rem] bg-white/70 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--copy-strong)]">
                  Pro
                </p>
                <p className="mt-1 text-sm leading-6 text-[color:var(--copy-body)]">
                  Für mehrere Brands oder Stakeholder.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              className={`section-card group relative overflow-hidden rounded-[calc(var(--radius-card)+0.15rem)] border p-0 ${
                plan.featured
                  ? "border-[rgba(191,106,83,0.24)] bg-[linear-gradient(180deg,rgba(255,248,241,0.98),rgba(249,236,223,0.96))] text-[var(--copy-strong)] shadow-[0_28px_60px_rgba(191,106,83,0.16)]"
                  : "section-surface-paper border-[rgba(56,67,84,0.18)] shadow-[0_18px_42px_rgba(31,36,48,0.08)]"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-32 transition-transform duration-500 group-hover:scale-105 ${
                  plan.featured
                    ? "bg-[radial-gradient(circle_at_top,rgba(246,107,76,0.2),transparent_72%)]"
                    : "bg-[linear-gradient(180deg,rgba(246,107,76,0.08),transparent)]"
                }`}
              />

              <div className="relative flex h-full flex-col">
                <div
                  className={`border-b px-6 pt-6 pb-5 text-center sm:px-7 ${
                    plan.featured
                      ? "border-[rgba(191,106,83,0.16)]"
                      : "border-[rgba(56,67,84,0.12)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-left">
                    <p
                      className={`font-mono text-[11px] tracking-[0.18em] uppercase ${
                        plan.featured ? "text-[var(--accent-soft)]" : "text-[var(--accent-soft)]"
                      }`}
                    >
                      {plan.cadence}
                    </p>
                  </div>

                  <h2
                    className={`mt-7 text-center font-display text-[2.5rem] leading-[0.9] font-semibold tracking-[-0.06em] ${
                      plan.featured ? "text-[var(--copy-strong)]" : "text-[var(--copy-strong)]"
                    }`}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className={`mt-6 text-center font-display text-5xl leading-none font-semibold tracking-[-0.08em] ${
                      plan.featured ? "text-[var(--copy-strong)]" : "text-[var(--copy-strong)]"
                    }`}
                  >
                    {plan.price}
                  </p>
                  <p
                    className={`mx-auto mt-4 max-w-[18rem] text-center text-sm leading-6 ${
                      plan.featured ? "text-[color:var(--copy-body)]" : "text-[color:var(--copy-body)]"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="flex flex-1 flex-col px-6 py-5 sm:px-7">
                  <div className="grid gap-3">
                    {plan.deliverables.slice(0, 3).map((deliverable, index) => (
                      <div
                        key={deliverable}
                        className="flex items-start gap-3 text-sm leading-6 text-[color:var(--copy-body)]"
                      >
                        <span className="relative mt-[0.62rem] block h-1.5 w-1.5 shrink-0">
                          <span className="absolute -inset-1.5 rounded-full bg-[rgba(224,94,67,0.14)] blur-[8px]" />
                          <span className="absolute inset-0 rounded-full bg-[var(--accent)]" />
                        </span>
                        <span className={index === 0 ? "text-[color:var(--copy-strong)]" : ""}>
                          {deliverable}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`mt-5 border-l-[3px] pl-4 ${
                      plan.featured
                        ? "border-[rgba(246,107,76,0.7)]"
                        : "border-[rgba(246,107,76,0.4)]"
                    }`}
                  >
                    <p
                      className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                        plan.featured ? "text-[var(--copy-soft)]" : "text-[var(--copy-soft)]"
                      }`}
                    >
                      Passt wenn
                    </p>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        plan.featured ? "text-[color:var(--copy-body)]" : "text-[color:var(--copy-body)]"
                      }`}
                    >
                      {plan.fit}
                    </p>
                  </div>

                  <div className="mt-6 flex-1" />

                  <div className="space-y-3 text-center">
                    <ButtonLink
                      href={buildContactHref(plan.id)}
                      size="lg"
                      variant={plan.featured ? "primary" : "secondary"}
                      className={plan.featured ? "w-full" : "w-full border-[rgba(56,67,84,0.24)] bg-white"}
                    >
                      {plan.name} anfragen
                    </ButtonLink>
                    <p
                      className={`text-center text-xs leading-5 ${
                        plan.featured ? "text-[color:var(--copy-muted)]" : "text-[color:var(--copy-muted)]"
                      }`}
                    >
                      Paket wird im Kontaktformular direkt vorausgewählt.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="section-card section-surface-contrast rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(56,67,84,0.14)] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                Vergleich im Detail
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-[2.4rem]">
                Nicht Paket gegen Paket. Sondern Zynapse gegen andere Wege.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--copy-body)]">
              Preise beantworten die Einstiegshöhe. Dieser Block beantwortet die
              wichtigere Frage: Warum Zynapse statt Agentur, Creator-Marktplatz,
              Inhouse-Aufbau oder losem Freelancer-Setup?
            </p>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {serviceComparisons.map((entry) => (
              <article
                key={entry.label}
                className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/76 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                    {entry.label}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]">
                    Vergleich
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Mit Zynapse
                    </p>
                    <p className="mt-2 border-l-[3px] border-[rgba(246,107,76,0.28)] pl-3 text-sm leading-6 text-[color:var(--copy-body)]">
                      {entry.zynapse}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Typisch sonst
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                      {entry.traditional}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="referenzen"
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Referenzen"
            title="Beispiel-Referenzen: So sehen typische Kampagnen-Setups aus."
            accent="Beispiel-Referenzen"
            copy="Diese Beispiele zeigen die Struktur, in der Kampagnen-Setups, Ergebnisse und Kennzahlen aufbereitet werden – basierend auf realistischen Szenarien."
          />
          <div className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/76 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]">
            Beispiel-Daten
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {caseStudies.map((entry, index) => (
            <article
              key={entry.slug}
              className={`section-card rounded-[calc(var(--radius-card)+0.2rem)] border p-6 ${
                index === 1
                  ? "section-surface-warm border-[rgba(191,106,83,0.16)]"
                  : "section-surface-paper border-[rgba(56,67,84,0.12)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                    {entry.brand}
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--copy-muted)]">
                    {entry.sector}
                  </p>
                </div>
                <span className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/72 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--copy-soft)]">
                  Beispiel
                </span>
              </div>

              <h2 className="mt-5 font-display text-[2rem] leading-[0.94] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                {entry.summary}
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/70 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Ausgangslage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                    {entry.challenge}
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/70 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Ergebnisbild
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                    {entry.outcome}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {entry.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/74 px-3 py-1 text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
