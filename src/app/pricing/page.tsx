import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { pricingPlans } from "@/lib/content/pricing";
import { caseStudies } from "@/lib/content/cases";

export const metadata = buildMetadata({
  title: "Preise | Zynapse",
  description:
    "Drei Einstiegspunkte für Marken-, Growth- und Agentur-Teams plus Beispiel-Referenzen auf derselben Seite.",
  path: "/pricing",
});

function buildContactHref(planId: string) {
  return `/contact?tier=${encodeURIComponent(planId)}#kontaktformular`;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="Preise"
        title="Pakete für schnelle Tests, laufenden Growth und komplexere Team-Setups."
        description="Die Seite bündelt beides: erst die drei Preisstufen mit klarer Passung, danach Beispiel-Referenzen als Vorschau auf die Art von Cases, die später live hier gezeigt werden."
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
                  Für mehrere Marken oder Stakeholder.
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
                  <div
                    className={`grid gap-0 border ${
                      plan.featured ? "border-[rgba(191,106,83,0.16)]" : "border-[rgba(56,67,84,0.12)]"
                    }`}
                  >
                    {plan.deliverables.slice(0, 3).map((deliverable, index) => (
                      <div
                        key={deliverable}
                        className={`px-4 py-3 text-sm leading-6 ${
                          plan.featured
                            ? "bg-white/68 text-[color:var(--copy-body)]"
                            : "bg-white/70 text-[color:var(--copy-body)]"
                        } ${index > 0 ? (plan.featured ? "border-t border-[rgba(191,106,83,0.14)]" : "border-t border-[rgba(56,67,84,0.08)]") : ""}`}
                      >
                        {deliverable}
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
                Die längeren Infos stehen hier. Nicht in den Karten.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[color:var(--copy-body)]">
              So bleiben die Preisstufen oben schnell scannbar und die Einordnung
              darunter trotzdem vollständig.
            </p>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={`${plan.id}-detail`}
                className={`rounded-[var(--radius-card)] border p-5 ${
                  plan.featured
                    ? "border-[rgba(191,106,83,0.16)] bg-[rgba(255,249,243,0.94)]"
                    : "border-[rgba(56,67,84,0.12)] bg-white/76"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                    {plan.name}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]">
                    {plan.cadence}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Markiert als
                    </p>
                    <div className="mt-2 grid gap-2">
                      {plan.highlights.map((highlight) => (
                        <p key={highlight} className="border-l-[3px] border-[rgba(246,107,76,0.28)] pl-3 text-sm leading-6 text-[color:var(--copy-body)]">
                          {highlight}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Ideal für
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                      {plan.fit}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Zusammenarbeit
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                      {plan.collaboration}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Geeignet für
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                      {plan.audience}
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
            title="Dummy-Referenzen als Vorschau auf spätere echte Cases."
            accent="Dummy-Referenzen"
            copy="Diese Beispiele sind Platzhalter. Sie zeigen aber bereits die Struktur, in der spätere reale Ergebnisse, Kennzahlen und Kampagnen-Setups aufbereitet werden."
          />
          <div className="rounded-full border border-[rgba(56,67,84,0.12)] bg-white/76 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--copy-soft)]">
            Aktuell Demo-Daten
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
