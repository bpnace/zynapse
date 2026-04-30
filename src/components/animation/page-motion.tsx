"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SECTION_REVEAL_START = "top 75%";
const REVEAL_DURATION = 0.86;
const WORD_REVEAL_BASE_DURATION = 0.4;
const WORD_REVEAL_DURATION_STEP = 0.025;
const WORD_REVEAL_START_DELAY = 0.1;
const WORD_REVEAL_STAGGER = 0.07;

export function PageMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = scope.current;
      if (!container) return;
      const cleanupCallbacks: Array<() => void> = [];

      if (
        !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
      ) {
        return;
      }

      // Section reveal animations shared with the landing page motion.
      const sections = Array.from(
        container.querySelectorAll<HTMLElement>("[data-reveal-section]"),
      );

      sections.forEach((section) => {
        const heading = section.querySelectorAll<HTMLElement>(
          "[data-animate-heading]",
        );
        const copy = section.querySelectorAll<HTMLElement>("[data-animate-copy]");
        const items = section.querySelectorAll<HTMLElement>("[data-animate-item]");
        const worryCards = Array.from(
          section.querySelectorAll<HTMLElement>("[data-worry-card]"),
        );
        const words = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animate-word]"),
        );

        const timeline = gsap.timeline({
          defaults: { duration: REVEAL_DURATION, ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: SECTION_REVEAL_START,
            once: true,
          },
        });
        const ownedTrigger = timeline.scrollTrigger;
        if (ownedTrigger) {
          cleanupCallbacks.push(() => ownedTrigger.kill());
        }

        if (heading.length) {
          timeline.from(heading, {
            autoAlpha: 0,
            y: 26,
            stagger: 0.08,
          });
        }

        if (words.length) {
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
              heading.length
                ? WORD_REVEAL_START_DELAY + index * WORD_REVEAL_STAGGER
                : index * WORD_REVEAL_STAGGER,
            );
          });
        }

        if (copy.length) {
          timeline.from(
            copy,
            { autoAlpha: 0, y: 20, stagger: 0.06 },
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

        if (section.hasAttribute("data-worry-scroll") && worryCards.length) {
          const startRotations = [-1.2, 0.85, -0.7];
          const startSkews = [-0.35, 0.25, -0.2];
          const exitX = [-42, 4, 46];
          const exitY = [58, 74, 62];
          const exitRotations = [-7.5, 5.6, 8];
          const exitSkews = [-2.4, 1.9, -1.8];

          gsap.set(worryCards, {
            rotation: (index) => startRotations[index % startRotations.length],
            skewY: (index) => startSkews[index % startSkews.length],
            filter: "blur(0px)",
            autoAlpha: 1,
            transformOrigin: "50% 58%",
          });

          const worryTween = gsap.to(worryCards, {
            x: (index) => exitX[index % exitX.length],
            y: (index) => exitY[index % exitY.length],
            rotation: (index) => exitRotations[index % exitRotations.length],
            skewY: (index) => exitSkews[index % exitSkews.length],
            filter: "blur(14px)",
            autoAlpha: 0,
            ease: "none",
            stagger: 0.035,
            scrollTrigger: {
              trigger: section,
              start: "center center",
              end: "bottom 18%",
              scrub: 0.7,
            },
          });

          cleanupCallbacks.push(() => {
            worryTween.scrollTrigger?.kill();
            worryTween.kill();
          });
        }
      });

      return () => {
        cleanupCallbacks.forEach((callback) => callback());
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
