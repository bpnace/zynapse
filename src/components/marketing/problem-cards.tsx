import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProblemCardGrid } from "@/components/marketing/problem-card-grid";
import { problemCards } from "@/lib/content/site";

export function ProblemCards() {
  return (
    <section
      id="problem"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 overflow-visible px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-worry-scroll
    >
      <SectionHeading
        eyebrow="Was bremst gerade"
        title={
          <>
            Wo kreatives Tempo <span className="title-accent">verloren geht</span>.
          </>
        }
        copy="Wenn neue Varianten zu langsam live gehen, liegt es selten nur an der Idee. Meistens ist die Richtung vorhanden, aber Briefing, Feedback, Dateien und Lernpunkte verteilen sich über zu viele Orte. Genau dort verliert ein Team Tempo, bevor überhaupt klar ist, welche Creative-Frage als nächstes getestet werden sollte."
      />
      <ProblemCardGrid cards={problemCards} revealItems={false} />
      <div className="flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
          ZYNAPSE löst diese drei Engpässe in einem zusammenhängenden Workflow:
          erst wird die Ausgangslage sortiert, dann werden testbare Szenarien
          gebaut und zuletzt wird die Übergabe so vorbereitet, dass euer Media
          Team direkt damit weiterarbeiten kann. Details stehen auf der Brand-Seite.
        </p>
        <ButtonLink href="/brands" variant="secondary" size="lg" className="w-full sm:w-auto">
          Mehr zur Lösung für Brands
        </ButtonLink>
      </div>
    </section>
  );
}
