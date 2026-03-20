import { ButtonLink } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid-hero";

export function Hero() {
  const gridMask =
    "radial-gradient(circle at 50% 42%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.9) 34%, rgba(0,0,0,0.46) 60%, transparent 82%)";

  return (
    <section
      className="shadow-bottom relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-28 overflow-hidden bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(255,248,242,0.94)_34%,rgba(240,240,240,1)_100%)]"
      data-hero
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 76% 18%, rgba(249,197,106,0.22), transparent 28%), radial-gradient(circle at 18% 34%, rgba(224,94,67,0.16), transparent 24%), linear-gradient(180deg, rgba(255,252,248,0.32), rgba(255,248,242,0.06) 45%, rgba(240,240,240,0.16) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[78%]"
          style={{
            WebkitMaskImage: gridMask,
            maskImage: gridMask,
          }}
        >
          <FlickeringGrid
            className="h-full w-full opacity-[0.92]"
            squareSize={5}
            gridGap={8}
            flickerChance={0.28}
            color="rgb(224, 94, 67)"
            maxOpacity={0.30}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,252,248,0.02) 0%, rgba(255,252,248,0.34) 44%, rgba(240,240,240,0.88) 100%)",
          }}
        />
      </div>

      <div
        className="relative z-10 mx-auto flex min-h-[48rem] flex-col items-center justify-center px-6 pb-16 text-center sm:px-10 sm:pt-48 sm:pb-20 lg:px-14 lg:pt-40 lg:pb-24 xl:px-18"
        data-hero-intro
      >
        <h1
          className="font-display text-[clamp(3.15rem,9vw,5.85rem)] leading-[0.88] font-semibold tracking-[-0.055em] pt-15 text-balance sm:px-[0.1em] sm:pr-[0.16em] lg:px-[0.12em]"
          data-animate-heading
        >
          Wie aus einer{" "}
          <span data-animate-word>Brand-Anfrage</span>{" "}
          ein{" "}
          <span className="text-gradient">kuratiertes Kampagnen-Setup</span>
          {" "}
          <span data-animate-word>wird.</span>
        </h1>

        <div className="mt-28 w-full max-w-5xl lg:grid lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:items-start lg:gap-8">
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
              Anfrage starten
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
