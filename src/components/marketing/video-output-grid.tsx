"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { videoVariants } from "@/lib/mock-data/studio";

const frameGradients: Record<string, string> = {
  "Cinematic Brand World":
    "linear-gradient(135deg, rgba(24,28,32,0.16), rgba(246,107,76,0.12))",
  "Premium Drama":
    "linear-gradient(135deg, rgba(24,28,32,0.24), rgba(246,107,76,0.16))",
  "Fashion Motion":
    "linear-gradient(135deg, rgba(222,228,236,0.24), rgba(246,107,76,0.1))",
  "Retail Proof":
    "linear-gradient(135deg, rgba(182,214,158,0.18), rgba(246,107,76,0.1))",
  "Product Energy":
    "linear-gradient(135deg, rgba(56,67,84,0.16), rgba(246,107,76,0.14))",
  "Product Close-up":
    "linear-gradient(135deg, rgba(249,197,106,0.18), rgba(246,107,76,0.1))",
  "Cinematic Visuals":
    "linear-gradient(135deg, rgba(56,67,84,0.1), rgba(246,107,76,0.1))",
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
      id="szenarien"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Szenarien"
        title={
          <>
            Sechs Szenarien für{" "}
            <span className="title-accent">testbare Video Ads</span>.
          </>
        }
        copy="Die Szenarien zeigen nicht nur Stilrichtungen, sondern unterschiedliche Aufgaben im Funnel. Je nachdem, ob ihr Aufmerksamkeit, Vertrauen, Produktverständnis oder ein konkretes Angebot testen wollt, braucht das Creative eine andere Logik, andere Hooks und eine andere Übergabe an Media."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videoVariants.map((variant) => {
          const showVideo = !videoLoadFailed[variant.id];

          return (
            <article
              key={variant.id}
              className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.06)]"
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

                <span className="absolute top-3 right-3 rounded-[0.25rem] border border-white/30 bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[var(--copy-strong)] backdrop-blur-sm">
                  {variant.format}
                </span>

                <span className="absolute bottom-3 left-3 rounded-[0.25rem] bg-[var(--copy-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.06em] text-white/90">
                  {formatDuration(variant.length)}
                </span>
              </div>

              <div className="grid gap-4 p-5">
                <div className="flex items-center justify-between gap-3 border-b border-[rgba(56,67,84,0.12)] pb-3">
                  <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
                    {variant.angle}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--copy-soft)]">
                    {variant.objective}
                  </span>
                </div>
                <h3 className="font-display text-[1.55rem] leading-[0.96] font-semibold tracking-[-0.04em] text-balance text-[var(--copy-strong)]">
                  {variant.hookTitle}
                </h3>
                <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                  {variant.scenarioCopy}
                </p>
                <p className="border-t border-[rgba(56,67,84,0.12)] pt-3 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--copy-soft)]">
                  {variant.deliveryLabel} / {variant.format}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <div className="flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
          Die Startseite zeigt die Szenarien bewusst kompakt, damit der
          Überblick schnell bleibt. Auf der Cases-Seite werden daraus lesbare
          Abläufe mit Ausgangslage, Materialbasis, Creative-Entscheidung und
          Übergabe an das Kampagnenteam.
        </p>
        <ButtonLink href="/cases" variant="secondary" size="lg" className="w-full sm:w-auto">
          Alle Szenarien ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
