"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedMetricProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

export function AnimatedMetric({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className,
}: AnimatedMetricProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let frameId = 0;
    let hasStarted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting || hasStarted) {
          return;
        }

        hasStarted = true;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setDisplayValue(Math.round(value * eased));

          if (progress < 1) {
            frameId = window.requestAnimationFrame(tick);
          }
        };

        frameId = window.requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [durationMs, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
