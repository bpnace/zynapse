import { ButtonLink } from "@/components/ui/button";
import { PageMotion } from "@/components/animation/page-motion";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { pricingPlans } from "@/lib/content/pricing";

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
      "Sprint-basierter Ablauf mit festen Rollen, klaren Entscheidungsrechten und einer Kampagnenlogik vor der Produktion. Angles, Hooks und CTA-Routen stehen zuerst, dann wird produziert.",
    traditional:
      "Projektbasierte Übergaben mit wechselnden Ansprechpartnern. Wenn Prioritäten kippen, starten Abstimmung und Rework oft neu und verlangsamen den nächsten Testzyklus.",
  },
  {
    label: "Creator-Marktplatz",
    zynapse:
      "Creator-Output folgt einer zentralen Testlogik: Hypothese, Hook, CTA-Variante, Formatplan und Freigabepfad sind vorab definiert und über alle Assets konsistent.",
    traditional:
      "Der Schwerpunkt liegt auf Sourcing und Einzeloutput. Ohne gemeinsamen Produktionsrahmen streuen Messaging, Qualität und Vergleichbarkeit zwischen Varianten.",
  },
  {
    label: "Inhouse-Aufbau",
    zynapse:
      "Sofort produktionsfähig ohne zusätzlichen Teamaufbau. Der Workflow für Briefing, Review, Versionierung und Export steht ab Tag eins und skaliert mit eurem Kampagnenbedarf.",
    traditional:
      "Volle Kontrolle, aber hoher Setup-Aufwand: Hiring, Onboarding, Tooling und Prozessdesign kosten Zeit. SHRM-Benchmarking weist Time-to-fill und Recruiting-Kapazität weiterhin als operative Engpässe aus.",
  },
  {
    label: "Freelancer-Setups",
    zynapse:
      "Ein Produktionssystem mit einheitlichem Qualitätsrahmen, zentraler Review-Logik und klaren Übergaben. Ergebnisse kommen versioniert und kampagnenbereit zurück.",
    traditional:
      "Mehrere Gewerke bedeuten mehrere Prozesse: unterschiedliche Arbeitsweisen, verstreutes Feedback und fehlende Standards für Freigabe, Versionierung und Export.",
  },
];

const pricingReferences = [
  {
    slug: "d2c-skincare-dach",
    brand: "D2C Hautpflege (DACH)",
    sector: "E-Commerce · 7-stelliger Jahresumsatz",
    summary:
      "Von sporadischen Einzelvideos zu einem testbaren Kreativ-Rhythmus für Meta und TikTok.",
    challenge:
      "Das Team hatte starke UGC-Ideen, aber keine klare Testlogik. Freigaben liefen über Slack-Threads, wodurch neue Varianten oft erst nach 10–14 Tagen live gingen.",
    setup:
      "Starter → Growth in zwei Sprints. Zuerst wurden drei Kernangles mit mehreren Hooks und CTA-Routen definiert; danach lief die Produktion in festen Wochenfenstern mit einem zentralen Review-Slot.",
    outcome:
      "Innerhalb von acht Wochen stieg die Zahl sauber vergleichbarer Creatives deutlich. Winning Hooks konnten schneller nachproduziert und auf neue Platzierungen übertragen werden.",
    metrics: [
      { label: "Time-to-Live", value: "72h" },
      { label: "CPA", value: "-29%" },
      { label: "Varianten / Monat", value: "24" },
    ],
    quote:
      "Wir haben nicht einfach mehr Assets bekommen, sondern endlich ein System, mit dem wir jede Woche fundiert testen können.",
    quoteBy: "Performance Lead",
  },
  {
    slug: "b2b-saas-leadgen",
    brand: "B2B SaaS (Lead-Gen)",
    sector: "MarTech · 5-köpfiges Growth-Team",
    summary:
      "Komplexes Produktversprechen in klare Ad-Angles für die Demo-Pipeline übersetzt.",
    challenge:
      "Sales und Marketing hatten unterschiedliche Messaging-Prioritäten. Creatives wurden häufig neu geschrieben, bevor überhaupt belastbare Learnings vorlagen.",
    setup:
      "Gemeinsames Messaging-Framework für TOFU/MOFU inklusive klarer CTA-Routen für Demo, Audit und Vergleich. Jede Runde lief über einen festen Freigabepfad statt Ad-hoc-Feedback.",
    outcome:
      "Die Kampagnen wurden planbarer: weniger Rework, schnellere Freigaben und bessere Übergabe der Learnings in den nächsten Sprint.",
    metrics: [
      { label: "Demo-CTR", value: "+41%" },
      { label: "CPL", value: "-18%" },
      { label: "Freigabezeit", value: "-46%" },
    ],
    quote:
      "Zum ersten Mal hatten wir eine Linie von Hook bis Demo-CTA, die auch intern sofort verständlich war.",
    quoteBy: "Head of Growth",
  },
  {
    slug: "home-living-multibrand",
    brand: "Home & Living Retail",
    sector: "3 Marken · DACH Paid-Social-Team",
    summary:
      "Ein zentrales Produktionssetup für drei Marken mit unterschiedlichen Zielgruppen.",
    challenge:
      "Jede Marke arbeitete mit eigenen Freelancer-Strukturen. Das führte zu inkonsistenter Qualität, hohem Koordinationsaufwand und kaum wiederverwendbaren Learnings.",
    setup:
      "Pro-Setup mit markenübergreifenden Templates für Angle-Logik, Review und Export sowie einem gemeinsamen Wochenrhythmus für Priorisierung und Produktion.",
    outcome:
      "Das Team testete parallel für mehrere Brands, ohne dass Abstimmung die Iteration ausbremste. Learnings wurden erstmals systematisch zwischen Marken übertragen.",
    metrics: [
      { label: "Brands parallel", value: "3" },
      { label: "Review-Schleifen", value: "-52%" },
      { label: "Output / Sprint", value: "+2.1x" },
    ],
    quote:
      "Früher haben wir drei Inseln gesteuert. Jetzt haben wir ein gemeinsames System mit klaren Verantwortlichkeiten.",
    quoteBy: "Paid Social Lead",
  },
];

