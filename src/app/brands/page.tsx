import Image from "next/image";
import { PageMotion } from "@/components/animation/page-motion";
import { AnimatedMetric } from "@/components/marketing/animated-metric";
import { ProblemCardGrid } from "@/components/marketing/problem-card-grid";
import { JsonLdScript } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { brandBenefits } from "@/lib/content/site";
import {
  buildBreadcrumbs,
  buildMetadata,
  buildPageJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo";

const pageSeo = {
  title: "Für Brands – mehr testbare Video Ads | Zynapse",
  description:
    "Mehr testbare Video Ads für Marketing- und Performance-Teams. Zynapse Core plant Kreativrouten, führt die Produktion und liefert geprüfte Varianten für Paid Social und Short Form.",
  path: "/brands",
} as const;

export const metadata = buildMetadata(pageSeo);

const painPoints = [
  {
    title: "Creative Fatigue kommt schneller als neue Varianten",
    description:
      "Bestehende Ads verlieren Wirkung, aber neue Assets dauern zu lange. Genau dadurch bleiben Tests kleiner als euer Werbedruck.",
  },
  {
    title: "Feedback bremst den Output",
    description:
      "Zu viele Personen kommentieren an zu vielen Orten. Entscheidungen werden langsam, unklar und am Ende unnötig teuer.",
  },
  {
    title: "KI-Tools allein lösen das Problem nicht",
    description:
      "Ohne Plan, Review und Markenregeln entstehen viele Dateien, aber wenig nutzbarer Kampagnen-Output für echte Media-Teams.",
  },
] as const;

const howItWorks = [
  {
    step: "01",
    title: "Briefing einreichen",
    description:
      "Ihr beschreibt Produkt, Zielgruppe, Kanal, Timing und wichtige Markenregeln.",
    detail:
      "Mehr braucht Zynapse Core nicht, um den ersten klaren Kreativplan aufzusetzen.",
  },
  {
    step: "02",
    title: "Kampagnenplan erhalten",
    description:
      "Zynapse Core schlägt Routen, Hooks, Formate und passende AI Creatives vor.",
    detail:
      "Der Plan ist auf Kampagnenziel, Kanal und Testdruck abgestimmt, nicht nur auf Output-Menge.",
  },
  {
    step: "03",
    title: "Varianten reviewen und nutzen",
    description:
      "Euer Team prüft zentral, gibt Feedback und bekommt ein fertiges Creative Pack.",
    detail:
      "So gehen Paid Social und Short Form schneller live, ohne neue Abstimmungsschleifen zu starten.",
  },
] as const;

type BrandResult = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  detail: string;
};

const results: BrandResult[] = [
  {
    label: "Bis zum ersten Kreativplan",
    value: 72,
    suffix: "h",
    detail: "vom Briefing bis zur ersten klaren Richtung",
  },
  {
    label: "Varianten je nach Paket",
    value: 36,
    prefix: "bis zu ",
    detail: "12 bis 36 testbare Varianten für Paid Social und Short Form",
  },
  {
    label: "Zentraler Review",
    value: 1,
    detail: "statt verstreutem Feedback über Slack, Calls und Ordner",
  },
] ;

function BrandMetric({
  label,
  value,
  prefix,
  suffix,
  detail,
}: (typeof results)[number]) {
  return (
    <article className="min-w-0" data-animate-item>
      <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
        {label}
      </p>
      <p className="mt-2 font-display text-[2.5rem] leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--accent-strong)]">
        <AnimatedMetric value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
        {detail}
      </p>
    </article>
  );
}

