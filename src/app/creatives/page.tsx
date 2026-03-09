import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageMotion } from "@/components/animation/page-motion";
import { buildMetadata } from "@/lib/seo";
import { creativeBenefits } from "@/lib/content/site";
import Image from "next/image";

export const metadata = buildMetadata({
  title: "Für Kreative – AI-Netzwerk für Kampagnen | Zynapse",
  description:
    "Zynapse für Kreative: Prompt Engineering, Creative Direction, Prompt Design, AI Production, AI Engineering und AI Strategy in einem skalierbaren Kampagnenfluss.",
  path: "/creatives",
});

const painPoints = [
  {
    title: "Kreativrollen arbeiten zu oft isoliert",
    description:
      "Prompt, Strategie, Produktion und Testing laufen getrennt. Dadurch geht Geschwindigkeit verloren, obwohl starke Ideen vorhanden sind.",
  },
  {
    title: "Wert verschwindet in operativer Koordination",
    description:
      "Statt an Hooks, Angles und Varianten zu arbeiten, fließt Zeit in Übergaben, Nachfragen und manuelle Produktionsschleifen.",
  },
  {
    title: "AI-Output bleibt ohne System unscharf",
    description:
      "Wenn Prompts, Creative Direction und Freigaben nicht zusammengeführt werden, entstehen Assets ohne klare Testlogik.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Kreativ-Architektur",
    description:
      "Du übersetzt das Brand-Briefing in Angles, Prompt-Routen, CTA-Logik und Testprioritäten. Das ist die Steuerung für alles, was folgt.",
  },
  {
    step: "02",
    title: "Rollenbasierte Umsetzung",
    description:
      "Prompt Engineering, Creative Direction, Prompt Design, AI Production, AI Engineering und AI Strategy greifen in einem klaren Ablauf ineinander.",
  },
  {
    step: "03",
    title: "Produktion & Export",
    description:
      "Das Studio baut Varianten in allen Formaten und Längen. Du reviewst strukturiert und gibst nur das frei, was zur Teststrategie passt.",
  },
];

const roleExamples = [
  {
    role: "Prompt Engineering",
    example:
      "Baut Prompt-Stacks pro Angle, damit ein Offer in mehreren Hook-Varianten konsistent ausgegeben wird.",
    output: "Mehr testbare Hooks ohne Qualitätsbruch zwischen Iterationen.",
  },
  {
    role: "Creative Direction",
    example:
      "Definiert Leitidee, visuelle Leitplanken und Tonalität pro Kampagne statt pro Einzelasset.",
    output: "Ein kohärenter Look über alle Varianten hinweg.",
  },
  {
    role: "Prompt Design",
    example:
      "Strukturiert Inputs für unterschiedliche Formate wie Reels, Shorts und Ads-Varianten.",
    output: "Formatgerechte Assets mit klarer Wiederholbarkeit.",
  },
  {
    role: "AI Production",
    example:
      "Orchestriert Rendering, Versionierung und Übergabe der Kreativ-Packs in produktionsfähiger Qualität.",
    output: "Schnellerer Turnaround bei gleichbleibender Produktionsqualität.",
  },
  {
    role: "AI Engineering",
    example:
      "Automatisiert Workflows für Prompting, Asset-Checks und Exportlogik.",
    output: "Weniger manuelle Schleifen im Daily-Betrieb.",
  },
  {
    role: "AI Strategy",
    example:
      "Priorisiert Kreativrouten anhand von Zielgruppe, Offer und Testhypothesen.",
    output: "Bessere Lernzyklen pro Kampagne statt reiner Output-Menge.",
  },
];

const profileFits = [
  "Du arbeitest in einer oder mehreren AI-Rollen und willst sie in einem System verbinden",
  "Du kannst Kampagnenlogik, Prompt-Qualität und Testing-Richtung zusammenführen",
  "Du willst nicht mehr in isolierten Einzelproduktionen arbeiten",
  "Du suchst ein Setup, das mit mehreren Brands und Sprints skalieren kann",
];

const results = [
  { value: "3×", label: "Mehr Output pro Sprint" },
  { value: "70%", label: "Weniger operative Schleifen" },
  { value: "6", label: "Rollen in einem klaren Flow" },
];

export default function CreativesPage() {
  return (
    <PageMotion>
      <section
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <span className="eyebrow" data-animate-heading>
          Für Kreative
        </span>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] lg:items-start">
          <div className="space-y-6">
            <h1
              className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
              data-animate-heading
            >
              Ein Track für alle <span className="title-accent">AI-Kreativrollen</span>.
            </h1>
            <p
              className="max-w-2xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Zynapse vereint kreative Köpfe in einem strukturierten Kampagnenfluss:
              von Prompt Engineering bis AI Strategy. Du führst die Kreativ-Logik,
              das Studio skaliert die Ausführung.
            </p>
            <div className="flex flex-wrap gap-3" data-animate-item>
              <ButtonLink href="/apply" size="lg">
                Bewerbung für Kreative starten
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="lg">
                Pläne & Preise
              </ButtonLink>
            </div>
          </div>
          <div className="flex lg:absolute lg:top-30 lg:right-12 lg:z-10">
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
          title="Starke Kreative verlieren Zeit in schwachen Prozessen."
          accent="schwachen Prozessen"
          copy="Viele Teams haben Talent, aber keinen durchgehenden Ablauf von Strategie über Prompting bis Produktion. Zynapse schließt diese Lücke mit klarer Rollenlogik."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <article
              key={point.title}
              className={`section-card section-surface-paper rounded-[var(--radius-card)] border-t-[3px] p-6 ${
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
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
        data-stagger="dense"
      >
        <SectionHeading
          eyebrow="Dein Workflow"
          title="Vom Brand-Briefing zur Kreativ-Maschine in drei Schritten."
          accent="Kreativ-Maschine"
          copy="Du konzentrierst dich auf Strategie, Prompting und Kreativ-Steuerung. Die operative Umsetzung läuft entlang eines klaren Produktionssystems."
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
          eyebrow="Kreativ-Beispiele"
          title="Sechs Rollen. Ein gemeinsamer Kampagnen-Output."
          accent="Sechs Rollen"
          copy="So kann dein Beitrag in Zynapse konkret aussehen, wenn mehrere AI-Disziplinen sauber zusammenspielen."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleExamples.map((entry) => (
            <article
              key={entry.role}
              className="section-card section-surface-paper rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] p-6"
            >
              <p className="font-mono text-xs tracking-[0.16em] uppercase text-[var(--accent-soft)]">
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
                Mehr Varianten, mehr Klarheit,{" "}
                <span className="title-accent">weniger Reibung</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Kreative, die mit Zynapse arbeiten, bringen Strategie und Produktion
                in einen messbaren Rhythmus statt in lose Einzelprojekte.
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
            title="Für wen der Track für Kreative passt."
            accent="Track für Kreative"
            copy="Wenn du kreative Arbeit strategisch strukturieren kannst und in einem skalierbaren Setup statt in Einzelchaos arbeiten willst."
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
          title="Was sich für dich konkret ändert."
          accent="konkret ändert"
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
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2
                className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                data-animate-heading
              >
                Bewirb dich für den{" "}
                <span className="title-accent">Track für Kreative</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Portfolio, Fokusbereiche und Cases: Der Bewerbungs-Flow ist auf
                echte Qualifizierung gebaut, nicht auf generische Leads.
              </p>
            </div>
            <ButtonLink href="/apply" size="lg" data-animate-item>
              Bewerbung starten
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
