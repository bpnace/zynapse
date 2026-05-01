"use client";

import { useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { VideoVariantPreview } from "@/types/site";

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

function getPrefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type VideoPreviewCardProps = {
  variant: VideoVariantPreview;
  mode?: "home" | "case";
};

export function VideoPreviewCard({ variant, mode = "home" }: VideoPreviewCardProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldMountVideo, setShouldMountVideo] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getPrefersReducedMotion,
  );
  const isCaseMode = mode === "case";
  const showVideo = shouldMountVideo && !videoLoadFailed;
  const plannedLength = formatDuration(variant.plannedLength);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const element = frameRef.current;

    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const frameId = requestAnimationFrame(() => setShouldMountVideo(true));

      return () => cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMountVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <article
      className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_14px_28px_rgba(31,36,48,0.06)]"
      data-animate-item
    >
      <div
        ref={frameRef}
        className={cn(
          "relative overflow-hidden",
          isCaseMode
            ? "h-[13rem] bg-[var(--copy-strong)]"
            : "flex h-[11rem] items-center justify-center",
        )}
        style={{
          background:
            frameGradients[variant.angle] ?? frameGradients["Cinematic Visuals"],
        }}
      >
        {showVideo ? (
          <video
            src={variant.src}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setVideoLoadFailed(true)}
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
        {isCaseMode ? (
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(31,36,48,0.08),rgba(31,36,48,0.42))]"
            aria-hidden="true"
          />
        ) : null}

        <div
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/50 shadow-[0_4px_16px_rgba(31,36,48,0.08)] backdrop-blur-sm",
            isCaseMode && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
        >
          <span
            className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-[var(--copy-strong)]"
            style={{ opacity: 0.55 }}
            aria-hidden="true"
          />
        </div>

        {isCaseMode ? (
          <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-3">
            <span className="bg-white px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-[var(--copy-strong)] uppercase">
              {variant.format}
            </span>
            <span className="bg-[var(--copy-strong)] px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white/90 uppercase">
              Ziel-Cut {plannedLength}
            </span>
          </div>
        ) : (
          <>
            <span className="absolute top-3 right-3 rounded-[0.25rem] border border-white/30 bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-[var(--copy-strong)] backdrop-blur-sm">
              {variant.format}
            </span>
            <span className="absolute bottom-3 left-3 rounded-[0.25rem] bg-[var(--copy-strong)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.06em] text-white/90 uppercase">
              Ziel-Cut {plannedLength}
            </span>
          </>
        )}
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
        {isCaseMode ? (
          <h2 className="font-display text-[1.65rem] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-[var(--copy-strong)]">
            {variant.hookTitle}
          </h2>
        ) : (
          <h3 className="font-display text-[1.55rem] leading-[0.96] font-semibold tracking-[-0.04em] text-balance text-[var(--copy-strong)]">
            {variant.hookTitle}
          </h3>
        )}
        <p className="text-sm leading-6 text-[color:var(--copy-body)]">
          {variant.scenarioCopy}
        </p>
        <p className="border-t border-[rgba(56,67,84,0.12)] pt-3 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--copy-soft)]">
          {variant.deliveryLabel} / {variant.format}
        </p>
      </div>
    </article>
  );
}
