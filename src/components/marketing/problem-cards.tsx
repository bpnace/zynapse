import { SectionHeading } from "@/components/ui/section-heading";
import { ProblemCardGrid } from "@/components/marketing/problem-card-grid";
import { problemCards } from "@/lib/content/site";

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
      <ProblemCardGrid cards={problemCards} />
    </section>
  );
}
