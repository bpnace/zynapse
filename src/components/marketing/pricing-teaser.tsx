import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingPlans } from "@/lib/content/pricing";

export function PricingTeaser() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Preise"
          title="Drei Einstiegspunkte statt eines komplexen Modells."
          accent="Drei Einstiegspunkte"
          copy="Die Preislogik bleibt bewusst kompakt. Ziel ist nicht Tarifdetail, sondern ein klarer Startpunkt für unterschiedliche Teamgrößen."
        />
        <ButtonLink href="/pricing" variant="secondary" className="lg:self-end">
          Alle Preise ansehen
        </ButtonLink>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`section-card rounded-[var(--radius-card)] p-6 ${plan.featured ? "section-surface-warm ring-1 ring-[rgba(224,94,67,0.18)]" : "section-surface-paper border-t-[3px] border-t-[rgba(56,67,84,0.14)]"}`}
            data-animate-item
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
                  {plan.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                  {plan.audience}
                </p>
              </div>
              {plan.featured ? (
                <span className="rounded-[var(--radius-chip)] border border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#236851]">
                  Beliebteste
                </span>
              ) : null}
            </div>
            <p className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
              {plan.price}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--copy-soft)]">
              {plan.cadence}
            </p>
            <ul className="mt-6 space-y-3">
              {plan.deliverables.map((item) => (
                <li key={item} className="text-sm leading-6 text-[color:var(--copy-body)]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
