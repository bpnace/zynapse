"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: "900",
});

export function Wordmark({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== href) {
      return;
    }

    event.preventDefault();

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
    <Link
      href={href}
      aria-label="Zynapse Startseite"
      className={className}
      onClick={handleClick}
    >
      <span
        className={`${outfit.className} inline-block pr-[0.04em] text-[1.85rem] leading-none font-black tracking-[-0.04em] lowercase text-[var(--foreground)]`}
      >
        zynaps
        <span className="title-accent">e</span>
      </span>
    </Link>
  );
}