export default function PricingPage() {
  return (
    <PageMotion>
      <PageHero
        label="Preise"
        title={
          <>
            Drei Pakete. Vom ersten Test bis zur{" "}
            <span className="title-accent">laufenden Kreativproduktion</span>.
          </>
        }
        description="Jedes Paket ist auf einen klaren Einstieg gebaut: ein schneller Pilotstart, laufendes Kreativ-Testing oder ein Multi-Brand-Setup mit mehreren Stakeholdern."
        badges={["Starter", "Growth", "Pro", "Referenzen"]}
      />

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10"
        data-reveal-section
      >


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
                      data-animate-item
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
              <p
                className="font-mono text-xs tracking-[0.18em] uppercase "
                data-animate-heading
              >
                Vergleich im Detail
              </p>
              <h2
                className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-[2.4rem]"
                data-animate-heading
              >
                Welches Setup skaliert{" "}
                <span className="title-accent">Kreativ-Testing wirklich</span>?
              </h2>
            </div>
            <p
              className="max-w-xl text-sm leading-6 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Wir vergleichen nicht den Preis pro Asset, sondern die Hebel im
              Alltag: Entscheidungswege, Iterationsgeschwindigkeit und wie
              zuverlässig aus Ideen ein wiederholbarer Kampagnen-Output wird.
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

      {/*<section
        id="referenzen"
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Referenzen"
            title="Drei Referenzen aus laufender Performance-Arbeit."
            accent="Drei Referenzen"
            copy="Kompakt aufbereitet nach derselben Logik: Ausgangslage, Setup und messbares Ergebnis. Die Cases sind anonymisiert, damit Team- und Performance-Daten belastbar gezeigt werden können."
          />
          <div className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/78 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]">
            Anonymisierte Kunden-Referenzen
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {pricingReferences.map((entry, index) => (
            <article
              key={entry.slug}
              className={`section-card rounded-[calc(var(--radius-card)+0.2rem)] border p-6 sm:p-7 ${
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
                  <p className="mt-2 text-sm leading-6 text-[color:var(--copy-muted)]">
                    {entry.sector}
                  </p>
                </div>
                <span className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/72 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--copy-soft)]">
                  Anonymisiert
                </span>
              </div>

              <h2 className="mt-5 font-display text-[2.15rem] leading-[0.92] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                {entry.summary}
              </h2>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {entry.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[0.8rem] border border-[rgba(56,67,84,0.12)] bg-white/74 px-3 py-3"
                  >
                    <p className="font-display text-2xl leading-none font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                      {metric.value}
                    </p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--copy-soft)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3.5">
                <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/72 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Ausgangslage
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[color:var(--copy-body)]">
                    {entry.challenge}
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/72 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Setup
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[color:var(--copy-body)]">
                    {entry.setup}
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/72 p-4">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Ergebnis
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-7 text-[color:var(--copy-body)]">
                    {entry.outcome}
                  </p>
                </div>
              </div>

              <blockquote className="mt-5 rounded-[var(--radius-card)] border border-[rgba(224,94,67,0.14)] bg-[rgba(255,245,238,0.68)] px-4 py-3.5 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                “{entry.quote}”
                <footer className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--accent-soft)]">
                  {entry.quoteBy}
                </footer>
              </blockquote>
            </article>
          ))}
        </div>
      </section>*/}

      <section
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-warm overflow-hidden rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] p-7 sm:p-9">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2
                className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                data-animate-heading
              >
                <span data-animate-word>Bereit</span>,{" "}
                <span className="title-accent">loszulegen</span>?
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Ob als Brand oder Kreative:r – der Einstieg braucht nur wenige
                Minuten. Kein Sales-Call, kein langes Setup.
              </p>
            </div>
            <div className="flex flex-wrap gap-3" data-animate-item>
              <ButtonLink href="/request" size="lg">
                Brand-Anfrage
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
