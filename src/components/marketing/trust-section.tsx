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
        eyebrow="Vertrauen & Sicherheit"
        title={
          <>
            AI-nahe Produktion braucht <span className="title-accent">Kontrolle</span>,
            nicht <span data-animate-word>blindes Tempo.</span>
          </>
        }
        copy="Je mehr Output skaliert wird, desto wichtiger werden Rechte, Review, Brand Safety und klare Freigaben."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {trustSignals.map((signal) => (
          <article
            key={signal.title}
            className="section-card section-surface-contrast rounded-[var(--radius-card)] p-6"
            data-animate-item
          >
            <h3 className="font-display text-[1.7rem] leading-[0.96] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
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
        data-animate-item
      >
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--copy-body)]">
          Rechtliche Details müssen vor dem Launch fachlich geprüft werden. Die
          Architektur ist aber schon auf minimale Datenerhebung, klare
          Verantwortlichkeiten und nachvollziehbare Review-Schritte ausgelegt.
        </p>
        <ButtonLink href="/legal/privacy" variant="secondary">
          Datenschutz ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
