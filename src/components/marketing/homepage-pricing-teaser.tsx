import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { pricingPlans } from "@/lib/content/pricing";
import { cn } from "@/lib/utils";
import type { PricingPlanId } from "@/types/site";
import Link from "next/link";

const packageSummaries: Record<
  PricingPlanId,
  {
    name: string;
    volume: string;
    timing: string;
    summary: string;
    cta: string;
  }
> = {
  starter: {
    name: "Pilot",
    volume: "12 Varianten",
    timing: "3 Wochen",
    summary: "Ein erster Sprint für ein klares Kampagnenziel.",
    cta: "Pilot anfragen",
  },
  growth: {
    name: "Growth Flow",
    volume: "24 bis 36 Varianten",
    timing: "laufend",
    summary: "Der monatliche Modus für wiederkehrende Creative Tests.",
    cta: "Growth anfragen",
  },
  pro: {
    name: "Scale",
    volume: "mehrere Workstreams",
    timing: "individuell",
    summary: "Für mehrere Märkte, Teams oder parallele Kampagnenstränge.",
    cta: "Scale besprechen",
  },
};

function formatPrice(price: string) {
  return price.replace("€", " €");
}

function buildContactHref(planId: PricingPlanId) {
  return `/contact?tier=${encodeURIComponent(planId)}#kontaktformular`;
}

export function HomepagePricingTeaser() {
  return (
    <section
      id="pakete"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Pakete"
        title={
          <>
            Drei Einstiege für euren{" "}
            <span className="title-accent">Creative Sprint</span>.
          </>
        }
        copy="Für die schnelle Orientierung: Pilot für den ersten Sprint, Growth Flow für laufende Creative Tests, Scale für mehrere parallele Workstreams. Die vollständige Paketlogik steht auf der Preisseite."
      />

      <div className="grid overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)] lg:grid-cols-3">
        {pricingPlans.map((plan) => {
          const summary = packageSummaries[plan.id];
          const isFeatured = plan.id === "growth";

          return (
            <article
              key={plan.id}
              className={`flex min-h-[18rem] flex-col p-5 sm:p-6 ${
                plan.id !== "starter"
                  ? "border-t border-[rgba(56,67,84,0.14)] lg:border-t-0 lg:border-l"
                  : ""
              } border-[rgba(56,67,84,0.14)] ${
                isFeatured
                  ? "bg-[linear-gradient(135deg,var(--accent-strong)_0%,var(--accent)_100%)] text-white"
                  : "bg-white"
              }`}
              data-animate-item
            >
              <div className="flex items-start justify-between gap-4">
                <p
                  className={`font-mono text-[10px] tracking-[0.16em] uppercase ${
                    isFeatured ? "text-white/66" : "text-[var(--copy-soft)]"
                  }`}
                >
                  {plan.cadence}
                </p>
                {isFeatured ? (
                  <p className="font-mono text-[10px] tracking-[0.16em] text-white/72 uppercase">
                    Laufender Rhythmus
                  </p>
                ) : null}
              </div>
              <h3
                className={`mt-5 font-display text-[1.65rem] leading-[0.98] font-semibold tracking-[-0.045em] ${
                  isFeatured ? "text-white" : "text-[var(--copy-strong)]"
                }`}
              >
                {summary.name}
              </h3>
              <p
                className={`mt-3 font-display text-[2rem] leading-none font-semibold tracking-[-0.055em] ${
                  isFeatured ? "text-white" : "text-[var(--copy-strong)]"
                }`}
              >
                {formatPrice(plan.price)}
              </p>
              <p
                className={`mt-4 text-sm leading-6 ${
                  isFeatured ? "text-white/78" : "text-[color:var(--copy-body)]"
                }`}
              >
                {summary.summary}
              </p>
              <dl
                className={`mt-6 grid gap-3 text-sm leading-6 ${
                  isFeatured ? "text-white/82" : "text-[color:var(--copy-body)]"
                }`}
              >
                <div className="flex items-center justify-between gap-4 border-t border-current/15 pt-3">
                  <dt>Umfang</dt>
                  <dd className="font-medium">{summary.volume}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-current/15 pt-3">
                  <dt>Modus</dt>
                  <dd className="font-medium">{summary.timing}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-6">
                <Link
                  href={buildContactHref(plan.id)}
                  className={cn(
                    "inline-flex min-h-11 w-full items-center justify-center rounded-[0.45rem] px-4 py-3 text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2",
                    isFeatured
                      ? "bg-white text-[var(--copy-strong)] hover:bg-[rgba(255,255,255,0.9)] focus-visible:ring-white/60 focus-visible:ring-offset-[var(--accent-strong)]"
                      : "bg-[var(--copy-strong)] text-white hover:bg-[rgba(31,36,48,0.9)] focus-visible:ring-[rgba(31,36,48,0.22)] focus-visible:ring-offset-white",
                  )}
                >
                  {summary.cta}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
          Nicht jede Kampagne braucht denselben Produktionsrhythmus. Auf der
          Preisseite könnt ihr einordnen, ob ein erster Sprint reicht oder ob
          Variantenmenge, Review-Aufwand und laufende Tests einen größeren
          Rahmen brauchen.
        </p>
        <ButtonLink href="/pricing" variant="secondary" size="lg" className="w-full sm:w-auto">
          Preisdetails ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
