import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { heroMetrics } from "@/lib/content/site";
import { campaignAngles, videoVariants } from "@/lib/mock-data/studio";

const reviewQueue = [
  {
    title: "Hook-Stack",
    detail: "Pain-first Intros priorisiert für kalte Zielgruppen-Tests.",
  },
  {
    title: "Angebots-Framing",
    detail: "Starter-Bundle-CTA fixiert über alle Conversion-Cuts.",
  },
  {
    title: "Marken-Leitplanken",
    detail: "Claims und Belege geprüft vor finalem Export.",
  },
] as const;

export function Hero() {
  const sampleVariants = videoVariants.slice(0, 4);
  const sampleAngles = campaignAngles.slice(0, 2);

  return (
    <section
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-28 pb-14"
      data-hero
    >
      <div className="relative min-h-[50rem] overflow-hidden bg-[linear-gradient(180deg,#f6f1ea_0%,#ece7df_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(246,107,76,0.16),transparent_20%),radial-gradient(circle_at_84%_12%,rgba(249,197,106,0.18),transparent_18%),radial-gradient(circle_at_88%_78%,rgba(156,244,215,0.12),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.08))]" />
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(43,52,67,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(43,52,67,0.05)_1px,transparent_1px)] [background-size:84px_84px]" />

        <div className="absolute inset-0" data-hero-panel>
          <div className="flex h-full min-h-[50rem] flex-col">
            <div className="flex items-center justify-between border-b border-[color:rgba(34,42,55,0.1)] bg-[rgba(255,255,255,0.4)] px-6 py-4 backdrop-blur-[10px] sm:px-8 lg:px-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--mint)]" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[rgba(60,70,86,0.58)]">
                    Demo-Oberfläche
                  </p>
                  <p className="text-sm font-semibold text-[#1f2633]">
                    Kampagnen-Orchestrierung
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <Badge tone="accent">Paid-Social-Launch</Badge>
                <Badge tone="mint">Freigabebereit</Badge>
              </div>
            </div>

            <div className="grid flex-1 gap-4 px-6 py-6 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1.12fr)_18rem]">
              <div className="grid min-h-0 gap-4">
                <section className="rounded-[2rem] border border-[rgba(31,40,53,0.08)] bg-[rgba(249,246,241,0.78)] p-4 shadow-[0_24px_50px_rgba(31,36,48,0.08)] backdrop-blur-[10px]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                        Kampagnen-Pack
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#1e2430]">
                        Strategiespuren mit echter Produktionsstruktur
                      </h2>
                    </div>
                    <div className="rounded-[1rem] border border-[rgba(31,40,53,0.08)] bg-white px-3 py-2 text-right shadow-[0_14px_28px_rgba(31,36,48,0.08)]">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(60,70,86,0.54)]">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#1f2633]">
                        Bereit zur Freigabe
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    {sampleAngles.map((angle) => (
                      <article
                        key={angle.title}
                        className="rounded-[1.4rem] border border-[rgba(31,40,53,0.08)] bg-white p-4 shadow-[0_18px_34px_rgba(31,36,48,0.08)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent-soft)]">
                              {angle.title}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#1f2633]">
                              {angle.angle}
                            </h3>
                          </div>
                          <Badge>{angle.lengths.join(" / ")}</Badge>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#657083]">
                          {angle.hooks.map((hook) => (
                            <li key={hook}>{hook}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-[rgba(31,40,53,0.08)] bg-[rgba(249,246,241,0.78)] p-4 shadow-[0_24px_50px_rgba(31,36,48,0.08)] backdrop-blur-[10px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                        Output-Board
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#1e2430]">
                        Freigabebereite Varianten
                      </h2>
                    </div>
                    <Badge tone="accent">Kurzformat-Export</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {sampleVariants.map((variant) => (
                      <article
                        key={variant.id}
                        className="rounded-[1.4rem] border border-[rgba(31,40,53,0.08)] bg-white p-4 shadow-[0_18px_34px_rgba(31,36,48,0.08)]"
                      >
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[rgba(60,70,86,0.58)]">
                          <span>{variant.angle}</span>
                          <span>{variant.format}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#1f2633]">
                          {variant.hookTitle}
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge>{variant.length}</Badge>
                          <Badge tone="mint">{variant.objective}</Badge>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="rounded-[2rem] border border-[rgba(31,40,53,0.08)] bg-[rgba(244,240,233,0.82)] p-4 shadow-[0_24px_50px_rgba(31,36,48,0.08)] backdrop-blur-[10px]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-soft)]">
                    Freigabe-Spur
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#1f2633]">
                    Letzte Prüfung vor dem Export
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {reviewQueue.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.25rem] border border-[rgba(31,40,53,0.08)] bg-white px-3.5 py-3 shadow-[0_14px_28px_rgba(31,36,48,0.08)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#1f2633]">
                          {item.title}
                        </p>
                        <span className="rounded-full bg-[rgba(156,244,215,0.26)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f7a60]">
                          fertig
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#657083]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-[rgba(31,40,53,0.08)] bg-white p-4 shadow-[0_14px_28px_rgba(31,36,48,0.08)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(60,70,86,0.58)]">
                    Export-Status
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      ["TikTok 9:16", "94%"],
                      ["Meta 4:5", "91%"],
                      ["Reels 1:1", "89%"],
                    ].map(([label, width]) => (
                      <div key={label}>
                        <div className="mb-1.5 flex items-center justify-between text-xs text-[#657083]">
                          <span>{label}</span>
                          <span>{width}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[rgba(38,47,60,0.1)]">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),#f0a84d)]"
                            style={{ width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div
          className="relative z-10 min-h-[50rem] px-0 py-0"
          data-hero-intro
        >
          <div className="h-full w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-[54%]">
            <div className="flex h-full flex-col justify-between border-r border-[rgba(255,255,255,0.34)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.34))] px-6 pt-32 pb-8 shadow-[18px_0_50px_rgba(31,36,48,0.08)] backdrop-blur-[34px] sm:px-8 sm:pt-36 sm:pb-8 lg:px-10 lg:pt-36 lg:pb-10">
              <div className="space-y-5">
                <span className="eyebrow">Produktionssystem für Videokampagnen</span>
                <div className="space-y-4">
                  <h1 className="max-w-3xl font-display text-5xl leading-[0.88] font-semibold tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.95rem]">
                    Von einem Brief zur{" "}
                    <span className="text-gradient">fertigen Videokampagne</span>.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[color:var(--copy-muted)] sm:text-lg sm:leading-8">
                    Marken definieren Produkt, Ziel, Stil und Budget. Social Media Manager
                    übersetzen das in Kampagnenlogik. Zynapse Studio skaliert daraus ein
                    sichtbares Kampagnen-Board mit freigabebereiten Varianten für TikTok,
                    Reels und Shorts.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/request" size="lg">
                    Kampagne anfragen
                  </ButtonLink>
                  <ButtonLink href="/apply" variant="secondary" size="lg">
                    Als Social Media Manager beitreten
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-3 pt-8 sm:grid-cols-3 lg:pt-12">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.45rem] bg-white/82 px-5 py-4 shadow-[0_12px_28px_rgba(31,36,48,0.06)]"
                    data-hero-metric
                  >
                    <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--accent)]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--copy-muted)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none h-[50rem] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
