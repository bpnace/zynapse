import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageMotion } from "@/components/animation/page-motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Studio – Wie Zynapse Videoproduktion neu denkt | Zynapse",
  description:
    "Zynapse verbindet Kampagnenlogik, kreative Skalierung und klare Rollenverteilung zu einem Produktionssystem für Performance-Video. Kein Agenturmodell, kein Creator-Marktplatz – sondern ein strukturierter Workflow.",
  path: "/about",
});

const pillars = [
  {
    title: "Kampagnenlogik vor Footage",
    description:
      "Jede kreative Variante beginnt mit Strategie: Angles, Hooks, CTA-Routen und Testprioritäten stehen, bevor ein einziges Frame entsteht. Clips werden Teil eines Systems – nicht isolierte Assets.",
  },
  {
    title: "Klare Rollen, klare Übergaben",
    description:
      "Brands geben Kontext und Freigaben. Kreative führen Strategie und Testing-Richtung. Das Studio skaliert die Ausführung. Kein Rollenchaos, keine doppelten Zuständigkeiten.",
  },
  {
    title: "Skalierung ohne Qualitätsverlust",
    description:
      "Aus einem Angle entstehen Cuts, Längen und Platzierungsvarianten – ohne neue Produktionsschleifen. Mehr Output bei gleicher Kontrolle.",
  },
];

const codex = [
  {
    number: "01",
    title: "Struktur schlägt Volumen",
    description:
      "Kein Output ohne Kampagnenlogik. Jede Variante hat ein Angle, ein Hook-Ziel und eine Testperspektive – oder wird nicht produziert.",
  },
  {
    number: "02",
    title: "Verantwortung ist nicht verhandelbar",
    description:
      "Wer liefert, wer freigibt, wer steuert – das steht vor dem ersten Briefing fest. Rollenklarheit ist kein Nice-to-have, sondern operative Grundlage.",
  },
  {
    number: "03",
    title: "Kein Video ohne Freigabespur",
    description:
      "Nichts geht blind live. Jede Variante durchläuft einen Review-Prozess, bevor sie in Ads oder Social ausgespielt wird.",
  },
  {
    number: "04",
    title: "Schnelligkeit durch Prozess, nicht durch Shortcuts",
    description:
      "72 Stunden vom Briefing zur Freigabe. Nicht durch Abkürzungen, sondern weil der Workflow Schleifen eliminiert, bevor sie entstehen.",
  },
  {
    number: "05",
    title: "System statt Tool",
    description:
      "Zynapse ersetzt keine Teams – es verbindet sie. Brands, Kreative und Studio arbeiten in einem gemeinsamen Produktionsfluss, nicht in parallelen Silos.",
  },
];

const differences = [
  {
    label: "Agentur",
    zynapse: "Feste Rollen, strukturierter Workflow, planbarer Output",
    traditional: "Projektbasiert, wechselnde Teams, lange Abstimmung",
  },
  {
    label: "Creator-Marktplatz",
    zynapse: "Kampagnenlogik vor Produktion",
    traditional: "Creator-Sourcing vor Strategie",
  },
  {
    label: "Inhouse",
    zynapse: "Skalierbar ohne Teamaufbau",
    traditional: "Output begrenzt durch Kapazität",
  },
  {
    label: "Freelancer",
    zynapse: "Integrierter Review- und Freigabeprozess",
    traditional: "Fragmentierte Kommunikation, kein System",
  },
];

const values = [
  {
    title: "Transparenz",
    description:
      "Vom Briefing bis zur Freigabe ist jeder Schritt nachvollziehbar. Keine Black Box, keine versteckten Entscheidungen.",
  },
  {
    title: "Effizienz",
    description:
      "Weniger Schleifen, schnellere Ergebnisse. Der Prozess ist so gebaut, dass Reibung gar nicht erst entsteht.",
  },
  {
    title: "Qualität",
    description:
      "Skalierung heißt nicht Masse statt Klasse. Jede Variante folgt der Kampagnenlogik – mit klarem Angle, Hook und Testziel.",
  },
  {
    title: "Partnerschaft",
    description:
      "Zynapse funktioniert nur, wenn alle Seiten funktionieren. Brands, Kreative und Studio sind gleichwertige Teile eines Systems.",
  },
];

