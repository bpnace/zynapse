import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

export function PageHero({
  label,
  title,
  description,
  badges,
}: {
  label: string;
  title: ReactNode;
  description: string;
  badges: string[];
}) {
  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pt-15 pb-10 sm:px-8 lg:px-10"
      data-reveal-section
    >
      <span className="eyebrow" data-animate-heading>
        {label}
      </span>
      <div className=" lg:items-end">
        <div className="space-y-6">
          <h1
            className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
            data-animate-heading
          >
            {title}
          </h1>
          <p
            className="max-w-5xl text-lg leading-8 text-[color:var(--copy-muted)]"
            data-animate-copy
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
