import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageMotion } from "@/components/animation/page-motion";
import { JsonLdScript } from "@/components/seo/json-ld";
import { creativeBenefits } from "@/lib/content/site";
import { buildBreadcrumbs, buildMetadata, buildPageJsonLd, buildServiceJsonLd } from "@/lib/seo";
import Image from "next/image";

const pageSeo = {
  title: "Für AI Creatives – klare Aufgaben statt Briefing-Chaos | Zynapse",
  description:
    "Zynapse für AI Creatives: klare Aufgaben, sichtbare Markenregeln und echte Kampagnen statt chaotischer Briefings und verstreuter Feedback-Schleifen.",
  path: "/creatives",
} as const;

export const metadata = buildMetadata(pageSeo);

const painPoints = [
  {
    title: "Briefings sind oft zu unklar",
    description:
      "Du musst erst herausfinden, was wirklich gebraucht wird, bevor du überhaupt kreativ arbeiten kannst.",
  },
  {
    title: "Feedback ist zu verstreut",
    description:
      "Kommentare kommen aus Calls, Chats und Dokumenten, aber selten als klare Aufgabe mit Richtung und Priorität.",
  },
  {
    title: "Dein Beitrag wird nicht sauber eingebettet",
    description:
      "Gute Prompts, Richtungen oder Varianten verlieren Wirkung, wenn sie nicht Teil eines klaren Kampagnenplans sind.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Briefing verstehen",
    description:
      "Zynapse Core verdichtet Produkt, Ziel, Zielgruppe und Markenregeln zu einer Zusammenfassung für deine konkrete Rolle.",
  },
  {
    step: "02",
    title: "Klare Aufgabe übernehmen",
    description:
      "Du arbeitest mit klaren Qualitätskriterien, sichtbaren No-Gos und einem konkreten Beitrag zum Kampagnenziel.",
  },
  {
    step: "03",
    title: "Feedback sauber weitergeben",
    description:
      "Feedback wird nicht zum Slack-Chaos, sondern zu klaren nächsten Aufgaben zwischen Strategie, Prompting, Produktion und Review.",
  },
];

const roleExamples = [
  {
    role: "Prompt Engineering",
    example:
      "Du entwickelst klare KI-Anweisungen für unterschiedliche Hooks, Looks und Formate.",
    output: "Mehr testbare Hooks ohne Qualitätsbruch zwischen Iterationen.",
  },
  {
    role: "Creative Direction",
    example:
      "Du sorgst dafür, dass aus vielen Varianten eine erkennbare Markenrichtung wird.",
    output: "Ein kohärenter Look über alle Varianten hinweg.",
  },
  {
    role: "Prompt Design",
    example:
      "Du strukturierst Inputs so, dass sie wiederholbar gute Ergebnisse liefern.",
    output: "Formatgerechte Assets mit klarer Wiederholbarkeit.",
  },
  {
    role: "AI Production",
    example:
      "Du bringst Varianten in die richtige Qualität, Länge und Form.",
    output: "Schnellerer Turnaround bei gleichbleibender Produktionsqualität.",
  },
  {
    role: "AI Engineering",
    example:
      "Du baust Workflows, die kreative Produktion schneller und sauberer machen.",
    output: "Weniger manuelle Schleifen im Daily-Betrieb.",
  },
  {
    role: "AI Strategy",
    example:
      "Du priorisierst, welche Richtung für Zielgruppe, Angebot und Testing am sinnvollsten ist.",
    output: "Bessere Lernzyklen pro Kampagne statt reiner Output-Menge.",
  },
];

const creativeCoreSupports = [
  {
    title: "Briefing-Zusammenfassung für deine Rolle",
    copy:
      "Produkt, Ziel, Zielgruppe und Markenrahmen werden so verdichtet, dass dein konkreter Beitrag sofort klar ist.",
  },
  {
    title: "Sichtbare Markenregeln und No-Gos",
    copy:
      "Look, Tonalität und Grenzen bleiben im Flow sichtbar, statt nur einmal im Briefing-Dokument aufzutauchen.",
  },
  {
    title: "Klare Anforderungen für deine Abgabe",
    copy:
      "Format, Qualitätsziel und Erwartung an deinen Output stehen vor dem Start fest und nicht erst nach der ersten Schleife.",
  },
  {
    title: "Check vor dem Einreichen",
    copy:
      "Vor der Übergabe siehst du, ob Beitrag, Richtung und Qualitätskriterien wirklich zum Kampagnenziel passen.",
  },
  {
    title: "Feedback als konkrete Aufgaben",
    copy:
      "Kommentare werden in priorisierte nächste Schritte übersetzt statt in lose Rückmeldungen aus Calls, Chats und Docs.",
  },
  {
    title: "Bessere Übergaben zwischen Strategie, Prompting und Produktion",
    copy:
      "Der Beitrag jeder Rolle bleibt anschlussfähig, sodass beim nächsten Schritt keine Richtung oder Lernlogik verloren geht.",
  },
] as const;

