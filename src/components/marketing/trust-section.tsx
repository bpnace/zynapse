import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { trustSignals } from "@/lib/content/site";

export function TrustSection() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Vertrauen & Kontrolle"
        title={
          <>
            KI Creatives, die <span className="title-accent">kontrollierbar</span>{" "}
            bleiben.
          </>
        }
        copy="Zynapse ist darauf ausgelegt, dass euer Team nicht nur mehr Output bekommt, sondern auch sieht, was freigegeben wurde, welche Regeln gelten und welche Dateien wirklich final sind."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {trustSignals.map((signal) => (
          <article
            key={signal.title}
            className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
          >
            <h3 className="font-display text-[1.7rem] leading-[0.96] font-semibold tracking-[-0.04em] text-balance text-[var(--copy-strong)]">
              {signal.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {signal.description}
            </p>
          </article>
        ))}
      </div>
      <div className="section-surface-contrast flex flex-wrap items-center justify-between gap-4 rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] px-6 py-5">
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--copy-body)]">
          Datenschutz, Rechte und Prozessdetails bleiben dokumentiert, ohne die
          Verkaufsseite mit juristischer Schwere zu überladen.
        </p>
        <ButtonLink href="/legal/privacy" variant="secondary">
          Datenschutz ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
