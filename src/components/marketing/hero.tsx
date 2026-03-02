import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { heroMetrics } from "@/lib/content/site";

export function Hero() {
  return (
    <section
      className="shadow-bottom relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-28 pb-14"
      data-hero
    >
      <div className="relative min-h-[50rem] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/hero/ntJkU5pPeS.png"
            alt="Zynapse hero background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))]" />
        </div>

        {/* Demo UI layer intentionally parked. Restore the old demo UI panel here to switch back quickly. */}

        <div
          className="relative z-10 min-h-[50rem] px-0 py-0"
          data-hero-intro
        >
          <div className="h-full w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-[54%]">
            <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.1))] px-6 pt-32 pb-8 shadow-[18px_0_50px_rgba(31,36,48,0.08)] backdrop-blur-[25px] sm:px-8 sm:pt-36 sm:pb-8 lg:px-10 lg:pt-36 lg:pb-10">
              <div className="space-y-5">
                <span className="eyebrow">Produktionssystem für Videokampagnen</span>
                <div className="space-y-4">
                  <h1 className="max-w-3xl font-display text-5xl leading-[0.88] font-semibold tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.95rem]">
                    Vom Briefing zur{" "}
                    <span className="text-gradient">fertigen Videokampagne</span>.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[color:var(--copy-muted)] sm:text-lg sm:leading-8">
                    Marken definieren Produkt, Ziel, Stil und Budget. Social Media
                    Manager uebersetzen das in Kampagnenlogik. Zynapse Studio skaliert
                    daraus ein sichtbares Kampagnen-Board mit freigabebereiten Varianten
                    fuer TikTok, Reels und Shorts.
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
                    className="rounded-sm bg-white/82 px-5 py-4 shadow-[0_12px_28px_rgba(31,36,48,0.06)]"
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
