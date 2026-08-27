"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Lenis smooth scroll + GSAP hero/reveal/pricing/magnetic. */
export function LandingMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.setAttribute("data-motion", "reduced");
      const onAnchorClickReduced = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a[href^='#']");
        if (!(link instanceof HTMLAnchorElement)) return;
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href);
        if (!(el instanceof HTMLElement)) return;
        event.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", href);
      };
      document.addEventListener("click", onAnchorClickReduced);
      return () => {
        document.removeEventListener("click", onAnchorClickReduced);
        document.documentElement.removeAttribute("data-motion");
      };
    }

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.setAttribute("data-motion", "on");
    document.documentElement.classList.add("lenis");

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href^='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.querySelector(href);
      if (!(el instanceof HTMLElement)) return;

      event.preventDefault();
      lenis.scrollTo(el, {
        offset: -16,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      history.pushState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      if (heroItems.length > 0) {
        gsap.fromTo(
          heroItems,
          { opacity: 0, y: 48, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.14,
            ease: "expo.out",
            delay: 0.12,
            clearProps: "filter,transform",
          },
        );
      }

      const media = document.querySelector<HTMLElement>("[data-hero-media]");
      if (media) {
        gsap.fromTo(
          media,
          { scale: 1.14, y: 24 },
          { scale: 1, y: 0, duration: 1.8, ease: "power3.out" },
        );
        gsap.to(media, {
          scale: 1.07,
          duration: 16,
          ease: "none",
          delay: 1.8,
        });
      }

      const overlay = document.querySelector<HTMLElement>("[data-hero-overlay]");
      if (overlay) {
        gsap.fromTo(
          overlay,
          { opacity: 0.25 },
          { opacity: 1, duration: 1.4, ease: "power2.out" },
        );
      }

      gsap.utils
        .toArray<HTMLElement>("[data-reveal-group]")
        .forEach((group) => {
          const pricingCards =
            group.querySelectorAll<HTMLElement>("[data-pricing-card]");
          if (pricingCards.length > 0) {
            gsap.fromTo(
              pricingCards,
              { opacity: 0, y: 56, scale: 0.94 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "transform",
                scrollTrigger: {
                  trigger: group,
                  start: "top 78%",
                  once: true,
                },
              },
            );

            const prices =
              group.querySelectorAll<HTMLElement>("[data-pricing-price]");
            if (prices.length > 0) {
              gsap.fromTo(
                prices,
                { opacity: 0, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  delay: 0.2,
                  ease: "power2.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 78%",
                    once: true,
                  },
                },
              );
            }

            const other = group.querySelectorAll<HTMLElement>(
              "[data-reveal]:not([data-pricing-card])",
            );
            if (other.length > 0) {
              gsap.fromTo(
                other,
                { opacity: 0, y: 24 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.08,
                  ease: "power2.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 78%",
                    once: true,
                  },
                },
              );
            }
            return;
          }

          const items = group.querySelectorAll<HTMLElement>("[data-reveal]");
          if (items.length === 0) return;

          gsap.fromTo(
            items,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.09,
              ease: "power3.out",
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
          { opacity: 0, x: -18 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      mm.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups: Array<() => void> = [];

        gsap.utils
          .toArray<HTMLElement>("[data-magnetic]")
          .forEach((btn) => {
            const onMove = (e: MouseEvent) => {
              const rect = btn.getBoundingClientRect();
              const x = e.clientX - (rect.left + rect.width / 2);
              const y = e.clientY - (rect.top + rect.height / 2);
              gsap.to(btn, {
                x: x * 0.28,
                y: y * 0.28,
                duration: 0.45,
                ease: "power3.out",
              });
            };
            const onLeave = () => {
              gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.4)",
              });
            };
            btn.addEventListener("mousemove", onMove);
            btn.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              btn.removeEventListener("mousemove", onMove);
              btn.removeEventListener("mouseleave", onLeave);
              gsap.set(btn, { clearProps: "transform" });
            });
          });

        return () => cleanups.forEach((fn) => fn());
      });
    });

    return () => {
      document.removeEventListener("click", onAnchorClick);
      ctx.revert();
      mm.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
      document.documentElement.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
