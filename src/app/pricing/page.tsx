import { ButtonLink } from "@/components/ui/button";
import { PageMotion } from "@/components/animation/page-motion";
import { JsonLdScript } from "@/components/seo/json-ld";
import { pricingPlans } from "@/lib/content/pricing";
import { cn } from "@/lib/utils";
import {
  buildBreadcrumbs,
  buildMetadata,
  buildOfferJsonLd,
  buildPageJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo";
import Link from "next/link";

const pageSeo = {
  title: "Preise – Pilot, Growth Flow, Scale | Zynapse",
  description:
    "Wähle den Creative Flow, der zu eurem Team passt: Pilot für den ersten Test, Growth Flow für laufende Kampagnen und Scale für mehrere Workstreams.",
  path: "/pricing",
} as const;

export const metadata = buildMetadata(pageSeo);

function buildContactHref(planId: string) {
  return `/contact?tier=${encodeURIComponent(planId)}#kontaktformular`;
}

const pricingTileButtonBaseClassName =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold tracking-[-0.02em] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

const pricingTileFeaturedButtonClassName =
  "rounded-[var(--radius-panel)] border border-[rgba(255,255,255,0.18)] bg-[linear-gradient(135deg,var(--accent-strong),#f07a57)] text-white shadow-[0_18px_38px_rgba(224,94,67,0.26)] hover:bg-[linear-gradient(135deg,#cf543c,#eb7854)] focus-visible:ring-[rgba(224,94,67,0.25)]";

const pricingTileDefaultButtonClassName =
  "rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.24)] bg-white text-[var(--copy-strong)] shadow-[0_10px_22px_rgba(31,36,48,0.05)] hover:border-[rgba(56,67,84,0.3)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(250,246,240,0.98))] focus-visible:ring-[rgba(56,67,84,0.12)]";

const serviceComparisons = [
  {
    label: "Einzelproduktion",
    zynapse:
      "Nicht nur ein Asset-Paket, sondern ein Creative Flow mit Briefing-Analyse, zentralem Review und klarer Anschlussfähigkeit an die nächste Kampagnenrunde.",
    traditional:
      "Ein einzelner Sprint oder ein einzelnes Video löst den Moment. Beim nächsten Briefing beginnen Planung, Abstimmung und Produktionslogik oft wieder von vorn.",
  },
  {
    label: "Offener Creator-Marktplatz",
    zynapse:
      "Zynapse verbindet nicht nur einzelne Talente, sondern einen zusammenhängenden Creative Flow mit konsistentem Output, klaren Übergaben und laufender Priorisierung.",
    traditional:
      "Der Schwerpunkt liegt auf Sourcing. Ohne übergeordneten Flow streuen Qualität, Messaging und Learnings zwischen einzelnen Creator-Lieferungen.",
  },
  {
    label: "Inhouse-Aufbau",
    zynapse:
      "Teams bekommen schneller den passenden Creative Flow, ohne erst Hiring, Tooling und Prozessdesign selbst aufzubauen. So kann Kampagnenarbeit früher in einen Rhythmus kommen.",
    traditional:
      "Volle Kontrolle, aber hoher Vorlauf. Bevor das erste System sauber läuft, müssen Rollen besetzt, Prozesse definiert und Produktionsstandards erst aufgebaut werden.",
  },
  {
    label: "Freelancer-Stack",
    zynapse:
      "Ein zentral geführter Flow hält Verantwortlichkeiten, Freigaben und Varianten in einem System zusammen. Das senkt Reibung zwischen Briefing, Review und Export.",
    traditional:
      "Mehrere Freelancer bedeuten oft mehrere Arbeitsweisen, verstreutes Feedback und wenig Kontinuität zwischen zwei Kampagnen- oder Review-Schleifen.",
  },
];

export default function PricingPage() {
  const pricingJsonLd = buildPageJsonLd({
    ...pageSeo,
    breadcrumbs: buildBreadcrumbs("Preise", pageSeo.path),
    primaryEntity: buildServiceJsonLd({
      path: pageSeo.path,
      name: "Pricing für Zynapse Creative Flows",
      description: pageSeo.description,
      serviceType: "Creative-Flow-Pricing für Brands",
      audience: "Brands mit laufendem Kampagnenbedarf",
      offers: buildOfferJsonLd([
        {
          name: pricingPlans[0].name,
          description: pricingPlans[0].description,
          minPrice: 2499,
          priceCurrency: "EUR",
          priceNote: "einmalig",
        },
        {
          name: pricingPlans[1].name,
          description: pricingPlans[1].description,
          minPrice: 5999,
          priceCurrency: "EUR",
          priceNote: "pro Monat",
        },
        {
          name: pricingPlans[2].name,
          description: pricingPlans[2].description,
          priceNote: "Individuell",
        },
      ]),
    }),
  });

  return (
    <>
      <JsonLdScript data={pricingJsonLd} />
      <PageMotion>
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-10 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="space-y-6">
          <h1
            className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] overflow-visible pr-[0.2rem] text-balance sm:text-7xl"
            data-animate-heading
          >
            Wähle den <span className="title-accent pr-[0.2rem]">Creative Flow</span>, der
            zu eurem Team passt.
          </h1>
          <p
            className="max-w-5xl text-lg leading-8 text-[color:var(--copy-muted)]"
            data-animate-copy
          >
            Ob erster Test oder laufender Kampagnenrhythmus: Zynapse Core plant
            den passenden Kreativprozess, wählt die richtigen AI Creatives aus
            und führt euch bis zum fertigen Kampagnenpaket.
          </p>
        </div>
      </section>

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
                    <span className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--copy-soft)]">
                      {plan.featured ? "Empfohlen" : "Flow"}
                    </span>
                  </div>

                  <h2
                    className={`mt-7 text-center font-display text-[2.5rem] leading-[0.9] font-semibold tracking-[-0.06em] ${
                      plan.featured ? "text-[var(--copy-strong)]" : "text-[var(--copy-strong)]"
                    }`}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className={`mt-6 text-center font-display text-3xl leading-none font-semibold tracking-[-0.08em] ${
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
                  <p className="mx-auto mt-4 max-w-[18rem] text-center text-xs leading-5 text-[color:var(--copy-soft)]">
                    {plan.audience}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {plan.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/72 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--copy-soft)]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 py-5 sm:px-7">
                  <div className="grid gap-3">
                    {plan.deliverables.map((deliverable, index) => (
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

                  <div className="mt-5 rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.1)] bg-white/70 p-4">
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Zynapse Core enthält
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                      {plan.collaboration}
                    </p>
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
                    <Link
                      href={buildContactHref(plan.id)}
                      className={cn(
                        pricingTileButtonBaseClassName,
                        plan.featured
                          ? pricingTileFeaturedButtonClassName
                          : pricingTileDefaultButtonClassName,
                      )}
                      data-animate-item
                    >
                      {plan.name} anfragen
                    </Link>
                    <p
                      className={`text-center text-xs leading-5 ${
                        plan.featured ? "text-[color:var(--copy-muted)]" : "text-[color:var(--copy-muted)]"
                      }`}
                    >
                      Flow wird im Kontaktformular direkt vorausgewählt.
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
              <span className="eyebrow" data-animate-heading>
                Vergleich
              </span>
              <h2
                className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-[2.4rem]"
                data-animate-heading
              >
                Welcher Ansatz hält{" "}
                <span className="title-accent">Kampagnen wirklich in Bewegung</span>?
              </h2>
            </div>
            <p
              className="max-w-xl text-sm leading-6 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Nicht jede Alternative löst dasselbe Problem. Entscheidend ist,
              wie gut ein Flow Briefing, Review, Delivery und laufende
              Kampagnenkontinuität zusammenhält.
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
                <span data-animate-word>Bereit</span> für das passende{" "}
                <span className="title-accent">Creative Flow</span>?
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Wenn ihr eure aktuelle Phase schon kennt, startet direkt mit
                einer Anfrage. Wenn nicht, klären wir gemeinsam, ob Pilot,
                Growth Flow oder Scale gerade zu eurem Bedarf passt.
              </p>
            </div>
            <div className="flex flex-wrap gap-3" data-animate-item>
              <ButtonLink href="/request" size="lg">
                Kampagne anfragen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      </PageMotion>
    </>
  );
}
