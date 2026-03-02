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
        const heroImage = container.querySelector<HTMLElement>("[data-hero-image]");
        const sections = Array.from(
          container.querySelectorAll<HTMLElement>("[data-reveal-section]"),
        );

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
