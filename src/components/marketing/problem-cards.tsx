import { SectionHeading } from "@/components/ui/section-heading";
import { problemCards } from "@/lib/content/site";

const cardAccentClasses = [
  "border-t-[3px] border-t-[rgba(83,90,102,0.42)] border-[rgba(86,94,106,0.18)] bg-[linear-gradient(180deg,rgba(238,240,244,0.98),rgba(213,218,226,0.96))]",
  "border-t-[3px] border-t-[rgba(78,85,98,0.48)] border-[rgba(82,90,103,0.2)] bg-[linear-gradient(180deg,rgba(233,236,241,0.98),rgba(207,212,220,0.97))]",
  "border-t-[3px] border-t-[rgba(73,80,92,0.52)] border-[rgba(78,86,98,0.22)] bg-[linear-gradient(180deg,rgba(229,232,237,0.98),rgba(201,207,216,0.97))]",
] as const;

export function ProblemCards() {
  return (
    <section
      id="problem"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Der eigentliche Engpass"
        title={
          <>
            Nicht die Idee bremst eure Kampagne.{" "}
            <span data-animate-word>Der</span> Weg dorthin{" "}
            <span className="title-accent">ist das Problem</span>.
          </>
        }
        copy="Euer Team weiß, welches Produkt beworben werden soll. Trotzdem dauert es zu lange, bis starke Creatives live gehen. Briefings, Feedback, Dateien und Freigaben verteilen sich über zu viele Tools und zu viele Personen."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {problemCards.map((card, index) => (
          <article
            key={card.title}
            className={`section-card relative overflow-hidden p-6 lg:p-7 ${cardAccentClasses[index % cardAccentClasses.length]}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  index === 0
                    ? "linear-gradient(180deg,rgba(31,36,48,0.04),transparent 30%), radial-gradient(circle at top left, rgba(91,100,114,0.12), transparent 38%)"
                    : index === 1
                      ? "linear-gradient(180deg,rgba(31,36,48,0.05),transparent 32%), radial-gradient(circle at top left, rgba(91,100,114,0.16), transparent 40%)"
                      : "linear-gradient(180deg,rgba(31,36,48,0.06),transparent 34%), radial-gradient(circle at top left, rgba(91,100,114,0.18), transparent 42%)",
              }}
            />
            <h3 className="relative z-10 mt-4 font-display text-[1.75rem] leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)]">
              {card.title}
            </h3>
            <p className="relative z-10 mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
