"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { videoVariants } from "@/lib/mock-data/studio";

const outputAccentClasses = [
  "border-t-[3px] border-t-[rgba(224,94,67,0.24)]",
  "border-t-[3px] border-t-[rgba(249,197,106,0.3)]",
  "border-t-[3px] border-t-[rgba(56,67,84,0.2)]",
] as const;

const frameGradients: Record<string, string> = {
  "Premium Look":
    "linear-gradient(135deg, rgba(24,28,32,0.14) 0%, rgba(249,197,106,0.16) 52%, rgba(24,28,32,0.08) 100%)",
  "Offer Push":
    "linear-gradient(135deg, rgba(224,94,67,0.15) 0%, rgba(249,197,106,0.18) 58%, rgba(224,94,67,0.08) 100%)",
  "UGC Style":
    "linear-gradient(135deg, rgba(222,228,236,0.22) 0%, rgba(255,255,255,0.32) 48%, rgba(210,217,227,0.18) 100%)",
  "Founder oder Expert Style":
    "linear-gradient(135deg, rgba(182,214,158,0.18) 0%, rgba(249,197,106,0.16) 56%, rgba(196,233,217,0.12) 100%)",
  "Product Close-up":
    "linear-gradient(135deg, rgba(56,67,84,0.1) 0%, rgba(160,174,192,0.18) 52%, rgba(249,197,106,0.08) 100%)",
  "Cinematic Visuals":
    "linear-gradient(135deg, rgba(56,67,84,0.06) 0%, rgba(156,244,215,0.12) 60%, rgba(185,178,255,0.1) 100%)",
};

function formatDuration(s: string): string {
  const seconds = parseInt(s, 10);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function VideoOutputGrid() {
  const [videoLoadFailed, setVideoLoadFailed] = useState<Record<string, boolean>>(
    {},
  );

  return (
    <section
      id="beispiele"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Output-Beispiele"
        title={
          <>
            Unterschiedliche <span className="title-accent">Looks</span> für{" "}
            <span data-animate-word>unendliche marketing Tests</span>.
          </>
        }
        copy="Jede kreative Richtung ist bewusst darauf ausgelegt, etwas anderes zu leisten wie etwa Aufmerksamkeit zu gewinnen, Vertrauen aufzubauen, das Produkt greifbarer zu machen oder den nächsten Klick auszulösen."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoVariants.map((variant, index) => {
          const showVideo = !videoLoadFailed[variant.id];

          return (
            <article
              key={variant.id}
              className={`section-card section-surface-paper overflow-hidden rounded-[var(--radius-card)] ${outputAccentClasses[index % outputAccentClasses.length]}`}
              data-animate-item
            >
              <div
                className="relative flex h-[11rem] items-center justify-center overflow-hidden"
                style={{
                  background:
                    frameGradients[variant.angle] ??
                    frameGradients["Cinematic Visuals"],
                }}
              >
                {showVideo ? (
                  <video
                    src={variant.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={() =>
                      setVideoLoadFailed((state) => ({ ...state, [variant.id]: true }))
                    }
                  />
                ) : null}

                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(56,67,84,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,67,84,1) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/50 shadow-[0_4px_16px_rgba(31,36,48,0.08)] backdrop-blur-sm">
                  <span
                    className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[var(--copy-strong)]"
                    style={{ opacity: 0.55 }}
                    aria-hidden="true"
                  />
                </div>

                <span className="absolute top-3 right-3 rounded-[var(--radius-chip)] border border-white/25 bg-white/55 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[var(--copy-strong)] backdrop-blur-sm">
                  {variant.format}
                </span>

                <span className="absolute bottom-3 left-3 rounded-[var(--radius-chip)] bg-[var(--copy-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.06em] text-white/90">
                  {formatDuration(variant.length)}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
                    {variant.angle}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-[1.55rem] leading-[0.96] font-semibold tracking-[-0.04em] text-balance text-[var(--copy-strong)]">
                  {variant.hookTitle}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge tone="mint">{variant.objective}</Badge>
                  <Badge>{variant.deliveryLabel}</Badge>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
