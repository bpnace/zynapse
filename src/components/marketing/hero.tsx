import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroMetrics } from "@/lib/content/site";
import { videoVariants } from "@/lib/mock-data/studio";

export function Hero() {
  const sampleVariants = videoVariants.slice(0, 6);

  return (
    <section
      className="mx-auto grid w-full max-w-6xl gap-14 px-6 pt-32 pb-14 sm:px-8 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] lg:px-10"
      data-hero
    >
      <div className="hero-glow flex flex-col justify-center gap-8">
        <span className="eyebrow" data-hero-intro>
          Production System for Video Campaigns
        </span>
        <div className="space-y-6">
          <h1
            className="max-w-3xl font-display text-5xl leading-[0.9] font-semibold tracking-[-0.07em] text-balance sm:text-6xl lg:text-7xl"
            data-hero-intro
          >
            From one brief to a{" "}
            <span className="text-gradient">finished video campaign</span>.
          </h1>
          <p
            className="max-w-2xl text-base leading-7 text-[color:var(--copy-muted)] sm:text-lg sm:leading-8"
            data-hero-intro
          >
            Brands define product, goal, style and budget. Social media managers
            turn that into campaign logic. Zynapse Studio scales it into review-ready
            variants for TikTok, Reels and Shorts.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row" data-hero-intro>
          <ButtonLink href="/request" size="lg">
            Kampagne anfragen
          </ButtonLink>
          <ButtonLink href="/apply" variant="secondary" size="lg">
            Als Social Media Manager beitreten
          </ButtonLink>
        </div>
        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {heroMetrics.map((metric) => (
            <div
              key={metric.label}
              className="section-card rounded-[1.6rem] px-5 py-4"
              data-hero-metric
            >
              <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--mint)]">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-[color:var(--copy-muted)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="float-slow section-card relative overflow-hidden rounded-[2rem] p-5 sm:p-6"
        data-hero-panel
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,107,76,0.17),transparent_32%),radial-gradient(circle_at_left_center,rgba(156,244,215,0.14),transparent_34%)]" />
        <div className="relative space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                Demo UI
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em]">
                3 Inputs → 6 Outputs
              </h2>
            </div>
            <Badge tone="accent">Studio Mock</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Produkt", "New hydration sachets"],
              ["Ziel", "Paid social conversions"],
              ["Tonalität", "Premium, direct, proof-led"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-[color:var(--line)] bg-black/20 p-4">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--copy-muted)]">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sampleVariants.map((variant, index) => (
              <article
                key={variant.id}
                className="rounded-[1.5rem] border border-[color:var(--line)] bg-[rgba(7,11,16,0.72)] p-4"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
                  <span>Output {index + 1}</span>
                  <span>{variant.format}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                  {variant.hookTitle}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{variant.length}</Badge>
                  <Badge tone="mint">{variant.objective}</Badge>
                  <Badge>{variant.angle}</Badge>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
