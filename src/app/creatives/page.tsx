import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { AiSparkleMark } from "@/components/ui/ai-sparkle-mark";
import { BoldZynapseCore } from "@/components/ui/bold-zynapse-core";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageMotion } from "@/components/animation/page-motion";
import { ProblemCardGrid } from "@/components/marketing/problem-card-grid";
import { JsonLdScript } from "@/components/seo/json-ld";
import { creativeBenefits } from "@/lib/content/site";
import { buildMarketingMetadata, buildMarketingPageJsonLd } from "@/lib/seo";

export const metadata = buildMarketingMetadata("/creatives");

const painPoints = [
  {
    title: "Briefings sind oft zu diffus",
    description:
      "Du musst erst herausfinden, was wirklich gebraucht wird, bevor du überhaupt kreativ arbeiten kannst.",
  },
  {
    title: "Feedback ist zu verstreut",
    description:
      "Kommentare kommen aus Calls, Chats und Dokumenten, aber selten als bearbeitbare Aufgabe mit Richtung und Priorität.",
  },
  {
    title: "Dein Beitrag wird nicht sauber eingebettet",
    description:
      "Gute Prompts, Richtungen oder Varianten verlieren Wirkung, wenn sie nicht Teil eines abgestimmten Kampagnenplans sind.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Briefing verstehen",
    description:
      "Zynapse Core verdichtet Produkt, Ziel, Zielgruppe und Markenregeln zu einer Zusammenfassung für deine Rolle.",
    detail:
      "Du startest nicht mit einem Rohbriefing, sondern mit Kontext, Qualitätsmaßstab, No-Gos und dem Beitrag, den deine Rolle leisten soll.",
  },
  {
    step: "02",
    title: "Aufgabe mit Richtung übernehmen",
    description:
      "Du arbeitest mit messbaren Qualitätskriterien, sichtbaren No-Gos und deinem Beitrag zum Kampagnenziel.",
    detail:
      "Deine Arbeit hängt direkt an Hook, Format, Zielgruppe oder Review-Frage. Dadurch bleibt sie Kampagnenbeitrag statt losem Einzelasset.",
  },
  {
    step: "03",
    title: "Feedback sauber weitergeben",
    description:
      "Feedback wird nicht zum Slack-Chaos, sondern zu priorisierten nächsten Aufgaben zwischen Strategie, Prompting, Produktion und Review.",
    detail:
      "Richtung, Entscheidung und nächste Schleife bleiben sichtbar, damit die folgende Rolle ohne erneutes Briefing weiterarbeiten kann.",
  },
] as const;

const howItWorksOwners = ["ZYNAPSE", "AI Creative", "Review Team"] as const;

