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
const ORB_MIN_SPEED = 86;
const ORB_MAX_SPEED = 148;
const ORB_BOUNCE_VARIATION = 34;
const ORB_DRIFT_STRENGTH = 22;

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

      const cleanups: Array<() => void> = [];

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

      // ── Ambient orb drift ──
      const heroOrbStage = container.querySelector<HTMLElement>("[data-hero-orb-stage]");
      const heroOrbs = Array.from(
        container.querySelectorAll<HTMLElement>("[data-hero-orb]"),
      );

      if (heroOrbStage && heroOrbs.length) {
        type OrbState = {
          x: number;
          y: number;
          vx: number;
          vy: number;
          driftSeed: number;
          orb: HTMLElement;
        };

        const orbScaleTweens: gsap.core.Tween[] = [];
        const orbStates: OrbState[] = heroOrbs.map((orb, index) => {
          const angle = gsap.utils.random(0, Math.PI * 2);
          const speed = gsap.utils.random(ORB_MIN_SPEED, ORB_MAX_SPEED);

          gsap.set(orb, {
            x: 0,
            y: 0,
            scale: 1,
            willChange: "transform",
          });

          orbScaleTweens.push(
            gsap.to(orb, {
              scale: gsap.utils.random(0.95, 1.08),
              duration: gsap.utils.random(2.3, 3.4),
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: index * 0.18,
            }),
          );

          return {
            x: 0,
            y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            driftSeed: gsap.utils.random(0, Math.PI * 2),
            orb,
          };
        });

        const normalizeVelocity = (
          state: OrbState,
          targetSpeed = Math.hypot(state.vx, state.vy) || ORB_MIN_SPEED,
        ) => {
          const currentSpeed = Math.hypot(state.vx, state.vy) || 1;
          const multiplier = targetSpeed / currentSpeed;

          state.vx *= multiplier;
          state.vy *= multiplier;

          if (Math.abs(state.vx) < 18) {
            state.vx = 18 * (state.vx >= 0 ? 1 : -1);
          }

          if (Math.abs(state.vy) < 18) {
            state.vy = 18 * (state.vy >= 0 ? 1 : -1);
          }
        };

        const updateHeroOrbs = (time: number, deltaTime: number) => {
          const delta = Math.min(deltaTime / 1000, 0.05);

          orbStates.forEach((state, index) => {
            state.vx +=
              Math.cos(time * 0.9 + state.driftSeed + index) *
              ORB_DRIFT_STRENGTH *
              delta;
            state.vy +=
              Math.sin(time * 1.15 + state.driftSeed - index) *
              ORB_DRIFT_STRENGTH *
              delta;

            normalizeVelocity(
              state,
              gsap.utils.clamp(
                ORB_MIN_SPEED,
                ORB_MAX_SPEED,
                Math.hypot(state.vx, state.vy),
              ),
            );

            let nextX = state.x + state.vx * delta;
            let nextY = state.y + state.vy * delta;

            const availableLeft = Math.max(0, state.orb.offsetLeft);
            const availableRight = Math.max(
              0,
              heroOrbStage.clientWidth -
                state.orb.offsetWidth -
                state.orb.offsetLeft,
            );
            const availableTop = Math.max(0, state.orb.offsetTop);
            const availableBottom = Math.max(
              0,
              heroOrbStage.clientHeight -
                state.orb.offsetHeight -
                state.orb.offsetTop,
            );
            const horizontalRange = 180 + index * 56;
            const verticalRange = 140 + index * 42;
            const minX = -Math.min(availableLeft, horizontalRange);
            const maxX = Math.min(availableRight, horizontalRange * 1.18);
            const minY = -Math.min(availableTop, verticalRange);
            const maxY = Math.min(availableBottom, verticalRange * 1.12);

            if (nextX <= minX || nextX >= maxX) {
              nextX = gsap.utils.clamp(minX, maxX, nextX);
              state.vx *= -1;
              state.vy += gsap.utils.random(
                -ORB_BOUNCE_VARIATION,
                ORB_BOUNCE_VARIATION,
              );
              normalizeVelocity(
                state,
                gsap.utils.random(ORB_MIN_SPEED, ORB_MAX_SPEED),
              );
            }

            if (nextY <= minY || nextY >= maxY) {
              nextY = gsap.utils.clamp(minY, maxY, nextY);
              state.vy *= -1;
              state.vx += gsap.utils.random(
                -ORB_BOUNCE_VARIATION,
                ORB_BOUNCE_VARIATION,
              );
              normalizeVelocity(
                state,
                gsap.utils.random(ORB_MIN_SPEED, ORB_MAX_SPEED),
              );
            }

            state.x = nextX;
            state.y = nextY;
            gsap.set(state.orb, { x: state.x, y: state.y });
          });
        };

        gsap.ticker.add(updateHeroOrbs);
        cleanups.push(() => {
          gsap.ticker.remove(updateHeroOrbs);
          orbScaleTweens.forEach((tween) => tween.kill());
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

      return () => {
        cleanups.forEach((cleanup) => cleanup());
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