const profileFits = [
  "Du willst an echten Brand-Kampagnen arbeiten statt an losem Creator-Sourcing",
  "Du denkst nicht nur in Einzelassets, sondern in Hooks, Richtungen und Testlogik",
  "Du willst mit klaren Aufgaben und sauberen Übergaben arbeiten",
  "Du suchst ein Umfeld, in dem Strategie, Prompting und Produktion sauber zusammenspielen",
];

const results = [
  { value: "1", label: "klare Aufgabe pro Rolle" },
  { value: "6", label: "Rollen in einem sichtbaren Flow" },
  { value: "100%", label: "Feedback mit nachvollziehbarem Kontext" },
];

export default function CreativesPage() {
  const creativesJsonLd = buildPageJsonLd({
    ...pageSeo,
    pageType: "CollectionPage",
    breadcrumbs: buildBreadcrumbs("Für Kreative", pageSeo.path),
    primaryEntity: buildServiceJsonLd({
      path: pageSeo.path,
      name: "AI-Netzwerk für Kreative",
      description: pageSeo.description,
      serviceType: "AI-Creative-Flow für Kampagnenarbeit",
      audience: "AI Creatives und kreative Spezialist:innen",
    }),
  });

  return (
    <>
      <JsonLdScript data={creativesJsonLd} />
      <PageMotion>
      <section
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] lg:items-start">
          <div className="space-y-6">
            <h1
              className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-7xl"
              data-animate-heading
            >
              Arbeite an starken <span className="title-accent" data-animate-word>
                Brand Creatives
              </span>
              , nicht an chaotischen Briefings.
            </h1>
            <p
              className="max-w-2xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Zynapse verbindet dich mit echten Kampagnen, klaren Aufgaben und
              AI-gestützten Workflows. Zynapse Core hilft dabei, Briefings zu
              strukturieren, Markenregeln sichtbar zu machen und Feedback in
              klare nächste Schritte zu übersetzen.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start" data-animate-item>
              <ButtonLink href="/apply" size="lg">
                Als AI Creative bewerben
              </ButtonLink>
              <ButtonLink href="/creatives#rollen" variant="secondary" size="lg">
                Rollen ansehen
              </ButtonLink>
            </div>
          </div>
          <div className="hidden lg:flex lg:absolute lg:top-20 lg:right-12 lg:z-10">
            <div className="relative h-[20rem] w-[16rem] sm:h-[24rem] sm:w-[18rem] lg:h-[38rem] lg:w-[22rem]">
              <Image
                src="/brand/peep-standing-9.png"
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

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Bekannte Probleme"
          title={
            <>
              Gute Kreative verlieren Zeit in{" "}
              <span className="title-accent" data-animate-word>
                schlechter Koordination
              </span>
              .
            </>
          }
          copy="Viele Teams haben Talent, aber keinen sauberen Ablauf von Strategie über Prompting bis Produktion. Genau dort setzt Zynapse Core an."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <article
              key={point.title}
              className={`section-card section-surface-mute border-t-[3px] p-6 ${
                index === 0
                  ? "border-t-[rgba(224,94,67,0.24)]"
                  : index === 1
                    ? "border-t-[rgba(249,197,106,0.3)]"
                    : "border-t-[rgba(56,67,84,0.2)]"
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

      <section
        id="rollen"
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
        data-stagger="dense"
      >
        <SectionHeading
          eyebrow="Dein Workflow"
          title={
            <>
              Drei Schritte von der{" "}
              <span data-animate-word>klaren Aufgabe</span> zum{" "}
              <span className="title-accent">sauberen Beitrag</span>.
            </>
          }
          copy="Du konzentrierst dich auf Strategie, Prompting und Kreativ-Steuerung. Der operative Rahmen ist so gebaut, dass dein Beitrag nicht im Prozess verschwindet."
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

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Rollen"
          title={
            <>
              <span data-animate-word>Sechs Rollen</span>. Ein gemeinsamer{" "}
              <span className="title-accent">Kampagnenbeitrag</span>.
            </>
          }
          copy="Die Rollen können bleiben. Die Sprache wird klarer: Was du tust und warum es für die Kampagne zählt."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleExamples.map((entry) => (
            <article
              key={entry.role}
              className="section-card section-surface-paper rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] p-6"
            >
              <p className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                {entry.role}
              </p>
              <p className="mt-4 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {entry.example}
              </p>
              <p className="mt-4 rounded-[0.55rem] border border-[rgba(224,94,67,0.16)] bg-[rgba(255,240,232,0.5)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]">
                {entry.output}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:items-start">
          <div className="space-y-4 lg:pr-6">
            <p
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent-soft)]"
              data-animate-heading
            >
              Zynapse Core für Creatives
            </p>
            <h2
              className="max-w-3xl font-display text-[2.35rem] leading-[0.96] font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-[3rem]"
              data-animate-heading
            >
              Zynapse Core gibt dir <span data-animate-word>klare Aufgaben</span>{" "}
              statt unklarer <span className="title-accent">Briefings</span>.
            </h2>
            <p
              className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Die KI ersetzt dich nicht. Sie strukturiert Briefing, Markenregeln,
              Feedback und Übergaben so, dass dein Beitrag schneller greift und
              im Kampagnenfluss nicht verloren geht.
            </p>
            <div className="border-t border-[rgba(56,67,84,0.1)] pt-4">
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                Im Flow sichtbar
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--copy-body)]">
                Rolle, Qualitätsziel, No-Gos und nächste Schritte bleiben an
                einer Stelle lesbar, statt über mehrere Tools verteilt zu sein.
              </p>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[0.7rem] border border-[rgba(56,67,84,0.14)] bg-[rgba(248,250,252,0.92)] shadow-[0_14px_28px_rgba(31,36,48,0.05)]"
            data-animate-item
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-[var(--accent)]" />
            <div className="relative grid divide-y divide-[rgba(56,67,84,0.1)]">
              {creativeCoreSupports.map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4 sm:px-6"
                  data-animate-item
                >
                  <span className="font-mono text-[10px] leading-6 tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-1.5">
                    <h3 className="text-[1rem] leading-6 font-semibold tracking-[-0.02em] text-[var(--copy-strong)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                      {item.copy}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-warm rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] p-7 sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-center">
            <div className="space-y-5">
              <span className="eyebrow" data-animate-heading>
                Ergebnisse
              </span>
              <h2
                className="pb-[0.40em] font-display text-4xl leading-[1.20] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
                data-animate-heading
              >
                Bessere Bedingungen, mehr Klarheit,{" "}
                <span className="title-accent" data-animate-word>
                  weniger Reibung
                </span>
                .
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Kreative, die mit Zynapse arbeiten, verlieren weniger Zeit im
                Prozess und mehr Zeit in Arbeit, die für die Kampagne wirklich
                zählt.
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

      <section
        className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10"
        data-reveal-section
      >
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Profil für Kreative"
            title={
              <>
                Für wen das{" "}
                <span className="title-accent" data-animate-word>
                  Creative Setup
                </span>{" "}
                passt.
              </>
            }
            copy="Wenn du kreative Arbeit strategisch strukturieren kannst und lieber in klaren Kampagnen als in Briefing-Chaos arbeitest."
          />
        </div>
        <div
          className="section-card section-surface-paper rounded-[var(--radius-card)] p-6"
        >
          <ul className="grid gap-3">
            {profileFits.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[0.55rem] border border-[rgba(224,94,67,0.16)] bg-[rgba(255,240,232,0.55)] px-4 py-3.5 text-[0.95rem] leading-6 text-[color:var(--copy-body)]"
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

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
          <SectionHeading
            eyebrow="Deine Vorteile"
            title={
            <>
              Was sich für dich{" "}
              <span className="title-accent" data-animate-word>
                konkret verbessert
              </span>
              .
            </>
          }
          copy="Zynapse nimmt dir operative Komplexität ab, ohne dir die kreative Kontrolle zu entziehen."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {creativeBenefits.map((benefit) => (
            <article
              key={benefit}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
            >
              <p className="text-[1.05rem] leading-7 text-[color:var(--copy-body)]">
                {benefit}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-contrast rounded-[calc(var(--radius-panel)+0.1rem)] p-7 sm:p-9">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2
                className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                data-animate-heading
              >
                <span data-animate-word>Bewirb dich</span> für den{" "}
                <span className="title-accent">Creative Flow</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Portfolio, Fokusbereiche und Cases: Der Bewerbungs-Flow ist auf
                echte Kampagnenarbeit gebaut, nicht auf generische Leads.
              </p>
            </div>
            <ButtonLink href="/apply" size="lg" data-animate-item>
              Als AI Creative bewerben
            </ButtonLink>
          </div>
        </div>
      </section>
      </PageMotion>
    </>
  );
}
