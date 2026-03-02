import { SectionHeading } from "@/components/ui/section-heading";
import { problemCards } from "@/lib/content/site";

export function ProblemCards() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Klarheit in 15 Sekunden"
        title="Brands brauchen keinen Marketplace-Pitch. Sie brauchen Entscheidungssicherheit."
        copy="Zynapse nimmt die drei größten Unsicherheiten aus dem Prozess: Was wird überhaupt gebraucht, wer ist wofür verantwortlich und wie kommt daraus verlässlich Output."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {problemCards.map((card) => (
          <article
            key={card.title}
            className="section-card rounded-[var(--radius-card)] p-6"
            data-animate-item
          >
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--gold)]">
              Problem
            </p>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.05em]">
              {card.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
      <div
        className="section-card-muted rounded-[var(--radius-card)] px-6 py-5 text-center text-base leading-7 text-[color:var(--copy-body)] sm:text-lg"
        data-animate-item
      >
        Du bekommst Strategie durch Experten und Output durch Automatisierung.
      </div>
    </section>
  );
}