export default function BrandsPage() {
  const brandsJsonLd = buildPageJsonLd({
    ...pageSeo,
    breadcrumbs: buildBreadcrumbs("Für Brands", pageSeo.path),
    primaryEntity: buildServiceJsonLd({
      path: pageSeo.path,
      name: "Video-Creative-Flows für Brands",
      description: pageSeo.description,
      serviceType: "Video-Creative-Flow für Marketing- und Performance-Teams",
      audience: "Marketing-, Growth- und Performance-Teams",
    }),
  });

  return (
    <>
      <JsonLdScript data={brandsJsonLd} />
      <PageMotion>
        <section
          className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)] lg:items-start">
            <div className="space-y-6">
              <p
                className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]"
                data-animate-heading
              >
                Für Brands
              </p>
              <h1
                className="max-w-5xl font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-7xl"
                data-animate-heading
              >
                Mehr <span data-animate-word>kreative</span> Video Ads. Weniger komplizierte{" "}
                <span className="title-accent">Abstimmungen</span>.
              </h1>
              <p
                className="max-w-5xl text-lg leading-8 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Euer Team gibt Ziel, Produkt und Markenregeln vor. Zynapse Core
                plant die passenden Kreativrouten, führt die Produktion und
                liefert geprüfte Varianten für Paid Social und Short Form.
              </p>
              <p
                className="max-w-3xl text-sm leading-6 text-[color:var(--copy-soft)]"
                data-animate-copy
              >
                Für Brands, die mehr testen wollen, ohne jede Produktion neu
                aufzusetzen.
              </p>
              <div className="flex flex-wrap gap-3" data-animate-item>
                <ButtonLink href="/request" size="lg">
                  Kampagne anfragen
                </ButtonLink>
                <ButtonLink href="/pricing" variant="secondary" size="lg">
                  Preise ansehen
                </ButtonLink>
              </div>
            </div>

            <div className="relative hidden min-h-[32rem] lg:block">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 62% 28%, rgba(249,197,106,0.18), transparent 34%), radial-gradient(circle at 35% 70%, rgba(246,107,76,0.12), transparent 30%)",
                  filter: "blur(8px)",
                }}
              />
              <div className="absolute inset-0 flex items-start justify-end">
                <div className="relative h-[38rem] w-[22rem]">
                  <Image
                    src="/brand/peep-standing-16.png"
                    alt="Illustration einer stehenden Person"
                    fill
                    className="object-contain object-top"
                    sizes="(min-width: 1024px) 22rem, 0px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <SectionHeading
            eyebrow="Typische Engpässe"
            title={
              <>
                Euer Media Team braucht neue Creatives. Euer{" "}
                <span data-animate-word>Prozess</span> ist{" "}
                <span className="title-accent">zu langsam</span>.
              </>
            }
            copy="Performance wächst nicht nur durch mehr Budget. Sie wächst durch bessere Tests. Dafür braucht ihr regelmäßig neue Hooks, neue Formate und neue Varianten, ohne jedes Mal eine Produktion von null zu starten."
          />

          <ProblemCardGrid cards={painPoints} className="mt-8" />
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
          data-reveal-section
          data-stagger="dense"
        >
          <SectionHeading
            eyebrow="So funktioniert es"
            title={
              <>
                Drei <span data-animate-word>Schritte</span> bis zum nächsten{" "}
                <span className="title-accent">Creative Pack</span>.
              </>
            }
            copy="Ihr bringt Ziel, Marke und Timing mit. Zynapse Core übersetzt das in einen klaren Kreativplan, geführte Produktion und einen zentralen Review."
          />

          <div className="mt-8 section-card section-surface-paper overflow-hidden rounded-[calc(var(--radius-panel)+0.08rem)] border-[rgba(56,67,84,0.12)]">
            <div className="grid lg:grid-cols-3">
              {howItWorks.map((step, index) => (
                <article
                  key={step.step}
                  className={`px-6 py-6 sm:px-8 ${
                    index > 0 ? "border-t border-[rgba(56,67,84,0.12)] lg:border-t-0 lg:border-l" : ""
                  } border-[rgba(56,67,84,0.12)]`}
                  data-animate-item
                >
                  <div className="space-y-4">
                    <span className="font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                      {step.step}
                    </span>
                    <h3 className="font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                      {step.title}
                    </h3>
                    <p className="text-[0.98rem] leading-7 text-[color:var(--copy-body)]">
                      {step.description}
                    </p>
                    <p className="text-sm leading-6 text-[color:var(--copy-soft)]">
                      {step.detail}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
          data-reveal-section
          data-stagger="dense"
        >
          <div className="section-card section-surface-warm overflow-hidden rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] p-7 sm:p-9">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start">
              <div className="space-y-5">
                <h2
                  className="max-w-3xl font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
                  data-animate-heading
                >
                  Mehr <span data-animate-word>Output</span>, klarere{" "}
                  <span className="title-accent">Lernschleifen</span>.
                </h2>
                <p
                  className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                  data-animate-copy
                >
                  Teams, die mit Zynapse arbeiten, kommen schneller von der Idee
                  zum Test und verlieren weniger Zeit in Abstimmungsschleifen.
                </p>
              </div>

              <div className="grid gap-5 border-t border-[rgba(56,67,84,0.12)] pt-5 sm:grid-cols-3">
                {results.map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`min-w-0 ${index > 0 ? "sm:border-l sm:border-[rgba(56,67,84,0.12)] sm:pl-5" : ""}`}
                  >
                    <BrandMetric {...metric} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:items-start">
            <div className="space-y-5">
              <SectionHeading
                eyebrow="Für Brands"
                title={
                  <>
                    Was sich für euer Team{" "}
                    <span className="title-accent">konkret verbessert</span>.
                  </>
                }
                copy="Kein Tool-Chaos und keine Freelancer-Suche, sondern ein klarer Weg vom Briefing zum fertigen Creative Pack."
              />
            </div>

            <div className="section-card section-surface-paper overflow-hidden rounded-[calc(var(--radius-panel)+0.08rem)] border-[rgba(56,67,84,0.12)]">
              {brandBenefits.map((item, index) => (
                <div
                  key={item}
                  className={`grid gap-4 px-6 py-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:px-8 ${
                    index > 0 ? "border-t border-[rgba(56,67,84,0.12)]" : ""
                  }`}
                  data-animate-item
                >
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[1rem] leading-7 text-[color:var(--copy-body)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <div className="section-card section-surface-contrast rounded-[calc(var(--radius-panel)+0.1rem)] p-7 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <h2
                  className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                  data-animate-heading
                >
                  <span data-animate-word>Bereit</span> für eine stärkere Kampagne{" "}
                  <span className="title-accent">ohne</span> komplizierten Weg dorthin?
                </h2>
                <p
                  className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                  data-animate-copy
                >
                  Produkt, Ziel, Kanäle und Timing reichen, damit Zynapse Core
                  einen ersten Kreativplan vorschlagen kann.
                </p>
              </div>
              <ButtonLink href="/request" size="lg" data-animate-item>
                Kampagne anfragen
              </ButtonLink>
            </div>
          </div>
        </section>
      </PageMotion>
    </>
  );
}
