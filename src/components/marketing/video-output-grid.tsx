import { VideoPreviewCard } from "@/components/marketing/video-preview-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { videoVariants } from "@/lib/mock-data/studio";

export function VideoOutputGrid() {
  return (
    <section
      id="szenarien"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Szenarien"
        title={
          <>
            Sechs Szenarien für{" "}
            <span className="title-accent">testbare Video Ads</span>.
          </>
        }
        copy="Die Szenarien zeigen nicht nur Stilrichtungen, sondern unterschiedliche Aufgaben im Funnel. Je nachdem, ob ihr Aufmerksamkeit, Vertrauen, Produktverständnis oder ein Angebot testen wollt, braucht das Creative eine andere Logik, andere Hooks und eine andere Übergabe an Media."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoVariants.map((variant) => (
          <VideoPreviewCard key={variant.id} variant={variant} />
        ))}
      </div>
      <div className="flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
          Die Startseite zeigt die Szenarien bewusst kompakt, damit der
          Überblick schnell bleibt. Auf der Cases-Seite werden daraus lesbare
          Abläufe mit Ausgangslage, Materialbasis, Creative-Entscheidung und
          Übergabe an das Kampagnenteam.
        </p>
        <ButtonLink href="/cases" variant="secondary" size="lg" className="w-full sm:w-auto">
          Weitere Szenarien ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
