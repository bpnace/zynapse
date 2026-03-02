import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { videoVariants } from "@/lib/mock-data/studio";

export function VideoOutputGrid() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Video-Output-Vorschau"
        title="Später echte Beispiele. Heute schon die richtige Struktur."
        copy="Jede Kachel zeigt, wie Zynapse Output denkt: Angle, Hook, Format, Länge und Ziel. Nicht als lose Clips, sondern als Creative-System."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoVariants.map((variant) => (
          <article
            key={variant.id}
            className="section-card rounded-[var(--radius-card)] p-5"
            data-animate-item
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
                {variant.angle}
              </span>
              <Badge tone="accent">{variant.format}</Badge>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.04em]">
              {variant.hookTitle}
            </h3>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge>{variant.length}</Badge>
              <Badge tone="mint">{variant.objective}</Badge>
              <Badge>Hook-Variante</Badge>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
