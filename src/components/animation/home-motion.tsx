"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HomeMotionProps = {
  children: React.ReactNode;
};

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
        const heroPanel = container.querySelector<HTMLElement>("[data-hero-panel]");
        const heroIntro = Array.from(
          container.querySelectorAll<HTMLElement>("[data-hero-intro]"),
        );
        const heroMetrics = Array.from(
          container.querySelectorAll<HTMLElement>("[data-hero-metric]"),
        );

        if (hero) {
          const heroTimeline = gsap.timeline({
            defaults: {
              duration: 0.86,
              ease: "power3.out",
            },
          });

          heroTimeline
            .from(heroIntro, {
              autoAlpha: 0,
              y: 28,
              stagger: 0.1,
            })
            .from(
              heroMetrics,
              {
                autoAlpha: 0,
                y: 20,
                stagger: 0.08,
                duration: 0.65,
              },
              "-=0.45",
            );

          if (heroPanel) {
            heroTimeline.from(
              heroPanel,
              {
                autoAlpha: 0,
                y: 34,
                scale: 0.98,
                duration: 0.95,
              },
              "-=0.65",
            );
          }
        }

        const sections = Array.from(
          container.querySelectorAll<HTMLElement>("[data-reveal-section]"),
        );

        sections.forEach((section) => {
          const heading = section.querySelectorAll<HTMLElement>("[data-animate-heading]");
          const copy = section.querySelectorAll<HTMLElement>("[data-animate-copy]");
          const items = section.querySelectorAll<HTMLElement>("[data-animate-item]");

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

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const hero = container.querySelector<HTMLElement>("[data-hero]");
          const heroPanel = container.querySelector<HTMLElement>("[data-hero-panel]");

          if (!hero || !heroPanel) {
            return;
          }

          gsap.to(heroPanel, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        },
      );

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
