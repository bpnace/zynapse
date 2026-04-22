import { ButtonLink } from "@/components/ui/button";
import { brandBenefits, creativeBenefits } from "@/lib/content/site";

function BenefitColumn({
  title,
  headline,
  copy,
  benefits,
  href,
  cta,
  tone,
  glyph,
}: {
  title: string;
  headline: React.ReactNode;
  copy: string;
  benefits: string[];
  href: string;
  cta: string;
  tone: "paper" | "warm";
  glyph: string;
}) {
  const isWarm = tone === "warm";

  const surfaceClass = isWarm
    ? "section-surface-warm border-[rgba(191,106,83,0.14)]"
    : "section-surface-paper";

  const borderAccent = isWarm
    ? "border-l-[3px] border-l-[var(--accent)]"
    : "border-l-[3px] border-l-[var(--lavender)]";

  const glyphColor = isWarm
    ? "text-[var(--accent)] opacity-[0.07]"
    : "text-[var(--lavender)] opacity-[0.09]";

  const cardHoverOverlayClass = isWarm
    ? "bg-[linear-gradient(180deg,rgba(255,214,191,0.52),rgba(255,234,218,0.6))]"
    : "bg-[linear-gradient(180deg,rgba(214,206,255,0.38),rgba(232,228,255,0.58))]";

  const benefitItemClass = isWarm
    ? "rounded-[0.55rem] border border-[rgba(224,94,67,0.16)] bg-[rgba(255,240,232,0.55)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]"
    : "rounded-[0.55rem] border border-[rgba(185,178,255,0.22)] bg-[rgba(240,238,255,0.45)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]";

  return (
    <article
      className={`section-card group relative flex h-full overflow-hidden rounded-[var(--radius-card)] p-5 transition-[box-shadow] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7 ${surfaceClass} ${borderAccent}`}
    >
      <span
        className={`pointer-events-none absolute -top-4 -right-2 select-none font-display text-[10rem] leading-none font-bold ${glyphColor}`}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 ${cardHoverOverlayClass}`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <p
          className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]"
          data-animate-heading
        >
          {title}
        </p>
        <h3
          className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)] sm:text-4xl"
          data-animate-heading
        >
          {headline}
        </h3>
        <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">{copy}</p>
        <ul className="mt-5 space-y-3 sm:mt-8 sm:space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit} className={benefitItemClass}>
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex w-full justify-start pt-6 sm:pt-8">
          <ButtonLink href={href} variant="primary" size="lg" className="w-full justify-center sm:w-auto">
            {cta}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function SplitBenefits() {
  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:px-10"
      data-reveal-section
    >
      <BenefitColumn
        title="Für Marketing Teams"
        headline={
          <>
            Mehr <span className="title-accent">testbare Creatives</span>, weniger{" "}
            <span data-animate-word>Koordination</span>
          </>
        }
        copy="Zynapse hilft euch, aus einem Briefing mehrere klare Richtungen und geprüfte Varianten zu bekommen. Ohne Freelancer-Suche, ohne Tool-Chaos und ohne endlose Abstimmungen."
        benefits={brandBenefits}
        href="/brands"
        cta="Mehr für Marketing Teams"
        tone="warm"
        glyph="◇"
      />
      <BenefitColumn
        title="Für AI Creatives"
        headline={
          <>
            Klare <span className="title-accent">Aufgaben</span> statt neuer{" "}
            <span data-animate-word>Briefing-Verwirrung</span>
          </>
        }
        copy="Du arbeitest nicht in losen Einzelanfragen, sondern in klaren Kampagnen mit sauberem Briefing, definierten Aufgaben und sichtbarem Beitrag zum finalen Output."
        benefits={creativeBenefits}
        href="/creatives"
        cta="Als Creative bewerben"
        tone="paper"
        glyph="◎"
      />
    </section>
  );
}
