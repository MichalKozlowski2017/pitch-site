"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function syncHeaderScrolled(scrollY: number) {
  document.documentElement.dataset.headerScrolled =
    scrollY > 24 ? "true" : "false";
}

/** Lenis smooth scroll + GSAP hero/reveal/pricing/magnetic. */
export function LandingMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.setAttribute("data-motion", "reduced");
      const onScrollReduced = () => syncHeaderScrolled(window.scrollY);
      onScrollReduced();
      window.addEventListener("scroll", onScrollReduced, { passive: true });
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
        window.removeEventListener("scroll", onScrollReduced);
        document.documentElement.removeAttribute("data-motion");
        delete document.documentElement.dataset.headerScrolled;
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

    syncHeaderScrolled(lenis.scroll);
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      syncHeaderScrolled(e.scroll);
    });
    const onNativeScroll = () => syncHeaderScrolled(window.scrollY);
    window.addEventListener("scroll", onNativeScroll, { passive: true });

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
        offset: -80,
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
            gsap.set(pricingCards, { transformOrigin: "50% 100%" });
            gsap.fromTo(
              pricingCards,
              {
                opacity: 0,
                y: 64,
                rotateX: 14,
                filter: "blur(10px)",
              },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 1.15,
                stagger: {
                  each: 0.12,
                  from: "start",
                },
                ease: "expo.out",
                clearProps: "filter",
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
                { opacity: 0, y: 28, filter: "blur(6px)", scale: 0.92 },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                  duration: 0.95,
                  stagger: 0.12,
                  delay: 0.28,
                  ease: "expo.out",
                  clearProps: "filter,transform",
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
                { opacity: 0, y: 24, filter: "blur(4px)" },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.9,
                  stagger: 0.1,
                  delay: 0.15,
                  ease: "expo.out",
                  clearProps: "filter,transform",
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

          const serviceCards =
            group.querySelectorAll<HTMLElement>("[data-service-card]");
          if (serviceCards.length > 0) {
            gsap.set(serviceCards, { transformOrigin: "50% 85%" });

            gsap.fromTo(
              serviceCards,
              {
                opacity: 0,
                y: 56,
                rotateX: 16,
                filter: "blur(10px)",
              },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 1.1,
                stagger: {
                  each: 0.1,
                  from: "start",
                },
                ease: "expo.out",
                clearProps: "filter",
                scrollTrigger: {
                  trigger: group,
                  start: "top 76%",
                  once: true,
                },
              },
            );

            const serviceNums =
              group.querySelectorAll<HTMLElement>("[data-service-num]");
            if (serviceNums.length > 0) {
              gsap.fromTo(
                serviceNums,
                { opacity: 0, scale: 0.82, y: 24 },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: 0.9,
                  stagger: 0.1,
                  delay: 0.12,
                  ease: "expo.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 76%",
                    once: true,
                  },
                },
              );
            }

            const serviceTitles =
              group.querySelectorAll<HTMLElement>("[data-service-title]");
            const serviceDescs =
              group.querySelectorAll<HTMLElement>("[data-service-desc]");
            if (serviceTitles.length > 0) {
              gsap.fromTo(
                serviceTitles,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.75,
                  stagger: 0.08,
                  delay: 0.22,
                  ease: "expo.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 76%",
                    once: true,
                  },
                },
              );
            }
            if (serviceDescs.length > 0) {
              gsap.fromTo(
                serviceDescs,
                { opacity: 0, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  stagger: 0.08,
                  delay: 0.32,
                  ease: "expo.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 76%",
                    once: true,
                  },
                },
              );
            }

            const other = group.querySelectorAll<HTMLElement>(
              "[data-reveal]:not([data-service-card])",
            );
            if (other.length > 0) {
              gsap.fromTo(
                other,
                { opacity: 0, y: 20, filter: "blur(4px)" },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.85,
                  ease: "expo.out",
                  clearProps: "filter,transform",
                  scrollTrigger: {
                    trigger: group,
                    start: "top 76%",
                    once: true,
                  },
                },
              );
            }
            return;
          }

          const faqItems =
            group.querySelectorAll<HTMLElement>("[data-faq-item]");
          if (faqItems.length > 0) {
            gsap.fromTo(
              faqItems,
              { opacity: 0, y: 36, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.95,
                stagger: 0.07,
                ease: "expo.out",
                clearProps: "filter,transform",
                scrollTrigger: {
                  trigger: group,
                  start: "top 78%",
                  once: true,
                },
              },
            );

            const other = group.querySelectorAll<HTMLElement>(
              "[data-reveal]:not([data-faq-item])",
            );
            if (other.length > 0) {
              gsap.fromTo(
                other,
                { opacity: 0, y: 20, filter: "blur(4px)" },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.85,
                  ease: "expo.out",
                  clearProps: "filter,transform",
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

        gsap.utils
          .toArray<HTMLElement>("[data-pricing-card]")
          .forEach((card) => {
            const onMove = (e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              gsap.to(card, {
                rotateY: px * 9,
                rotateX: -py * 7,
                y: -10,
                z: 24,
                duration: 0.55,
                ease: "power3.out",
                transformPerspective: 900,
              });
            };
            const onLeave = () => {
              gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                y: 0,
                z: 0,
                duration: 0.85,
                ease: "expo.out",
              });
            };
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("mousemove", onMove);
              card.removeEventListener("mouseleave", onLeave);
              gsap.set(card, { clearProps: "transform" });
            });
          });

        gsap.utils
          .toArray<HTMLElement>("[data-service-card]")
          .forEach((card) => {
            const onMove = (e: MouseEvent) => {
              const rect = card.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width - 0.5;
              const py = (e.clientY - rect.top) / rect.height - 0.5;
              gsap.to(card, {
                rotateY: px * 6,
                rotateX: -py * 5,
                y: -8,
                z: 16,
                duration: 0.5,
                ease: "power3.out",
                transformPerspective: 900,
              });
            };
            const onLeave = () => {
              gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                y: 0,
                z: 0,
                duration: 0.8,
                ease: "expo.out",
              });
            };
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              card.removeEventListener("mousemove", onMove);
              card.removeEventListener("mouseleave", onLeave);
              gsap.set(card, { clearProps: "transform" });
            });
          });

        return () => cleanups.forEach((fn) => fn());
      });
    });

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onNativeScroll);
      ctx.revert();
      mm.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
      document.documentElement.removeAttribute("data-motion");
      delete document.documentElement.dataset.headerScrolled;
    };
  }, []);

  return null;
}
