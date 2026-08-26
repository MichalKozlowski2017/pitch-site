"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Client island: hero entrance + scroll reveals. Safe with Server Component sections. */
export function LandingMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.setAttribute("data-motion", "reduced");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.setAttribute("data-motion", "on");

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      if (heroItems.length > 0) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.08,
            clearProps: "transform",
          },
        );
      }

      const media = document.querySelector<HTMLElement>("[data-hero-media]");
      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.1 },
          { scale: 1, duration: 1.5, ease: "power2.out" },
        );
        gsap.to(media, {
          scale: 1.06,
          duration: 14,
          ease: "none",
          delay: 1.5,
        });
      }

      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]")
        .forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
          if (items.length === 0) return;

          gsap.fromTo(
            items,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: group,
                start: "top 82%",
                once: true,
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>("[data-usp-num]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
