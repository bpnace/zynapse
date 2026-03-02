import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { trustSignals } from "@/lib/content/site";

export function TrustSection() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Trust & safety"
        title="Video- und AI-nahe Prozesse brauchen sichtbare Kontrolle."
        copy="Gerade bei automatisierter Produktion zählt nicht nur Output-Geschwindigkeit. Entscheidend sind Rechte, Review, Brand Safety und nachvollziehbare Freigaben."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {trustSignals.map((signal) => (
          <article
            key={signal.title}
            className="section-card rounded-[1.7rem] p-6"
            data-animate-item
          >
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">
              {signal.title}
            </h3>
            <p className="mt-4 text-[color:var(--copy-muted)]">{signal.description}</p>
          </article>
        ))}
      </div>
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-[1.8rem] border border-[color:var(--line)] bg-black/20 px-6 py-5"
        data-animate-item
      >
        <p className="max-w-2xl text-sm text-[color:var(--copy-muted)]">
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
