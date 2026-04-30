import { cn } from "@/lib/utils";

type ProblemCardItem = {
  title: string;
  description: string;
};

type ProblemCardGridProps = {
  cards: ReadonlyArray<ProblemCardItem>;
  className?: string;
  revealItems?: boolean;
};

export function ProblemCardGrid({
  cards,
  className,
  revealItems = true,
}: ProblemCardGridProps) {
  const cardTilts = [
    "lg:-rotate-[1.2deg]",
    "lg:rotate-[0.85deg]",
    "lg:-rotate-[0.7deg]",
  ];

  return (
    <div className={cn("grid gap-5 lg:grid-cols-3", className)}>
      {cards.map((card, index) => (
        <article
          key={card.title}
          className="h-full"
          data-animate-item={revealItems ? "" : undefined}
        >
          <div
            className={cn(
              "h-full overflow-hidden rounded-[0.45rem] border border-[rgba(56,67,84,0.16)] bg-white p-6 shadow-[0_12px_24px_rgba(31,36,48,0.055)] will-change-[transform,filter,opacity] lg:p-7",
              cardTilts[index % cardTilts.length],
            )}
            data-worry-card
          >
            <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--copy-soft)] uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 font-display text-[1.75rem] leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-[var(--copy-strong)]">
              {card.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[color:var(--copy-body)]">
              {card.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
