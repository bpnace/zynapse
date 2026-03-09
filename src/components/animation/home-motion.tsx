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

export function HomeMotion({ children }: HomeMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = scope.current;

      if (!container) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hero = container.querySelector<HTMLElement>("[data-hero]");
        const heroImage = container.querySelector<HTMLElement>("[data-hero-image]");
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

        if (hero && heroImage) {
          gsap.fromTo(
            heroImage,
            {
              yPercent: -3,
            },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        if (heroIntro) {
          const heroHeading = heroIntro.querySelectorAll<HTMLElement>(
            "[data-animate-heading]",
          );
          const heroWords = Array.from(
            heroIntro.querySelectorAll<HTMLElement>("[data-animate-word]"),
          );

          const heroTimeline = gsap.timeline({
            defaults: {
              duration: HERO_TITLE_REVEAL_DURATION,
              ease: "power2.out",
            },
          });

          if (heroHeading.length) {
            heroTimeline.from(heroHeading, {
              autoAlpha: 0,
              y: 26,
              stagger: 0.08,
            });
          }

          addWordAnimations(
            heroTimeline,
            heroWords,
            heroHeading.length ? HERO_WORD_REVEAL_START_DELAY : 0,
          );
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
        });
      });

      return () => {
        mm.revert();
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
