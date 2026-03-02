import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";
import { managerBenefits } from "@/lib/content/site";

export const metadata = buildMetadata({
  title: "Für Social Media Manager – Kampagnenlogik skalieren | Zynapse",
  description:
    "Zynapse für Social Media Manager: Kampagnenplanung, Hooks und Testing-Logik als bezahlte Kernleistung – mit skalierbarem Output ohne operative Überlastung.",
  path: "/managers",
});

const painPoints = [
  {
    title: "Strategie geht in Produktion unter",
    description:
      "Du planst Angles, Hooks und Testing-Richtung – aber 80 % deiner Zeit fließt in Briefings, Creator-Koordination und Asset-Management statt in strategische Arbeit.",
  },
  {
    title: "Erlöse sind schwer planbar",
    description:
      "Jeder Kunde heißt neues Projektchaos. Ohne skalierbaren Produktionsprozess bleibt dein Umsatz an deine eigene Kapazität gekettet.",
  },
  {
    title: "Output-Qualität schwankt",
    description:
      "Wenn jedes Video einzeln gebrieft, produziert und freigegeben wird, fehlt die Systematik für konsistentes Creative Testing über Kampagnen hinweg.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Kampagnenplanung",
    description:
      "Du baust aus dem Marken-Briefing Angles, Hooks, CTA-Logik und Testprioritäten. Dein strategisches Wissen wird zur Grundlage des gesamten Packs.",
  },
  {
    step: "02",
    title: "Briefing-Paket",
    description:
      "Aus deiner Kampagnenlogik entsteht ein strukturiertes Briefing-Paket mit Messaging, Formatregeln und klaren Freigabegrenzen – automatisch übergabebereit.",
  },
  {
    step: "03",
    title: "Skalierung & Export",
    description:
      "Das Studio produziert Varianten in allen Formaten und Längen. Du reviewst die Ergebnisse, ohne selbst produzieren zu müssen.",
  },
];

const profileFits = [
  "Du führst Messaging, Hooks und Testing-Richtung für Performance-Kampagnen",
  "Du willst Kampagnenlogik als bezahlte Kernleistung positionieren",
  "Du hast Cases mit D2C-, E-Commerce- oder Growth-Kunden",
  "Du suchst einen Produktionsprozess, der mit deinen Kunden skaliert",
];

const results = [
  { value: "3×", label: "Mehr Output pro Kunde" },
  { value: "80%", label: "Weniger operativer Aufwand" },
  { value: "∞", label: "Skalierbar ohne Teamaufbau" },
];

export default function ManagersPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <span className="eyebrow" data-animate-heading>
          Für Social Media Manager
        </span>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] lg:items-end">
          <div className="space-y-6">
            <h1
              className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
              data-animate-heading
            >
              Deine Strategie führt. Nicht dein{" "}
              <span className="title-accent">Produktionschaos</span>.
            </h1>
            <p
              className="max-w-2xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Du führst Kampagnenlogik, Messaging und Testing-Richtung. Zynapse
              übernimmt die operative Skalierung – damit dein Wert nicht im
              Tagesgeschäft verschwindet.
            </p>
            <div className="flex flex-wrap gap-3" data-animate-copy>
              <ButtonLink href="/apply" size="lg">
                Bewerbung starten
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" size="lg">
                Pläne & Preise
              </ButtonLink>
            </div>
          </div>
          <div
            className="flex flex-wrap gap-2 lg:justify-end"
            data-animate-item
          >
            {["Planbare Erlöse", "Kampagnen-Packs", "Kein Creator-Chaos"].map(
              (badge) => (
                <Badge key={badge} tone="mint">
                  {badge}
                </Badge>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Bekannte Probleme"
          title="Dein strategischer Wert verschwindet in operativer Überlastung."
          accent="operativer Überlastung"
          copy="Social Media Manager stecken zwischen Kampagnenplanung und Produktionskoordination. Das Ergebnis: gute Strategien, aber zu wenig testbare Creatives – und Erlöse, die an der eigenen Kapazität hängen."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <article
              key={point.title}
              className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 border-t-[3px] ${
                index === 0
                  ? "border-t-[rgba(224,94,67,0.24)]"
                  : index === 1
                    ? "border-t-[rgba(249,197,106,0.3)]"
                    : "border-t-[rgba(56,67,84,0.2)]"
              }`}
              data-animate-item
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
          eyebrow="Dein Workflow"
          title="Vom Marken-Briefing zum skalierbaren Kampagnen-Pack."
          accent="skalierbaren Kampagnen-Pack"
          copy="Du konzentrierst dich auf das, was dich wertvoll macht: Kampagnenlogik, Hooks und Testing-Richtung. Der Rest läuft strukturiert weiter."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {howItWorks.map((step) => (
            <article
              key={step.step}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
              data-animate-item
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
                Mehr Kunden, mehr Output,{" "}
                <span className="title-accent">weniger Stress</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Manager, die mit Zynapse arbeiten, skalieren ihren Output pro
                Kunde – ohne Team aufbauen oder operative Kapazität verdoppeln zu
                müssen.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3" data-animate-item>
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

      {/* ── Manager Profile Fit ── */}
      <section
        className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10"
        data-reveal-section
      >
        <div className="space-y-5">
          <SectionHeading
            eyebrow="Manager-Profil"
            title="Für wen Zynapse wirklich passt."
            accent="wirklich passt"
            copy="Wenn du Messaging, Testing und Kampagnenstruktur sicher führen kannst, aber nicht mehr jede Produktionsschleife selbst tragen willst."
          />
        </div>
        <div
          className="section-card section-surface-paper rounded-[var(--radius-card)] p-6"
          data-animate-item
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

      {/* ── Benefits ── */}
      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Deine Vorteile"
          title="Was sich für dich konkret ändert."
          accent="konkret ändert"
          copy="Zynapse nimmt dir die operative Skalierung ab – nicht die strategische Kontrolle."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {managerBenefits.map((benefit) => (
            <article
              key={benefit}
              className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
              data-animate-item
            >
              <p className="text-[1.05rem] leading-7 text-[color:var(--copy-body)]">
                {benefit}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
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
                <span className="title-accent">Manager-Track</span>.
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Portfolio, Fokuskanäle und Cases – der Bewerbungs-Flow ist auf
                echte Qualifizierung gebaut, nicht auf generische Leads.
              </p>
            </div>
            <ButtonLink href="/apply" size="lg" data-animate-item>
              Bewerbung starten
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
