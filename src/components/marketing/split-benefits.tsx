import { ButtonLink } from "@/components/ui/button";
import { brandBenefits, creativeBenefits } from "@/lib/content/site";

function ComparisonColumn({
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
  tone: "brand" | "creative";
}) {
  const isBrand = tone === "brand";

  return (
    <div
      className={`relative flex h-full flex-col px-6 py-7 sm:px-8 sm:py-8 ${
        isBrand
          ? "bg-[linear-gradient(180deg,rgba(255,252,246,0.96),rgba(250,240,228,0.9))]"
          : "bg-[linear-gradient(180deg,rgba(252,253,255,0.98),rgba(243,246,251,0.92))]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isBrand
            ? "radial-gradient(circle at bottom left, rgba(246,107,76,0.1), transparent 26%), radial-gradient(circle at top right, rgba(249,197,106,0.12), transparent 28%)"
            : "radial-gradient(circle at top right, rgba(185,178,255,0.12), transparent 28%), radial-gradient(circle at bottom left, rgba(56,67,84,0.05), transparent 24%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="space-y-5">
          <p
            className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]"
            data-animate-heading
          >
            {title}
          </p>
          <h3
            className={`font-display font-semibold tracking-[-0.05em] text-[var(--copy-strong)] ${
              isBrand
                ? "max-w-3xl text-4xl leading-[0.92] sm:text-[3.15rem]"
                : "max-w-2xl text-[2.35rem] leading-[0.95] sm:text-[2.7rem]"
            }`}
            data-animate-heading
          >
            {headline}
          </h3>
          <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
            {copy}
          </p>
        </div>

        <div
          className={`mt-8 grid ${
            isBrand ? "gap-0" : "gap-0"
          } border-t ${
            isBrand
              ? "border-[rgba(191,106,83,0.14)]"
              : "border-[rgba(56,67,84,0.12)]"
          }`}
        >
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className={`grid gap-3 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-5 ${
                isBrand
                  ? "border-b border-[rgba(191,106,83,0.14)]"
                  : "border-b border-[rgba(56,67,84,0.12)]"
              }`}
              data-animate-item
            >
              <span
                className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                  isBrand ? "text-[var(--accent-soft)]" : "text-[var(--copy-soft)]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[1rem] leading-7 text-[color:var(--copy-body)]">
                {benefit}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-sm leading-6 text-[color:var(--copy-soft)]">
            {isBrand
              ? "Für Brands, die Paid Social, Reels und Short Form sauber in einen laufenden Creative Flow bringen wollen."
              : "Für AI Creatives, die Strategie, Prompting und Produktion ihre profession nennen."}
          </p>
          <ButtonLink
            href={href}
            variant={isBrand ? "primary" : "secondary"}
            size="lg"
            className="w-full justify-center sm:w-auto"
          >
            {cta}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function SplitBenefits() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="section-card overflow-hidden rounded-[calc(var(--radius-panel)+0.08rem)] border-[rgba(56,67,84,0.14)]">
        <div className="grid lg:grid-cols-[minmax(0,0.58fr)_1px_minmax(0,0.42fr)]">
          <ComparisonColumn
            title="Für Brands"
            headline={
              <>
                Mehr <span className="title-accent">testbare Video Ads</span>, weniger{" "}
                <span data-animate-word>Koordination</span>.
              </>
            }
            copy="Zynapse hilft euch, aus einem Briefing mehrere klare Richtungen und geprüfte Varianten zu bekommen. Ohne Freelancer-Suche, ohne Tool wechsel und ohne endlose Abstimmungen."
            benefits={brandBenefits}
            href="/brands"
            cta="Mehr für Brands"
            tone="brand"
          />

          <div
            className="hidden lg:block bg-[rgba(56,67,84,0.12)]"
            aria-hidden="true"
          />

          <div className="border-t border-[rgba(56,67,84,0.12)] lg:border-t-0">
            <ComparisonColumn
              title="Für AI Creatives"
              headline={
                <>
                  Klare <span className="title-accent">Aufgaben</span> statt{" "}
                  <span data-animate-word>Briefing-Verwirrung</span>.
                </>
              }
              copy="Du arbeitest nicht in losen Einzelanfragen, sondern in klaren Kampagnen mit sauberem Briefing, definierten Aufgaben und sichtbarem Beitrag zum finalen Output."
              benefits={creativeBenefits}
              href="/creatives"
              cta="Als Creative bewerben"
              tone="creative"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
