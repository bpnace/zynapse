import { SectionHeading } from "@/components/ui/section-heading";
import { problemCards } from "@/lib/content/site";

const cardAccentClasses = [
  "border-t-[3px] border-t-[rgba(56,67,84,0.18)]",
  "border-t-[3px] border-t-[rgba(246,107,76,0.24)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
] as const;

const matrixRainText =
  "Gute Ideen scheitern oft nicht an der Idee. Sondern an zu viel Abstimmung.";

function MatrixRainText() {
  return (
    <p
      className="text-center text-sm font-display leading-7 text-[color:var(--copy-strong)] text-balance sm:text-lg"
      data-animate-char-line
      aria-label={matrixRainText}
    >
      <span aria-hidden="true">
        {matrixRainText.split(" ").map((word, wordIndex, arr) => (
          <span key={wordIndex}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, charIndex) => (
                <span
                  key={`${char}-${charIndex}`}
                  data-animate-char
                  className="inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>
            {wordIndex < arr.length - 1 && " "}
          </span>
        ))}
      </span>
    </p>
  );
}

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
            Gute Ideen scheitern oft nicht an der{" "}
            <span data-animate-word>Idee</span>. Sondern an{" "}
            <span className="title-accent">zu viel Abstimmung</span>.
          </>
        }
        copy="Euer Team weiß, welches Produkt beworben werden soll. Trotzdem dauert es zu lange, bis starke Creatives live gehen. Briefings, Feedback, Dateien und Freigaben verteilen sich über zu viele Tools und zu viele Personen."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {problemCards.map((card, index) => (
          <article
            key={card.title}
            className={`section-card section-surface-paper rounded-[var(--radius-card)] p-6 lg:p-7 ${cardAccentClasses[index % cardAccentClasses.length]}`}
          >
            <h3 className="mt-4 font-display text-[1.75rem] leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)]">
              {card.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