const studioGlossary = [
  {
    term: "Kampagnenlogik",
    explanation:
      "Welche Botschaft zuerst getestet wird, für wen sie gedacht ist und welche CTA daraus folgen.",
  },
  {
    term: "Skalierung",
    explanation:
      "Aus einem starken Angle entstehen Formate, Cuts und Platzierungsvarianten ohne neue Produktionsschleifen.",
  },
  {
    term: "Rollenklarheit",
    explanation:
      "Brand, Kreative und Studio arbeiten mit klaren Zuständigkeiten statt mit parallelen Abstimmungen.",
  },
];

export default function AboutPage() {
  return (
    <PageMotion>
      {/* ── Hero ── */}
      <section
        className="mx-auto flex min-h-[calc(100svh-5.25rem)] w-full max-w-7xl flex-col justify-center gap-10 px-6 pt-18 pb-20 sm:px-8 lg:px-10 lg:pt-24 lg:pb-24"
        data-reveal-section
      >
        <span className="eyebrow" data-animate-heading>
          Über Zynapse Studio
        </span>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(21rem,0.4fr)] lg:items-stretch">
          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <h1
                className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
                data-animate-heading
              >
                Videoproduktion als <span className="title-accent">System</span>,
                nicht als <span data-animate-word>Einzelprojekt.</span>
              </h1>
              <p
                className="max-w-2xl text-lg leading-8 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Zynapse verbindet Kampagnenlogik, kreative Skalierung und klare
                Rollenverteilung. Kein Agenturmodell, kein Creator-Marktplatz
                und kein loses Produktionsnetzwerk, sondern ein strukturierter
                Produktionsfluss für Performance-Video.
              </p>
              <p
                className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Das Studio übersetzt Briefings in testbare Kreativ-Strecken:
                mit klaren Angles, sauberen Review-Schritten und Varianten, die
                für Paid Social, Landingpage-Traffic und Performance-Retargeting
                gedacht sind. Nicht mehr Content um des Outputs willen, sondern
                Material, das in einem Kampagnensystem Sinn ergibt.
              </p>
            </div>

            <div
              className="grid gap-4 sm:grid-cols-3"
              data-animate-item
            >
              {[
                {
                  label: "Wofür das Studio gebaut ist",
                  value: "Performance-Video mit Testlogik",
                },
                {
                  label: "Wie gearbeitet wird",
                  value: "Briefing, Review und Varianten in einem Fluss",
                },
                {
                  label: "Was ihr zurückbekommt",
                  value: "Kontrollierbaren Output statt Einzelabgaben",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[0.9rem] border border-[rgba(25,28,33,0.08)] bg-[rgba(255,255,255,0.62)] px-4 py-4 backdrop-blur-[10px]"
                >
                  <p className="text-[0.72rem] leading-4 font-medium tracking-[0.12em] text-[color:var(--copy-muted)] uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--copy-strong)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside
            className="section-card section-surface-paper relative overflow-hidden rounded-[calc(var(--radius-panel)+0.05rem)] p-5 sm:p-6"
            data-animate-item
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(224,94,67,0),rgba(224,94,67,0.42),rgba(224,94,67,0))]" />
            <p
              className="text-[0.74rem] leading-4 font-medium tracking-[0.14em] text-[var(--accent-strong)] uppercase"
            >
              Studio Preview
            </p>
            <div className="mt-4 grid gap-5">
              <div className="relative overflow-hidden rounded-[1.2rem] border border-[rgba(25,28,33,0.08)] bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(241,232,224,0.88)_52%,rgba(231,218,208,0.72))] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,94,67,0.16),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(249,197,106,0.24),transparent_44%)]" />
                <div className="relative flex aspect-[4/5] flex-col justify-between rounded-[0.95rem] border border-dashed border-[rgba(25,28,33,0.14)] bg-[rgba(255,255,255,0.34)] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.72rem] leading-4 font-medium tracking-[0.12em] text-[color:var(--copy-muted)] uppercase">
                        Platzhalter für Studio-Bild
                      </p>
                      <p className="mt-2 max-w-[16rem] font-display text-2xl leading-[1] tracking-[-0.04em] text-[var(--copy-strong)]">
                        Produktionsumgebung, Review-Momente und Materialfluss.
                      </p>
                    </div>
                    <span className="font-display text-4xl leading-none text-[rgba(224,94,67,0.34)]">
                      Z
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-[0.85rem] border border-[rgba(25,28,33,0.08)] bg-[rgba(255,255,255,0.55)] px-4 py-3">
                      <p className="text-[0.7rem] leading-4 font-medium tracking-[0.12em] text-[color:var(--copy-muted)] uppercase">
                        Was hier später sichtbar sein kann
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                        Setups, Freigabeschleifen, Schnittsituationen oder ein
                        Einblick in den Produktionsprozess des Studios.
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-[rgba(25,28,33,0.08)] pt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                      <span>72h Turnaround</span>
                      <span>Review-ready</span>
                      <span>Paid Social</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1rem] border border-[rgba(25,28,33,0.08)] bg-[rgba(255,255,255,0.54)] p-4">
                <p className="text-[0.72rem] leading-4 font-medium tracking-[0.12em] text-[color:var(--copy-muted)] uppercase">
                  Drei Begriffe, die die Arbeitsweise beschreiben
                </p>
                <div className="mt-4 grid gap-3">
                  {studioGlossary.map((entry) => (
                    <div
                      key={entry.term}
                      className="grid gap-1 border-b border-[rgba(25,28,33,0.07)] pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="font-display text-[1.05rem] leading-6 tracking-[-0.03em] text-[var(--copy-strong)]">
                        {entry.term}
                      </p>
                      <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                        {entry.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Mission ── */}
      <section
        className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-warm relative overflow-hidden rounded-[calc(var(--radius-panel)+0.1rem)] border-[rgba(191,106,83,0.16)] px-7 pt-10 pb-7 sm:px-9 sm:pt-14 sm:pb-9">
          {/* Decorative glyph */}
          <span
            className="pointer-events-none absolute -top-6 -right-4 select-none font-display text-[12rem] leading-none font-bold text-[var(--accent)] opacity-[0.04]"
            aria-hidden="true"
          >
            ◆
          </span>

          <div className="relative flex flex-col items-center text-center">
            <span className="eyebrow" data-animate-heading>
              Unsere Mission
            </span>
            <h2
              className="mt-5 max-w-3xl font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl lg:text-6xl"
              data-animate-heading
            >
              Kreativ-<span data-animate-word>Testing</span>{" "}
              <span className="title-accent">zugänglich</span> machen.
            </h2>
            <p
              className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
              data-animate-copy
            >
              Systematisches Kreativ-Testing ist der größte Hebel für
              Performance. Aber der Weg dahin – Briefings,
              Produktionsschleifen, Freigaben, Varianten – ist zu aufwändig.
              Zynapse macht ihn planbar, schnell und wiederholbar.
            </p>
          </div>

          <div
            className="relative mt-10 grid gap-3 sm:grid-cols-3"
            data-animate-item
          >
            {[
              { value: "72h", label: "Briefing bis Freigabe" },
              { value: "18+", label: "testbare Varianten pro Briefing" },
              { value: "3→1", label: "Rollen, ein Produktionsfluss" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-[0.55rem] border border-[rgba(191,106,83,0.12)] bg-[rgba(255,255,255,0.55)] px-5 py-4 text-center"
              >
                <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--accent-strong)]">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm leading-5 text-[color:var(--copy-body)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
        data-stagger="dense"
      >
        <SectionHeading
          eyebrow="Wie wir arbeiten"
          title="Drei Prinzipien, die jeden Produktionsschritt leiten."
          accent="Drei Prinzipien"
          copy="Zynapse ist kein Tool mit Features – es ist ein Produktionssystem, das auf drei Grundsätzen aufbaut und jeden Schritt daran misst."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 border-t-[3px] ${
                index === 0
                  ? "border-t-[rgba(224,94,67,0.24)]"
                  : index === 1
                    ? "border-t-[rgba(249,197,106,0.3)]"
                    : "border-t-[rgba(185,178,255,0.28)]"
              }`}
              data-animate-item
            >
              <h3 className="font-display text-[1.5rem] leading-[1] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                {pillar.title}
              </h3>
              <p className="mt-4 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Codex ── */}
      <section
        className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-contrast rounded-[var(--radius-card)] p-7 sm:p-9">
          <div className="space-y-5">
            <span className="eyebrow" data-animate-heading>
              Der Zynapse Codex
            </span>
            <h2
              className="max-w-3xl font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
              data-animate-heading
            >
              Fünf <span data-animate-word>Regeln</span>, an denen wir jede{" "}
              <span className="title-accent">Entscheidung</span> messen.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-1">
            {codex.map((item) => (
              <div
                key={item.number}
                className="grid items-start gap-4 rounded-[0.55rem] border border-[rgba(56,67,84,0.12)] bg-[rgba(255,255,255,0.68)] p-5 sm:grid-cols-[3.5rem_1fr]"
                data-animate-item
              >
                <span className="font-display text-[2rem] leading-none font-semibold tracking-[-0.04em] text-[var(--accent-strong)]">
                  {item.number}
                </span>
                <div>
                  <h3 className="font-display text-[1.25rem] leading-[1.1] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Grundsätze"
          title="Was Zynapse antreibt – und was nicht."
          accent="antreibt"
          copy="Kein Feature-Wettrüsten, kein Tempo um jeden Preis. Ein Produktionssystem, das Kontrolle, Qualität und Skalierung zusammenbringt."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <article
              key={value.title}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
              data-animate-item
            >
              <h3 className="font-display text-[1.5rem] leading-[1] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                {value.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Comparison ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Vergleich"
          title="Was Zynapse von klassischen Modellen unterscheidet."
          accent="unterscheidet"
          copy="Agenturen, Creator-Marktplätze, Inhouse-Teams und Freelancer lösen Teile des Problems. Zynapse verbindet Strategie, Produktion und Freigabe in einem System."
        />
        <div className="grid gap-4">
          {differences.map((diff) => (
            <div
              key={diff.label}
              className="section-card section-surface-paper grid items-center gap-4 rounded-[var(--radius-card)] p-5 sm:grid-cols-[0.25fr_0.375fr_0.375fr]"
              data-animate-item
            >
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                {diff.label}
              </span>
              <div className="flex items-start gap-2.5 rounded-[0.55rem] border border-[rgba(156,244,215,0.22)] bg-[rgba(240,255,248,0.5)] px-4 py-3 text-[0.9rem] leading-6 text-[color:var(--copy-body)]">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(156,244,215,0.28)] text-[10px] font-bold text-[#236851]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {diff.zynapse}
              </div>
              <div className="rounded-[0.55rem] border border-[rgba(56,67,84,0.1)] bg-[rgba(56,67,84,0.04)] px-4 py-3 text-[0.9rem] leading-6 text-[color:var(--copy-soft)]">
                {diff.traditional}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
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
              <ButtonLink href="/apply" variant="secondary" size="lg">
                Bewerbung für Kreative
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </PageMotion>
  );
}
