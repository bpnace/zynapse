export function SectionHeading({
  title,
  copy,
  align = "left",
  accent,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  align?: "left" | "center";
  accent?: string;
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const accentIndex =
    typeof title === "string" && accent ? title.indexOf(accent) : -1;

  const titleContent =
    typeof title === "string" && accent && accentIndex >= 0 ? (
      <>
        {title.slice(0, accentIndex)}
        <span className="title-accent">{accent}</span>
        {title.slice(accentIndex + accent.length)}
      </>
    ) : (
      title
    );

  return (
    <div className={`max-w-5xl space-y-4 ${alignment}`}>
      <h2
        className="font-display text-3xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance sm:text-[3.2rem]"
        data-animate-heading
      >
        {titleContent}
      </h2>
      <p
        className="max-w-5xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
        data-animate-copy
      >
        {copy}
      </p>
    </div>
  );
}
