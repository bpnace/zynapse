import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageMotion } from "@/components/animation/page-motion";
import { JsonLdScript } from "@/components/seo/json-ld";
import { brandBenefits } from "@/lib/content/site";
import {
  buildBreadcrumbs,
  buildMetadata,
  buildPageJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo";
import Image from "next/image";

const pageSeo = {
  title: "Für Brands – Videoproduktion für Performance-Teams | Zynapse",
  description:
    "Skalierbare Videoproduktion für Brand- und Growth-Teams. Vom Briefing zum testbaren Kampagnen-Pack in 72 Stunden – mit klarer Freigabelogik und strukturierter Zusammenarbeit.",
  path: "/brands",
} as const;

export const metadata = buildMetadata(pageSeo);

const painPoints = [
  {
    title: "Zu viele Schleifen, zu wenig Output",
    description:
      "Jedes Video kostet drei Abstimmungsrunden, zwei Überarbeitungen und mindestens eine Woche. Für systematisches Kreativ-Testing bleibt keine Kapazität.",
  },
  {
    title: "Briefings ohne Produktionslogik",
    description:
      "Das Team liefert Brand-Kontext, aber was daraus entsteht, ist Zufall statt System. Angles, Hooks und Varianten werden nicht strukturiert geplant.",
  },
  {
    title: "Freigaben ohne Übersicht",
    description:
      "Feedback verteilt sich über E-Mail, Slack und geteilte Ordner. Wer was wann freigegeben hat, ist nach zwei Wochen nicht mehr nachvollziehbar.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Brand-Anfrage",
    description:
      "Das Team gibt Produkt, Zielgruppe, Stil, Budget und Freigabeprozess vor. In wenigen Minuten entsteht ein strukturiertes Briefing.",
  },
  {
    step: "02",
    title: "Kampagnenplanung",
    description:
      "Der Creative Lead baut daraus Angles, Hooks, CTA-Logik und Testprioritäten – abgestimmt auf die Performance-Ziele des Teams.",
  },
  {
    step: "03",
    title: "Produktion & Review",
    description:
      "Das Studio produziert Varianten in allen Formaten und Längen. Das Team reviewt und gibt frei – zentral, nachvollziehbar, ohne offene Schleifen.",
  },
];

const results = [
  { value: "72h", label: "Ø vom Briefing zur Freigabe" },
  { value: "18+", label: "Testbare Varianten pro Pack" },
  { value: "1×", label: "Briefing statt Endlosschleifen" },
];

export default function BrandsPage() {
  const brandsJsonLd = buildPageJsonLd({
    ...pageSeo,
    breadcrumbs: buildBreadcrumbs("Für Brands", pageSeo.path),
    primaryEntity: buildServiceJsonLd({
      path: pageSeo.path,
      name: "AI-Kampagnen-Setups für Brands",
      description: pageSeo.description,
      serviceType: "Kuratiertes AI-Kampagnensystem für Brands",
      audience: "Brand-, Growth- und Performance-Teams",
    }),
  });

  return (
    <>
      <JsonLdScript data={brandsJsonLd} />
      <PageMotion>
      {/* ── Hero ── */}
      <section
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] lg:items-start">
          <div className="space-y-6">
            <h1
              className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
              data-animate-heading
            >
              Skalierbare <span data-animate-word>Videoproduktion</span> ohne{" "}
              <span className="title-accent">Produktionschaos</span>.
            </h1>
            <p
              className="max-w-4xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Euer Team gibt Richtung, Kontext und Freigaben vor. Zynapse
              übersetzt das in testbare Kampagnen-Packs mit 18+ Varianten pro
              Briefing – strukturiert, planbar und ohne Abstimmungsschleifen.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start" data-animate-copy>
              <ButtonLink href="/request" size="lg">
                Anfrage starten
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="lg">
                Pläne & Preise
              </ButtonLink>
            </div>
          </div>
          <div className="hidden lg:flex lg:absolute lg:top-20 lg:right-12 lg:z-10">
            <div className="relative h-[20rem] w-[16rem] sm:h-[24rem] sm:w-[18rem] lg:h-[38rem] lg:w-[22rem]">
              <Image
                src="/brand/peep-standing-16.png"
                alt="Illustration einer stehenden Person"
                fill
                className="object-contain object-top"
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 18rem, 16rem"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Typische Engpässe"
          title={
            <>
              Kreativproduktion <span data-animate-word>frisst Zeit</span>,
              die für <span className="title-accent">Testing und Optimierung</span>{" "}
              fehlt.
            </>
          }
          copy="Brand- und Growth-Teams stecken in einem Kreislauf aus Briefings, Feedback-Schleifen und manueller Koordination. Der eigentliche Hebel – systematisches Kreativ-Testing – bleibt liegen."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <article
              key={point.title}
              className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 border-t-[3px] ${
                index === 0
                  ? "border-t-[rgba(56,67,84,0.2)]"
                  : index === 1
                    ? "border-t-[rgba(224,94,67,0.24)]"
                    : "border-t-[rgba(249,197,106,0.3)]"
              }`}
            >
              <h3 className="font-display text-[1.5rem] leading-[1] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                {point.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
        data-stagger="dense"
      >
        <SectionHeading
          eyebrow="So funktioniert es"
          title={
            <>
              Vom <span data-animate-word>Briefing</span> zum fertigen
              Kampagnen-Pack in <span className="title-accent">drei Schritten</span>.
            </>
          }
          copy="Klare Rollen, klare Übergaben. Euer Team muss nicht zum Produktionsexperten werden – Kontext und Freigaben reichen, den Rest übernehmen Kreative und Studio."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {howItWorks.map((step) => (
            <article
              key={step.step}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
            >
              <span className="font-display text-[2.5rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                {step.step}
              </span>
              <h3 className="mt-4 font-display text-[1.35rem] leading-[1.1] font-semibold tracking-[-0.035em] text-[var(--copy-strong)]">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Results / Metrics ── */}
      <section
        className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-warm overflow-hidden rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-center">
            <div className="space-y-5">
              <span className="eyebrow" data-animate-heading>
                Ergebnisse
              </span>
              <h2
                className="font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
                data-animate-heading
              >
                Weniger <span data-animate-word>Aufwand</span>, mehr{" "}
                <span className="title-accent">testbare Kreativvarianten</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Teams, die mit Zynapse arbeiten, produzieren schneller, testen
                systematischer und verlieren weniger Zeit in Koordination.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {results.map((metric) => (
                <div
                  key={metric.label}
                  className="section-surface-paper rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] p-5 text-center"
                >
                  <span className="font-display text-[2.8rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                    {metric.value}
                  </span>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--copy-soft)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits Checklist ── */}
      <section
        className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10"
        data-reveal-section
      >
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Brand-Vorteile"
            title={
              <>
                Was sich für euer Team <span className="title-accent">konkret ändert</span>.
              </>
            }
            copy="Kein diffuser Tool-Zugang, sondern ein strukturierter Weg vom Briefing zu testbaren Kreativvarianten mit klarer Freigabelogik."
          />
        </div>
        <div className="section-card section-surface-paper rounded-[var(--radius-card)] p-6">
          <ul className="grid gap-3">
            {brandBenefits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[0.55rem] border border-[rgba(185,178,255,0.22)] bg-[rgba(240,238,255,0.45)] px-4 py-3.5 text-[0.95rem] leading-6 text-[color:var(--copy-body)]"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(156,244,215,0.28)] text-[10px] font-bold text-[#236851]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-contrast rounded-[calc(var(--radius-panel)+0.1rem)] p-7 sm:p-9">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl" data-animate-heading>
                <span data-animate-word>Bereit</span> für eine erste{" "}
                <span className="title-accent">Brand-Anfrage</span>?
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Der Anfrage-Flow braucht nur wenige Minuten. Produkt, Ziel,
                Budget und Freigabeprozess – mehr braucht es nicht, um zu
                starten.
              </p>
            </div>
            <ButtonLink href="/request" size="lg" data-animate-item>
              Anfrage starten
            </ButtonLink>
          </div>
        </div>
      </section>
      </PageMotion>
    </>
  );
}
