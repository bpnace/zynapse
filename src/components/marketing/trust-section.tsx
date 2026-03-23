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
            Kuratiertes AI-Marketing braucht{" "}
            <span className="title-accent">klare Verantwortung</span>, nicht{" "}
            <span data-animate-word>blinden Output.</span>
          </>
        }
        copy="Je mehr Spezialist:innen, Modelle und Varianten zusammenspielen, desto wichtiger werden Rechte, Review, Brand Safety und saubere Handover."
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
      <div
        className="section-surface-contrast flex flex-wrap items-center justify-between gap-4 rounded-[0.55rem] border border-[rgba(56,67,84,0.16)] px-6 py-5"
      >
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--copy-body)]">
          Rechtliche Details müssen vor dem Launch fachlich geprüft werden. Das
          System ist aber bereits auf minimale Datenerhebung, klare
          Verantwortlichkeiten und nachvollziehbare Review- und Handover-Schritte
          ausgelegt.
        </p>
        <ButtonLink href="/legal/privacy" variant="secondary">
          Datenschutz ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
