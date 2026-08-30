"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import type { SectionProps } from "@/lib/client-config";
import { lightSectionPatternStyle } from "@/lib/section-layout";
import { Container } from "@/components/shared/ui";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function NavArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

/** Contained cinematic portfolio — beauty; centered frame, natural aspect. */
export function GalleryFullBleedShowcase({ client }: SectionProps) {
  const { gallery } = client;
  const items = gallery.items;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement>(null);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const firstPaint = useRef(true);
  const hoverPausedRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const prevIndexRef = useRef(0);

  const isAutoplayBlocked = useCallback(() => {
    return hoverPausedRef.current || Date.now() < pauseUntilRef.current;
  }, []);

  const pauseOnHover = useCallback(() => {
    hoverPausedRef.current = true;
  }, []);

  const resumeOnHover = useCallback(() => {
    hoverPausedRef.current = false;
  }, []);

  const pauseAfterManualNav = useCallback(() => {
    pauseUntilRef.current = Date.now() + 12_000;
  }, []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const total = items.length;
  const item = items[index];

  const goTo = useCallback(
    (next: number, manual = false) => {
      if (total === 0) return;
      if (manual) pauseAfterManualNav();
      setIndex(((next % total) + total) % total);
    },
    [pauseAfterManualNav, total],
  );

  const goPrev = useCallback(() => goTo(index - 1, true), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1, true), [goTo, index]);

  useLayoutEffect(() => {
    if (!item || reduced || total === 0) return;

    const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    const captionBits =
      captionRef.current?.querySelectorAll<HTMLElement>("[data-slide-caption]");

    if (firstPaint.current) {
      firstPaint.current = false;
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          opacity: i === index ? 1 : 0,
          x: 0,
          zIndex: i === index ? 2 : 1,
        });
      });
      images.forEach((img, i) => {
        gsap.set(img, {
          scale: i === index ? 1 : 1.05,
          filter: "blur(0px)",
        });
      });
      if (captionBits?.length) gsap.set(captionBits, { opacity: 1, y: 0 });
      prevIndexRef.current = index;
      return;
    }

    const prev = prevIndexRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      const fadeDuration = 0.9;

      slides.forEach((slide, i) => {
        if (i === index) {
          gsap.set(slide, { zIndex: 2, opacity: 0, x: 0 });
          tl.to(slide, { opacity: 1, duration: fadeDuration }, 0);
        } else if (i === prev) {
          gsap.set(slide, { zIndex: 1, opacity: 1, x: 0 });
          tl.set(slide, { opacity: 0 }, fadeDuration);
        } else {
          gsap.set(slide, { opacity: 0, x: 0, zIndex: 0 });
        }
      });

      images.forEach((img, i) => {
        if (i === index) {
          gsap.set(img, { scale: 1.04 });
          tl.to(img, { scale: 1, duration: 1.15, ease: "power3.out" }, 0);
        } else if (i === prev) {
          gsap.set(img, { scale: 1 });
          tl.set(img, { scale: 1.04 }, fadeDuration);
        } else {
          gsap.set(img, { scale: 1.04 });
        }
      });

      if (captionBits?.length) {
        tl.fromTo(
          captionBits,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.04,
          },
          0.18,
        );
      }
    }, stageRef);

    prevIndexRef.current = index;
    return () => ctx.revert();
  }, [index, item, reduced, total]);

  useEffect(() => {
    if (reduced || total <= 1) return;

    const timer = window.setInterval(() => {
      if (isAutoplayBlocked()) return;
      setIndex((current) => (current + 1) % total);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isAutoplayBlocked, reduced, total]);

  useEffect(() => {
    const thumb = thumbRefs.current[index];
    const strip = thumbStripRef.current;
    if (!thumb || !strip) return;

    const thumbLeft = thumb.offsetLeft;
    const thumbWidth = thumb.offsetWidth;
    const stripWidth = strip.clientWidth;
    const targetScroll = thumbLeft - stripWidth / 2 + thumbWidth / 2;

    strip.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: reduced ? "auto" : "smooth",
    });
  }, [index, reduced]);

  if (items.length === 0 || !item) return null;

  const title = item.title ?? item.alt;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section
      id="realizacje"
      data-reveal-group
      data-gallery-showcase
      className="relative overflow-hidden border-b border-black/[0.06] bg-[var(--color-muted)]/55 py-12 text-[var(--color-foreground)] sm:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={lightSectionPatternStyle("dots")}
        aria-hidden
      />
      <Container className="relative z-[1]">
        <div
          data-reveal
          className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
              {gallery.title}
            </h2>
            {gallery.subtitle ? (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {gallery.subtitle}
              </p>
            ) : null}
          </div>
          <div
            className="flex items-center gap-2"
            onMouseEnter={pauseOnHover}
            onMouseLeave={resumeOnHover}
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Poprzednia stylizacja"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[var(--color-surface)] p-0 shadow-sm transition hover:border-[var(--color-primary)]/25 hover:bg-[var(--color-surface)]"
            >
              <NavArrow direction="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Następna stylizacja"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[var(--color-surface)] p-0 shadow-sm transition hover:border-[var(--color-primary)]/25 hover:bg-[var(--color-surface)]"
            >
              <NavArrow direction="right" />
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative aspect-video w-full touch-pan-y overflow-hidden rounded-sm border border-black/[0.08] bg-[var(--color-muted)] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)]"
          onMouseEnter={pauseOnHover}
          onMouseLeave={resumeOnHover}
          onFocus={pauseOnHover}
          onBlur={resumeOnHover}
          onTouchStart={(e) => {
            pauseAfterManualNav();
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchStartX.current;
            const end = e.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (Math.abs(delta) < 48) return;
            if (delta > 0) goPrev();
            else goNext();
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goPrev();
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goNext();
            }
          }}
          tabIndex={0}
          role="region"
          aria-roledescription="karuzela"
          aria-label={gallery.title}
        >
          {items.map((slide, i) => (
            <div
              key={slide.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden will-change-transform"
              style={{ zIndex: i === index ? 2 : 1 }}
              aria-hidden={i !== index}
            >
              <div
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 via-35% to-black/5"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/50 to-transparent"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20">
            <div
              ref={captionRef}
              className="max-w-xl rounded-sm bg-black/45 px-3.5 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
            >
              <p
                data-slide-caption
                className="text-[10px] font-medium tracking-[0.2em] text-[var(--color-accent)] uppercase sm:text-xs"
              >
                {counter}
              </p>
              <h3
                data-slide-caption
                className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-2xl"
              >
                {title}
              </h3>
              {item.description ? (
                <p
                  data-slide-caption
                  className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/88 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:text-sm"
                >
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="mt-4"
          onMouseEnter={pauseOnHover}
          onMouseLeave={resumeOnHover}
        >
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[var(--color-muted-foreground)]">
            <span>Wybierz stylizację</span>
            <span>
              {index + 1} / {total}
            </span>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[var(--color-muted)] to-transparent sm:w-8"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[var(--color-muted)] to-transparent sm:w-8"
              aria-hidden
            />

            <div
              ref={thumbStripRef}
              role="tablist"
              aria-label="Miniatury stylizacji"
              className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-1 sm:gap-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {items.map((thumb, i) => {
                const active = i === index;
                return (
                  <button
                    key={thumb.src}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    onClick={() => goTo(i, true)}
                    aria-label={`Pokaż: ${thumb.title ?? thumb.alt}`}
                    aria-selected={active}
                    className="group flex shrink-0 snap-start flex-col items-center gap-1.5"
                  >
                    <span
                      className={`relative block aspect-video h-10 w-[4.5rem] overflow-hidden transition duration-300 sm:h-12 sm:w-[5.25rem] ${
                        active
                          ? "scale-100 opacity-100"
                          : "scale-[0.97] opacity-40 group-hover:opacity-65"
                      }`}
                    >
                      <Image
                        src={thumb.src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="84px"
                      />
                    </span>
                    <span
                      className={`h-0.5 w-full rounded-full transition duration-300 ${
                        active
                          ? "bg-[var(--color-accent)]"
                          : "bg-black/10 group-hover:bg-black/20"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
