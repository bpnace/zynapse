import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="shadow-bottom relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-28 overflow-hidden"
      data-hero
    >
      {/* ── Ambient gradient orbs ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
        data-hero-orb-stage
      >
        <div
          className="absolute -top-18 right-[4%] h-[34rem] w-[34rem] rounded-full opacity-[0.34] blur-[64px] will-change-transform"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }}
          data-hero-orb
        />
        <div
          className="absolute top-[48%] -left-[8%] h-[39rem] w-[39rem] rounded-full opacity-[0.28] blur-[72px] will-change-transform"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 65%)" }}
          data-hero-orb
        />
        <div
          className="absolute bottom-[4%] left-[38%] h-[31rem] w-[31rem] rounded-full opacity-[0.24] blur-[58px] will-change-transform"
          style={{ background: "radial-gradient(circle, var(--lavender), transparent 65%)" }}
          data-hero-orb
        />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 mx-auto flex min-h-[48rem] flex-col items-center justify-center px-6 pt-20 pb-16 text-center sm:px-10 sm:pt-48 sm:pb-20 lg:px-14 lg:pt-40 lg:pb-24 xl:px-18"
        data-hero-intro
      >
        <h1
          className="max-w-6xl px-[0.05em] font-display text-[3.4rem] leading-[0.88] font-semibold tracking-[-0.06em] text-balance sm:px-[0.075em] sm:text-[4.8rem] lg:px-[0.1em] lg:text-[6rem]"
          data-animate-heading
        >
          Aus einer{" "}
          <span data-animate-word>Brand-Anfrage</span>{" "}
          wird ein{" "}
          <span className="text-gradient">kuratiertes Kampagnen-Setup</span>,
          das schneller in{" "}
          <span data-animate-word>Produktion geht.</span>
        </h1>

        <div className="mt-8 w-full max-w-5xl lg:grid lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:items-start lg:gap-8">
          <p
            className="mx-auto max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-none lg:text-left"
            data-animate-copy
          >
            Brands kommen mit Ziel, Offer, Stil und Budget. Zynapse
            kuratiert das passende Spezialist:innen-Setup und
            orchestriert daraus Kampagnenlogik, Produktion, Review und
            markenfähige Varianten für Paid Social, Reels und weitere
            Short-Form-Formate.
          </p>

          <div
            className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col lg:items-start lg:justify-self-end"
            data-animate-item
          >
            <ButtonLink href="/request" size="lg">
              Brand-Anfrage starten
            </ButtonLink>
            <ButtonLink href="/apply" variant="secondary" size="lg">
              Als Kreative bewerben
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
