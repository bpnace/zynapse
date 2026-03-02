import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { pricingPlans } from "@/lib/content/pricing";

export const metadata = buildMetadata({
  title: "Pricing | Zynapse",
  description:
    "Drei Einstiegspunkte für Brand- und Growth-Teams: Starter, Growth und Pro.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="Pricing"
        title="Klarer Einstieg statt Preismodell mit Fragezeichen."
        description="Die Pricing-Seite ist auf erste Entscheidungen optimiert: einmaliger Launch, laufender Growth-Modus oder Team-Setup für mehrere Brands."
        badges={["Starter", "Growth", "Pro"]}
      />
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`section-card rounded-[2rem] p-7 ${plan.featured ? "ring-1 ring-[rgba(156,244,215,0.28)]" : ""}`}
          >
            <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
              {plan.name}
            </p>
            <p className="mt-3 text-sm text-[color:var(--copy-muted)]">
              {plan.description}
            </p>
            <p className="mt-7 font-display text-5xl font-semibold tracking-[-0.06em]">
              {plan.price}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
              {plan.cadence}
            </p>
            <p className="mt-5 text-sm text-[color:var(--copy-muted)]">
              {plan.audience}
            </p>
            <ul className="mt-6 space-y-3">
              {plan.deliverables.map((deliverable) => (
                <li key={deliverable} className="text-sm text-[color:var(--copy-muted)]">
                  {deliverable}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  );
}
