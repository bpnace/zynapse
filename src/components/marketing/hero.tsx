import { ButtonLink } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid-hero";

export function Hero() {
  const heroCtaClassName = "w-full justify-center sm:w-[16rem]";
  const heroPrimaryCtaClassName =
    "w-full justify-center border border-[rgba(62,62,62,0.67)] bg-[var(--copy-strong)] text-white shadow-[0_10px_22px_rgba(31,36,48,0.05)] hover:border-[rgba(98,100,103,0.59)] hover:text-[var(--copy-strong)] focus-visible:border-[rgba(56,67,84,0.2)] focus-visible:text-[var(--copy-strong)] sm:w-[16rem]";
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
            maxOpacity={0.3}
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
          className="font-display text-[clamp(3.15rem,9vw,5.85rem)] leading-[0.88] pt-15 font-semibold tracking-[-0.055em] text-balance sm:px-[0.1em] sm:pr-[0.16em] lg:px-[0.12em]"
          data-animate-heading
        >
          Bessere <span data-animate-word>Video Ads, </span>ohne dass dein Team{" "}
          <span className="text-gradient">mehr koordinieren</span> muss.
        </h1>

        <div className="mt-24 w-full max-w-5xl lg:grid lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] lg:items-start lg:gap-8">
          <div className="space-y-6">
            <p
              className="mx-auto max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-lg sm:leading-8 lg:mx-0 lg:max-w-none lg:text-left"
              data-animate-copy
            >
                  Von Thema, Zielgruppe und Angebot bis zur Auswahl der
                  passenden AI Creatives hilft Zynapse Core dabei, dass jede
                  Kampagne mit dem richtigen kreativen Fit startet und nicht erst
                  in der Produktion sortiert werden muss.
            </p>
            <p
              className="mx-auto max-w-2xl text-sm leading-6 text-[color:var(--copy-soft)] lg:mx-0 lg:max-w-none lg:text-left"
              data-animate-copy
            >
              Für Brands, die mehr testen wollen, ohne jede Produktion
              neu aufzusetzen.
            </p>
          </div>

          <div
            className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col lg:items-start lg:justify-self-end"
            data-animate-item
          >
            <ButtonLink
              href="/request"
              size="lg"
              className={heroPrimaryCtaClassName}
              primaryFillClassName="bg-white"
            >
              Kampagne anfragen
            </ButtonLink>
            <ButtonLink
              href="/#ablauf"
              variant="secondary"
              size="lg"
              className={heroCtaClassName}
            >
              Ablauf ansehen
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
