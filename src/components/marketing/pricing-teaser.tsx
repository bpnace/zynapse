import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingPlans } from "@/lib/content/pricing";

export function PricingTeaser() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Pricing"
          title="Drei Einstiegspunkte statt eines komplexen Modells."
          copy="Die Preislogik bleibt bewusst kompakt. Ziel ist nicht Tarifdetail, sondern ein klarer Startpunkt für unterschiedliche Teamgrößen."
        />
        <ButtonLink href="/pricing" variant="secondary" className="lg:self-end">
          Volles Pricing
        </ButtonLink>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`section-card rounded-[1.9rem] p-6 ${plan.featured ? "ring-1 ring-[rgba(156,244,215,0.28)]" : ""}`}
            data-animate-item
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
                  {plan.name}
                </p>
                <p className="mt-2 text-sm text-[color:var(--copy-muted)]">
                  {plan.audience}
                </p>
              </div>
              {plan.featured ? (
                <span className="rounded-full bg-[rgba(156,244,215,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mint)]">
                  Most used
                </span>
              ) : null}
            </div>
            <p className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em]">
              {plan.price}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--copy-muted)]">
              {plan.cadence}
            </p>
            <ul className="mt-6 space-y-3">
              {plan.deliverables.map((item) => (
                <li key={item} className="text-sm text-[color:var(--copy-muted)]">
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
