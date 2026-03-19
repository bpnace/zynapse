import { SectionHeading } from "@/components/ui/section-heading";
import { problemCards } from "@/lib/content/site";

const cardAccentClasses = [
  "border-t-[3px] border-t-[rgba(56,67,84,0.18)]",
  "border-t-[3px] border-t-[rgba(246,107,76,0.24)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
] as const;

const matrixRainText =
  "Nicht mehr Tools lösen das Problem. Sondern das passende Setup.";

function MatrixRainText() {
  return (
    <p
      className="text-center text-sm font-display leading-7 text-[color:var(--copy-strong)] sm:text-lg"
      data-animate-char-line
      aria-label={matrixRainText}
    >
      <span aria-hidden="true">
        {Array.from(matrixRainText).map((char, index) => (
          <span
            key={`${char}-${index}`}
            data-animate-char
            className="inline-block whitespace-pre will-change-transform"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </p>
  );
}

export function ProblemCards() {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <SectionHeading
        eyebrow="Wo Brands heute Reibung verlieren"
        title={
          <>
            Nicht das Briefing ist das <span data-animate-word>Problem</span>.
            Meist fehlt das <span className="title-accent">passende Setup</span>{" "}
            dazwischen.
          </>
        }
        copy="Zynapse nimmt die drei typischen Bremsen aus dem Weg: falsche Rollenbesetzung, zu viele Koordinationsschleifen und Kampagnen, die jedes Mal wieder organisatorisch bei null starten."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {problemCards.map((card, index) => (
          <article
            key={card.title}
            className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 lg:p-7 ${cardAccentClasses[index % cardAccentClasses.length]}`}
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
        className="px-6 py-4 text-center text-sm font-display leading-7 text-[color:var(--copy-strong)] sm:text-lg"
      >
        <MatrixRainText />
      </div>
    </section>
  );
}