const roleExamples = [
  {
    role: "Prompt Engineering",
    example:
      "Du entwickelst präzise KI-Anweisungen für unterschiedliche Hooks, Looks und Formate.",
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
    output: "Formatgerechte Assets mit stabiler Wiederholbarkeit.",
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
      "Produkt, Ziel, Zielgruppe und Markenrahmen werden so verdichtet, dass dein Beitrag sofort deutlich wird.",
  },
  {
    title: "Sichtbare Markenregeln und No-Gos",
    copy:
      "Look, Tonalität und Grenzen bleiben im Flow sichtbar, statt nur einmal im Briefing-Dokument aufzutauchen.",
  },
  {
    title: "Anforderungen vor der Abgabe",
    copy:
      "Format, Qualitätsziel und Erwartung an deinen Output stehen vor dem Start fest und nicht erst nach der ersten Schleife.",
  },
  {
    title: "Check vor dem Einreichen",
    copy:
      "Vor der Übergabe siehst du, ob Beitrag, Richtung und Qualitätskriterien wirklich zum Kampagnenziel passen.",
  },
  {
    title: "Feedback als nächste Aufgaben",
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
  "Du willst mit sauber definierten Aufgaben und Übergaben arbeiten",
  "Du suchst ein Umfeld, in dem Strategie, Prompting und Produktion sauber zusammenspielen",
];

const compensationNotes = [
  "projektbasierte Vergütung pro Rolle",
  "marktübliche Sätze je nach Scope und Verantwortung",
  "transparenter Betrag vor Annahme",
  "keine unbezahlten Pitch-Schleifen",
];

const results = [
  { value: "1", label: "Aufgabe pro Rolle" },
  { value: "6+", label: "Beispielrollen in einem sichtbaren Flow" },
  { value: "100%", label: "Feedback mit nachvollziehbarem Kontext" },
];

export default function CreativesPage() {
  const creativesJsonLd = buildMarketingPageJsonLd("/creatives");

  return (
    <>
      <JsonLdScript data={creativesJsonLd} />
      <PageMotion>
        <section
          className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
          data-reveal-section
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)] lg:items-start">
            <div className="space-y-6">
              <p
                className="font-mono text-xs tracking-[0.18em] text-[var(--accent-soft)] uppercase"
                data-animate-heading
              >
                Für AI Creatives
              </p>
              <h1
                className="max-w-5xl font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance text-[var(--copy-strong)] sm:text-7xl"
                data-animate-heading
              >
                Arbeite an starken{" "}
                <span className="title-accent" data-animate-word>
                  Brand Creatives,
                </span><br></br>
                nicht an chaotischen Briefings.
              </h1>
              <p
                className="max-w-5xl text-lg leading-8 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                <BoldZynapseCore>
                  Zynapse verbindet dich mit echten Kampagnen, Aufgaben mit Richtung
                  und AI-gestützten Workflows. Zynapse Core strukturiert
                  Briefings, macht Markenregeln sichtbar und übersetzt Feedback
                  in nächste Schritte, die du wirklich bearbeiten kannst.
                </BoldZynapseCore>
              </p>
              <p
                className="max-w-3xl text-sm leading-6 text-[color:var(--copy-soft)]"
                data-animate-copy
              >
                Für Kreative, die nicht nur schöne Einzelassets liefern wollen,
                sondern an Hooks, Szenarien und testbarer Kampagnenlogik
                mitarbeiten.
              </p>
              <div
                className="flex flex-wrap justify-center gap-3 sm:justify-start"
                data-animate-item
              >
                <ButtonLink href="/apply" size="lg">
                  Als AI Creative bewerben
                </ButtonLink>
                <ButtonLink href="/creatives#rollen" variant="secondary" size="lg">
                  Beispiele ansehen
                </ButtonLink>
              </div>
            </div>

            <div className="relative hidden min-h-[32rem] lg:block">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 62% 28%, rgba(249,197,106,0.16), transparent 34%), radial-gradient(circle at 35% 70%, rgba(246,107,76,0.11), transparent 30%)",
                  filter: "blur(8px)",
                }}
              />
              <div className="absolute inset-0 flex items-start justify-end">
                <div className="relative h-[38rem] w-[22rem]">
                  <Image
                    src="/brand/peep-standing-9.png"
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
          className="mx-auto flex w-full max-w-7xl flex-col gap-10 overflow-hidden px-6 py-14 sm:px-8 lg:px-10"
          data-reveal-section
          data-worry-scroll
        >
          <SectionHeading
            eyebrow="Bekannte Probleme"
            title={
              <>
                Gute Kreative verlieren viel Zeit in{" "}
                <span className="title-accent" data-animate-word>
                  schlechter Koordination
                </span>
                .
              </>
            }
            copy="Viele Teams haben Talent, aber keinen sauberen Ablauf von Strategie über Prompting bis Produktion. Für dich heißt das: mehr Nachfragen, mehr Kontextsuche und weniger Zeit für den Beitrag, der wirklich zählt."
          />
          <ProblemCardGrid cards={painPoints} revealItems={false} />
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
                Drei einfach Schritte von der{" "}
                <span data-animate-word>ersten Aufgabe</span> zum{" "}
                <span className="title-accent">sauberen Beitrag</span>.
              </>
            }
            copy="Du konzentrierst dich auf Strategie, Prompting und Kreativ-Steuerung. Der operative Rahmen hält Kontext, Qualitätskriterien und Übergaben sichtbar, damit dein Beitrag im Kampagnenfluss nicht verschwindet."
          />

          <div className="grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)] lg:grid-cols-3">
            {howItWorks.map((step, index) => {
              const isCoreStep = index === 0;

              return (
                <article
                  key={step.step}
                  className={`flex min-h-[15rem] flex-col p-5 sm:p-6 ${
                    index > 0 ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l" : ""
                  } border-[rgba(56,67,84,0.14)] ${
                    isCoreStep
                      ? "bg-[linear-gradient(180deg,rgba(255,249,239,0.92),rgba(255,255,255,0.98))] ring-1 ring-inset ring-[rgba(246,107,76,0.16)]"
                      : "bg-white"
                  }`}
                  data-animate-item
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-[3rem] leading-none font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                      {step.step}
                    </span>
                    <span className="flex max-w-[7rem] items-center justify-end gap-1 text-right font-mono text-[10px] leading-tight tracking-[0.14em] text-[var(--copy-soft)] uppercase">
                      <span>{howItWorksOwners[index]}</span>
                      {isCoreStep ? <AiSparkleMark /> : null}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-[color:var(--copy-body)]">
                    <BoldZynapseCore>{step.description}</BoldZynapseCore>
                  </p>
                  <p className="mt-auto min-h-[7.25rem] border-t border-[rgba(56,67,84,0.12)] pt-4 text-sm leading-6 text-[color:var(--copy-soft)]">
                    <BoldZynapseCore>{step.detail}</BoldZynapseCore>
                  </p>
                </article>
              );
            })}
          </div>
        </section>

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Beispielrollen"
          title={
            <>
              <span data-animate-word>Beispielrollen</span> für einen gemeinsamen{" "}
              <span className="title-accent">Kampagnenbeitrag</span>.
            </>
          }
          copy="Diese sechs Kacheln zeigen typische Einstiege in den Flow. Je nach Kampagne können weitere Spezialist:innen dazukommen, wenn Strategie, Produktion oder Testing mehr Tiefe brauchen."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleExamples.map((entry) => (
            <article
              key={entry.role}
              className="rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white p-6 shadow-[0_14px_28px_rgba(31,36,48,0.06)]"
            >
              <p className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                {entry.role}
              </p>
              <p className="mt-4 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {entry.example}
              </p>
              <p className="mt-4 border-t border-[rgba(56,67,84,0.12)] pt-3 text-sm leading-6 text-[color:var(--copy-body)]">
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
              <BoldZynapseCore>Zynapse Core für Creatives</BoldZynapseCore>
            </p>
            <h2
              className="max-w-4xl font-display text-[2.35rem] leading-[0.96] font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-[3rem]"
              data-animate-heading
            >
              Zynapse Core macht aus{" "}
              <span className="title-accent">Briefings</span>{" "}
              <span data-animate-word>Aufgaben</span>, die du direkt bearbeiten
              kannst.
            </h2>
            <p
              className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Die KI ersetzt Menschen nicht. Sie strukturiert Briefing, Markenregeln,
              Feedback und Übergaben so, dass dein Beitrag schneller greift und
              im Kampagnenfluss nicht verloren geht. Dadurch arbeitest du nicht
              gegen Unschärfe, sondern an einer sichtbaren Kampagnenaufgabe.
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
            className="relative overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)]"
            data-animate-item
          >
            <div className="relative grid divide-y divide-[rgba(56,67,84,0.1)]">
              {creativeCoreSupports.map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4 sm:px-6"
                  data-animate-item
                >
                  <span className="font-mono text-[10px] leading-6 tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-1.5">
                    <h3 className="text-[1rem] leading-6 font-semibold tracking-[-0.02em] text-[var(--copy-strong)]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                      <BoldZynapseCore>{item.copy}</BoldZynapseCore>
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
        <div className="rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white p-7 shadow-[0_18px_42px_rgba(31,36,48,0.07)] sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] lg:items-center">
            <div className="space-y-5">
              <span className="eyebrow" data-animate-heading>
                Ergebnisse
              </span>
              <h2
                className="pb-[0.40em] font-display text-4xl leading-[1.20] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
                data-animate-heading
              >
                Bessere Bedingungen, mehr Orientierung,{" "}
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
                zählt. Die wichtigsten Signale bleiben sichtbar: Aufgabe, Rolle,
                Qualitätsziel und Review-Kontext.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {results.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white p-5 text-center shadow-[0_10px_22px_rgba(31,36,48,0.05)]"
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
            copy="Wenn du kreative Arbeit strategisch strukturieren kannst und lieber in echten Kampagnen als in Briefing-Chaos arbeitest. Zynapse ist für Beiträge gedacht, die in Review, Media und Testing anschlussfähig bleiben."
          />
        </div>
        <div
          className="self-center overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.06)]"
        >
          <ul className="grid">
            {profileFits.map((item, index) => (
              <li
                key={item}
                className={`grid gap-4 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)] ${
                  index > 0 ? "border-t border-[rgba(56,67,84,0.12)]" : ""
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.95rem] leading-6 text-[color:var(--copy-body)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:px-10"
        data-reveal-section
      >
        <div className="rounded-[0.55rem] bg-[var(--copy-strong)] p-6 text-white shadow-[0_18px_42px_rgba(31,36,48,0.12)] sm:p-7">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/58">
            Vergütung
          </p>
          <h2
            className="mt-4 font-display text-[2.35rem] leading-[0.96] font-semibold tracking-[-0.05em]"
            data-animate-heading
          >
            Scope sichtbar, bevor du zusagst.
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/74" data-animate-copy>
            <BoldZynapseCore>
              Zynapse Core soll kreative Arbeit planbarer machen. Dazu gehört,
              dass Rolle, Leistung und Vergütung vor Annahme sichtbar sind.
            </BoldZynapseCore>
          </p>
        </div>

        <div className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.06)]">
          {compensationNotes.map((item, index) => (
            <div
              key={item}
              className={`grid gap-4 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:px-6 ${
                index > 0 ? "border-t border-[rgba(56,67,84,0.12)]" : ""
              }`}
              data-animate-item
            >
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[1rem] leading-7 text-[color:var(--copy-body)]">
                <BoldZynapseCore>{item}</BoldZynapseCore>
              </p>
            </div>
          ))}
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
                spürbar verbessert
              </span>
              .
            </>
          }
          copy="Zynapse nimmt dir operative Komplexität ab, ohne dir die kreative Kontrolle zu entziehen. Du siehst früher, was gebraucht wird, wo dein Beitrag eingesetzt wird und welches Feedback wirklich relevant ist."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {creativeBenefits.map((benefit) => (
            <article
              key={benefit}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
            >
              <p className="text-[1.05rem] leading-7 text-[color:var(--copy-body)]">
                <BoldZynapseCore>{benefit}</BoldZynapseCore>
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.64fr)_minmax(16rem,0.36fr)] lg:items-center">
            <div className="space-y-3">
              <h2
                className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                data-animate-heading
              >
                <span data-animate-word>Bewirb dich</span> für den{" "}
                <span className="title-accent">Zynapse-Core</span>-Prozess.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Portfolio, Fokusbereiche und Cases: Der Bewerbungs-Flow ist auf
                echte Kampagnenarbeit gebaut, nicht auf generische Leads.
              </p>
            </div>
            <div className="flex justify-center" data-animate-item>
              <ButtonLink href="/apply" size="lg">
                Als AI Creative bewerben
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      </PageMotion>
    </>
  );
}
