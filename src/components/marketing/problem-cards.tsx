import { SectionHeading } from "@/components/ui/section-heading";
import { problemCards } from "@/lib/content/site";

const cardAccentClasses = [
  "border-t-[3px] border-t-[rgba(56,67,84,0.18)]",
  "border-t-[3px] border-t-[rgba(246,107,76,0.24)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
] as const;

export function ProblemCards() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Wo Teams heute Zeit verlieren"
        title="Creative scheitert selten am Willen. Meist fehlt die klare Struktur davor."
        accent="klare Struktur"
        copy="Zynapse nimmt die drei typischen Bremsen aus dem Prozess: fehlende Prioritäten, teure Abstimmungsschleifen und zu viel Hoffnung auf einzelne Hero-Creatives."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {problemCards.map((card, index) => (
          <article
            key={card.title}
            className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 lg:p-7 ${cardAccentClasses[index % cardAccentClasses.length]}`}
            data-animate-item
          >
            <h3 className="mt-4 font-display text-[1.75rem] leading-[0.95] font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              {card.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
      <div
        className="section-surface-contrast rounded-[var(--radius-subcard)] border border-[rgba(56,67,84,0.14)] px-6 py-4 text-center text-base font-medium leading-7 text-[color:var(--copy-strong)] sm:text-lg"
        data-animate-item
      >
        Strategie bleibt menschlich. Skalierung wird systematisch.
      </div>
    </section>
  );
}
