"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HomeMotionProps = {
  children: React.ReactNode;
};

const SECTION_REVEAL_START = "top 65%";
const REVEAL_DURATION = 0.66;
const WORD_REVEAL_BASE_DURATION = 0.4;
const WORD_REVEAL_DURATION_STEP = 0.1;
const WORD_REVEAL_START_DELAY = 0.15;
const WORD_REVEAL_STAGGER = 0.15;
const HERO_TITLE_REVEAL_DURATION = 1;
const HERO_WORD_REVEAL_START_DELAY = 0.16;
const CHAR_RAIN_DISTANCE = 100;
const CHAR_RAIN_STAGGER = 0.05;
const CHAR_RAIN_DURATION = 0.5;

export function HomeMotion({ children }: HomeMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = scope.current;

      if (!container) {
        return;
      }

      if (
        !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      ) {
        return;
      }
      const heroIntro = container.querySelector<HTMLElement>("[data-hero-intro]");
      const sections = Array.from(
        container.querySelectorAll<HTMLElement>("[data-reveal-section]"),
      );

      const addWordAnimations = (
        timeline: gsap.core.Timeline,
        words: HTMLElement[],
        startAt = WORD_REVEAL_START_DELAY,
      ) => {
        if (!words.length) {
          return;
        }

        words.forEach((word, index) => {
          gsap.set(word, {
            autoAlpha: 0,
            yPercent: 32,
            display: "inline-block",
            willChange: "transform, opacity",
          });

          timeline.to(
            word,
            {
              autoAlpha: 1,
              yPercent: 0,
              duration:
                WORD_REVEAL_BASE_DURATION + index * WORD_REVEAL_DURATION_STEP,
              ease: index % 2 === 0 ? "power3.out" : "power2.out",
            },
            startAt + index * WORD_REVEAL_STAGGER,
          );
        });
      };

      if (heroIntro) {
        const heroHeading = heroIntro.querySelectorAll<HTMLElement>(
          "[data-animate-heading]",
        );
        const heroWords = Array.from(
          heroIntro.querySelectorAll<HTMLElement>("[data-animate-word]"),
        );

        // Subtle scale entrance for the entire hero content block
        gsap.set(heroIntro, {
          autoAlpha: 0,
          scale: 0.97,
          willChange: "transform, opacity",
        });

        const heroTimeline = gsap.timeline({
          defaults: {
            duration: HERO_TITLE_REVEAL_DURATION,
            ease: "power2.out",
          },
        });

        heroTimeline.to(
          heroIntro,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );

        if (heroHeading.length) {
          heroTimeline.from(
            heroHeading,
            {
              autoAlpha: 0,
              y: 26,
              stagger: 0.08,
            },
            0,
          );
        }

        addWordAnimations(
          heroTimeline,
          heroWords,
          heroHeading.length ? HERO_WORD_REVEAL_START_DELAY : 0,
        );

        // ── Metric counter animation ──
        const metricValues = Array.from(
          heroIntro.querySelectorAll<HTMLElement>("[data-metric-value]"),
        );

        metricValues.forEach((valueEl, index) => {
          const raw = valueEl.dataset.metricValue ?? "";
          const numericMatch = raw.match(/(\d+)/);
          if (!numericMatch) return;

          const target = parseInt(numericMatch[1], 10);
          const prefix = raw.slice(0, raw.indexOf(numericMatch[1]));
          const suffix = raw.slice(
            raw.indexOf(numericMatch[1]) + numericMatch[1].length,
          );

          const counter = { value: 0 };

          heroTimeline.to(
            counter,
            {
              value: target,
              duration: 1.4,
              ease: "power2.out",
              snap: { value: 1 },
              onUpdate() {
                valueEl.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
              },
            },
            0.5 + index * 0.1,
          );
        });
      }

      const parallaxWindows = Array.from(
        container.querySelectorAll<HTMLElement>("[data-parallax-window]"),
      );

      parallaxWindows.forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      sections.forEach((section) => {
        const heading = section.querySelectorAll<HTMLElement>("[data-animate-heading]");
        const copy = section.querySelectorAll<HTMLElement>("[data-animate-copy]");
        const items = section.querySelectorAll<HTMLElement>("[data-animate-item]");
        const words = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animate-word]"),
        );
        const charLines = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animate-char-line]"),
        );

        const timeline = gsap.timeline({
          defaults: {
            duration: REVEAL_DURATION,
            ease: "power2.out",
          },
          scrollTrigger: {
            trigger: section,
            start: SECTION_REVEAL_START,
            once: true,
          },
        });

        if (heading.length) {
          timeline.from(heading, {
            autoAlpha: 0,
            y: 26,
            stagger: 0.08,
          });
        }

        addWordAnimations(
          timeline,
          words,
          heading.length ? WORD_REVEAL_START_DELAY : 0,
        );

        if (copy.length) {
          timeline.from(
            copy,
            {
              autoAlpha: 0,
              y: 20,
              stagger: 0.06,
            },
            heading.length ? "-=0.42" : 0,
          );
        }

        if (items.length) {
          timeline.from(
            items,
            {
              autoAlpha: 0,
              y: 22,
              stagger: section.dataset.stagger === "dense" ? 0.06 : 0.1,
            },
            heading.length || copy.length ? "-=0.32" : 0,
          );
        }

        if (charLines.length) {
          charLines.forEach((line, lineIndex) => {
            const chars = Array.from(
              line.querySelectorAll<HTMLElement>("[data-animate-char]"),
            );

            if (!chars.length) {
              return;
            }

            gsap.set(chars, {
              autoAlpha: 0,
              y: -CHAR_RAIN_DISTANCE,
              willChange: "transform, opacity",
            });

            timeline.to(
              chars,
              {
                autoAlpha: 1,
                y: 0,
                duration: CHAR_RAIN_DURATION,
                ease: "power2.out",
                stagger: {
                  each: CHAR_RAIN_STAGGER,
                  from: "random",
                },
              },
              heading.length || copy.length || items.length
                ? `-=${Math.max(0.18, 0.1 * (lineIndex + 1))}`
                : 0,
            );
          });
        }
      });

    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
