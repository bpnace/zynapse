"use client";

import { useEffect, useState } from "react";

export function usePastHero() {
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");

    if (!hero) {
      setIsPastHero(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return { isPastHero };
}
