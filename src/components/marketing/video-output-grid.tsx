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
  Produktlaunch:
    "linear-gradient(135deg, rgba(224,94,67,0.10) 0%, rgba(249,197,106,0.16) 60%, rgba(224,94,67,0.06) 100%)",
  Produktverständnis:
    "linear-gradient(135deg, rgba(56,67,84,0.08) 0%, rgba(185,178,255,0.14) 60%, rgba(56,67,84,0.05) 100%)",
  "Angebot & Entscheidung":
    "linear-gradient(135deg, rgba(156,244,215,0.12) 0%, rgba(249,197,106,0.10) 60%, rgba(156,244,215,0.06) 100%)",
  "Nächste Ausspielung":
    "linear-gradient(135deg, rgba(185,178,255,0.14) 0%, rgba(156,244,215,0.1) 60%, rgba(56,67,84,0.05) 100%)",
  "Handover & Skalierung":
    "linear-gradient(135deg, rgba(56,67,84,0.06) 0%, rgba(156,244,215,0.12) 60%, rgba(185,178,255,0.10) 100%)",
};

function formatDuration(s: string): string {
  const seconds = parseInt(s, 10);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

const displayVariants = videoVariants.slice(0, 6);
const previewVideoSources = [
  "/videos/video22.mp4",
  "/videos/m2-res_640p.mp4",
  "/videos/m2-res_712p.mp4",
  "/videos/m2-res_716p.mp4",
  "/videos/m2-res_85422p.mp4",
  "/videos/m2-res_854p.mp4",
] as const;

export function VideoOutputGrid() {
  const [videoLoadFailed, setVideoLoadFailed] = useState<Record<string, boolean>>(
    {},
  );

  return (
    <section
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <SectionHeading
        eyebrow="Sichtbarer Kampagnen-Output"
        title={
          <>
            Keine Demo-Assets. Sondern{" "}
            <span className="title-accent">markenfähige Varianten</span> für{" "}
            <span data-animate-word>echte Kampagnenarbeit.</span>
          </>
        }
        copy="Die sechs Beispiele zeigen, wie ein kuratiertes Kampagnen-Setup sichtbar wird: mit klaren Einstiegen, Produktverständnis, Angebotslogik und Varianten, die Brands direkt reviewen, freigeben und in die nächste Ausspielung weiterführen können."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {displayVariants.map((variant, index) => {
          const videoSrc = previewVideoSources[index];
          const showVideo = Boolean(videoSrc) && !videoLoadFailed[variant.id];

          return (
            <article
              key={variant.id}
              className={`section-card section-surface-paper overflow-hidden rounded-[var(--radius-card)] ${outputAccentClasses[index % outputAccentClasses.length]} ${index >= 3 ? "hidden md:block" : ""}`}
              data-animate-item
            >
              <div
                className="relative flex h-[11rem] items-center justify-center overflow-hidden"
                style={{
                  background:
                    frameGradients[variant.angle] ?? frameGradients["Handover & Skalierung"],
                }}
              >
                {showVideo ? (
                  <video
                    src={videoSrc}
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

                {/* Subtle grid pattern overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(56,67,84,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,67,84,1) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Play button */}
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/50 shadow-[0_4px_16px_rgba(31,36,48,0.08)] backdrop-blur-sm">
                  <span
                    className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[var(--copy-strong)]"
                    style={{ opacity: 0.55 }}
                    aria-hidden="true"
                  />
                </div>

                {/* Format badge — top right */}
                <span className="absolute top-3 right-3 rounded-[var(--radius-chip)] border border-white/25 bg-white/55 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[var(--copy-strong)] backdrop-blur-sm">
                  {variant.format}
                </span>

                {/* Duration chip — bottom left */}
                <span className="absolute bottom-3 left-3 rounded-[var(--radius-chip)] bg-[var(--copy-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.06em] text-white/90">
                  {formatDuration(variant.length)}
                </span>
              </div>

              {/* Card content */}
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
