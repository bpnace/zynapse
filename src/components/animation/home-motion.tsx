"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HomeMotionProps = {
  children: React.ReactNode;
};

function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

function killScopedScrollTriggers(container: HTMLElement) {
  for (const trigger of ScrollTrigger.getAll()) {
    const triggerElement = trigger.trigger;
    const endTrigger = trigger.vars.endTrigger;
    const pinElement = trigger.pin;

    if (
      (isElement(triggerElement) && container.contains(triggerElement)) ||
      (isElement(endTrigger) && container.contains(endTrigger)) ||
      (isElement(pinElement) && container.contains(pinElement))
    ) {
      trigger.kill(true);
    }
  }
}

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
          startAt = 0.08,
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
                duration: 0.32 + index * 0.08,
                ease: index % 2 === 0 ? "power3.out" : "power2.out",
              },
              startAt + index * 0.06,
            );
          });
        };

        if (hero && heroImage) {
          gsap.fromTo(
            heroImage,
            {
              yPercent: -6,
            },
            {
              yPercent: 8,
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
          const heroCopy = heroIntro.querySelectorAll<HTMLElement>(
            "[data-animate-copy]",
          );
          const heroItems = heroIntro.querySelectorAll<HTMLElement>(
            "[data-animate-item]",
          );
          const heroWords = Array.from(
            heroIntro.querySelectorAll<HTMLElement>("[data-animate-word]"),
          );

          const heroTimeline = gsap.timeline({
            defaults: {
              duration: 0.72,
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

          addWordAnimations(heroTimeline, heroWords, heroHeading.length ? 0.08 : 0);

          if (heroCopy.length) {
            heroTimeline.from(
              heroCopy,
              {
                autoAlpha: 0,
                y: 20,
                stagger: 0.06,
              },
              heroHeading.length ? "-=0.42" : 0,
            );
          }

          if (heroItems.length) {
            heroTimeline.from(
              heroItems,
              {
                autoAlpha: 0,
                y: 22,
                stagger: 0.08,
              },
              heroHeading.length || heroCopy.length ? "-=0.32" : 0,
            );
          }
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
              duration: 0.72,
              ease: "power2.out",
            },
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
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

          addWordAnimations(timeline, words, heading.length ? 0.08 : 0);

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
        killScopedScrollTriggers(container);
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
