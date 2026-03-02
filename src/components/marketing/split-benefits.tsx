import { ButtonLink } from "@/components/ui/button";
import { brandBenefits, managerBenefits } from "@/lib/content/site";

function BenefitColumn({
  title,
  headline,
  copy,
  benefits,
  href,
  cta,
  tone,
}: {
  title: string;
  headline: React.ReactNode;
  copy: string;
  benefits: string[];
  href: string;
  cta: string;
  tone: "paper" | "warm";
}) {
  const surfaceClass =
    tone === "warm" ? "section-surface-warm border-[rgba(191,106,83,0.14)]" : "section-surface-paper";

  return (
    <article className={`section-card rounded-[var(--radius-card)] p-7 ${surfaceClass}`} data-animate-item>
      <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
        {title}
      </p>
      <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl">
        {headline}
      </h3>
      <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">{copy}</p>
      <ul className="mt-8 space-y-4">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="rounded-[0.55rem] border border-[rgba(56,67,84,0.12)] bg-[rgba(255,255,255,0.68)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]"
          >
            {benefit}
          </li>
        ))}
      </ul>
      <ButtonLink href={href} variant="secondary" className="mt-8">
        {cta}
      </ButtonLink>
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
        title="Für Marken"
        headline={
          <>
            Mehr <span className="title-accent">Creative-Klarheit</span>, weniger
            Produktionschaos
          </>
        }
        copy="Teams kaufen hier keinen diffusen Tool-Zugang, sondern einen strukturierten Weg vom Briefing zu testbaren Creatives mit klarer Freigabelogik."
        benefits={brandBenefits}
        href="/brands"
        cta="Mehr für Marken"
        tone="paper"
      />
      <BenefitColumn
        title="Für Social Media Manager"
        headline={
          <>
            Deine Strategie bleibt sichtbar, auch wenn{" "}
            <span className="title-accent">Output skaliert</span>
          </>
        }
        copy="Du führst Messaging, Hooks und Testing-Richtung. Zynapse nimmt dir die operative Skalierung ab, damit dein Wert nicht im Produktionschaos verschwindet."
        benefits={managerBenefits}
        href="/managers"
        cta="Mehr für Manager"
        tone="warm"
      />
    </section>
  );
}
