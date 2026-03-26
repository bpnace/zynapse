"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Wordmark({
  href = "/",
  className = "",
  src = "/logo/LogoVector1.png",
  alt = "Zynapse",
  width = 1208,
  height = 305,
  imageClassName = "",
  priority = false,
}: {
  href?: string;
  className?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  imageClassName?: string;
  priority?: boolean;
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
      className={cn("inline-flex items-center", className)}
      onClick={handleClick}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("h-auto w-[9.75rem]", imageClassName)}
        priority={priority}
      />
    </Link>
  );
}
