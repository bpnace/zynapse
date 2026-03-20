"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const VISIBILITY_OFFSET = 520;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > VISIBILITY_OFFSET);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function handleClick() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <button
      type="button"
      aria-label="Zur Seitenoberkante"
      onClick={handleClick}
      className={cn(
        "fixed right-5 bottom-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(56,67,84,0.14)] bg-[rgba(255,252,248,0.92)] text-[var(--foreground)] shadow-[0_18px_34px_rgba(31,36,48,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(224,94,67,0.22)] hover:bg-[rgba(255,248,241,0.98)] hover:text-[var(--accent-strong)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgba(224,94,67,0.28)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:right-6 sm:bottom-6",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
    </button>
  );
}
