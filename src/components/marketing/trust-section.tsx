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
        title="Video- und AI-nahe Prozesse brauchen sichtbare Kontrolle."
        copy="Gerade bei automatisierter Produktion zählt nicht nur Output-Geschwindigkeit. Entscheidend sind Rechte, Review, Brand Safety und nachvollziehbare Freigaben."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {trustSignals.map((signal) => (
          <article
            key={signal.title}
            className="section-card rounded-[var(--radius-card)] p-6"
            data-animate-item
          >
            <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">
              {signal.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {signal.description}
            </p>
          </article>
        ))}
      </div>
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.14)] bg-[rgba(255,252,247,0.9)] px-6 py-5"
        data-animate-item
      >
        <p className="max-w-2xl text-sm leading-6 text-[color:var(--copy-body)]">
          Rechtliche Details bleiben vor Launch fachlich zu prüfen, die technische
          Architektur ist aber bereits auf minimale Datenerhebung und klare
          Review-Schritte ausgerichtet.
        </p>
        <ButtonLink href="/legal/privacy" variant="secondary">
          Datenschutz ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
