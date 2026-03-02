import { Badge } from "@/components/ui/badge";

export function PageHero({
  label,
  title,
  description,
  badges,
}: {
  label: string;
  title: string;
  description: string;
  badges: string[];
}) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-32 pb-10 sm:px-8 lg:px-10">
      <span className="eyebrow">{label}</span>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,0.28fr)] lg:items-end">
        <div className="space-y-6">
          <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl">
            {title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[color:var(--copy-muted)]">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {badges.map((badge) => (
            <Badge key={badge} tone="mint">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
