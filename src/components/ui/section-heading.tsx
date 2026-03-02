export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl space-y-4 ${alignment}`}>
      <span className="eyebrow" data-animate-heading>
        {eyebrow}
      </span>
      <h2
        className="font-display text-4xl leading-[0.95] font-semibold tracking-[-0.05em] text-balance sm:text-[3.2rem]"
        data-animate-heading
      >
        {title}
      </h2>
      <p
        className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
        data-animate-copy
      >
        {copy}
      </p>
    </div>
  );
}
