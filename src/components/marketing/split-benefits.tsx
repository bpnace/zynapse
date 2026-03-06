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

  const benefitItemClass = isWarm
    ? "rounded-[0.55rem] border border-[rgba(224,94,67,0.16)] bg-[rgba(255,240,232,0.55)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]"
    : "rounded-[0.55rem] border border-[rgba(185,178,255,0.22)] bg-[rgba(240,238,255,0.45)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]";

  return (
    <article
      className={`section-card relative overflow-hidden rounded-[var(--radius-card)] p-7 ${surfaceClass} ${borderAccent}`}
      data-animate-item
    >
      {/* Decorative corner glyph */}
      <span
        className={`pointer-events-none absolute -top-4 -right-2 select-none font-display text-[10rem] leading-none font-bold ${glyphColor}`}
        aria-hidden="true"
      >
        {glyph}
      </span>

      <div className="relative">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
          {title}
        </p>
        <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl">
          {headline}
        </h3>
        <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">{copy}</p>
        <ul className="mt-8 space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit} className={benefitItemClass}>
              {benefit}
            </li>
          ))}
        </ul>
        <ButtonLink href={href} variant="primary" className="mt-8">
          {cta}
        </ButtonLink>
      </div>
    </article>
  );
}

export function SplitBenefits() {
  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:px-10"
      data-reveal-section
    >
      <BenefitColumn
        title="Für Brands"
        headline={
          <>
            Mehr <span className="title-accent">Kreativklarheit</span>, weniger{" "}
            <span data-animate-word>Produktionschaos</span>
          </>
        }
        copy="Teams kaufen hier keinen diffusen Tool-Zugang, sondern einen strukturierten Weg vom Briefing zu testbaren Kreativvarianten mit klarer Freigabelogik."
        benefits={brandBenefits}
        href="/brands"
        cta="Mehr für Brands"
        tone="paper"
        glyph="◇"
      />
      <BenefitColumn
        title="Für Kreative"
        headline={
          <>
            Deine Kreativ-Logik bleibt <span data-animate-word>sichtbar</span>, auch wenn{" "}
            <span className="title-accent">Output skaliert</span>
          </>
        }
        copy="Du führst Prompt-Logik, Creative Direction und Testing-Richtung. Zynapse nimmt dir die operative Skalierung ab, damit dein Wert nicht im Tagesgeschäft verschwindet."
        benefits={creativeBenefits}
        href="/creatives"
        cta="Mehr für Kreative"
        tone="warm"
        glyph="◎"
      />
    </section>
  );
}
