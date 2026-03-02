import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { videoVariants } from "@/lib/mock-data/studio";

const outputAccentClasses = [
  "border-t-[3px] border-t-[rgba(224,94,67,0.24)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
  "border-t-[3px] border-t-[rgba(56,67,84,0.2)]",
] as const;

export function VideoOutputGrid() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Output-Vorschau"
        title="So sieht skalierbarer Output aus, bevor echte Cases live sind."
        accent="skalierbarer Output"
        copy="Die Demo zeigt keine losen Clips, sondern die Logik dahinter: Angle, Hook, Format, Länge und Ziel. Genau diese Struktur macht spätere Learnings belastbar."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoVariants.map((variant, index) => (
          <article
            key={variant.id}
            className={`section-card section-surface-paper rounded-[var(--radius-card)] p-5 ${outputAccentClasses[index % outputAccentClasses.length]}`}
            data-animate-item
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
                {variant.angle}
              </span>
              <Badge tone="accent">{variant.format}</Badge>
            </div>
            <h3 className="mt-4 font-display text-[1.7rem] leading-[0.96] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
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
