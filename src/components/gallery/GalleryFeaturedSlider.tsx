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
import { Container, SectionHeading } from "@/components/shared/ui";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GalleryFeaturedSlider({ client }: SectionProps) {
  const { gallery } = client;
  const items = gallery.items;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const firstPaint = useRef(true);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  const item = items[index];
  const total = items.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useLayoutEffect(() => {
    if (!item || reduced) return;

    const image = imageRef.current;
    const copies = copyRef.current?.querySelectorAll<HTMLElement>("[data-slide-copy]");
    if (!image) return;

    if (firstPaint.current) {
      firstPaint.current = false;
      gsap.set(image, { opacity: 1, scale: 1 });
      if (copies?.length) gsap.set(copies, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
      );

      if (copies?.length) {
        gsap.fromTo(
          copies,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
            delay: 0.08,
          },
        );
      }
    });

    return () => ctx.revert();
  }, [index, item, reduced]);

  if (items.length === 0 || !item) return null;

  const title = item.title ?? item.alt;
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <section
      id="realizacje"
      data-reveal-group
      className="bg-[var(--color-surface)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={gallery.title} subtitle={gallery.subtitle} />

        <div
          data-reveal
          tabIndex={0}
          className="overflow-hidden border border-black/5 bg-[var(--color-background)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
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
        >
          <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
            <div
              className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[28rem]"
              onTouchStart={(e) => {
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
            >
              <div
                ref={imageRef}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority={index === 0}
                />
              </div>
            </div>

            <div
              ref={copyRef}
              className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10"
            >
              <div>
                <p
                  data-slide-copy
                  className="text-sm font-medium tracking-[0.18em] text-[var(--color-accent)]"
                >
                  {counter}
                </p>
                <h3
                  data-slide-copy
                  className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl"
                >
                  {title}
                </h3>
                {item.description ? (
                  <p
                    data-slide-copy
                    className="mt-4 text-base leading-relaxed text-[var(--color-muted-foreground)]"
                  >
                    {item.description}
                  </p>
                ) : null}
                {item.place ? (
                  <p
                    data-slide-copy
                    className="mt-5 text-sm text-[var(--color-muted-foreground)]"
                  >
                    {item.place}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Poprzednia realizacja"
                  className="inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-[var(--color-surface)] text-lg transition hover:border-[var(--color-primary)]/40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Następna realizacja"
                  className="inline-flex h-11 w-11 items-center justify-center border border-black/10 bg-[var(--color-surface)] text-lg transition hover:border-[var(--color-primary)]/40"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-wrap border-t border-black/5">
            {items.map((thumb, i) => {
              const active = i === index;
              return (
                <button
                  key={thumb.src}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Pokaż realizację ${i + 1}: ${thumb.title ?? thumb.alt}`}
                  aria-current={active ? "true" : undefined}
                  className={`relative aspect-[16/10] w-1/2 overflow-hidden border-r border-b border-black/5 transition sm:aspect-[5/3] sm:min-w-0 sm:flex-1 sm:border-b-0 ${
                    active
                      ? "opacity-100 ring-2 ring-inset ring-[var(--color-accent)]"
                      : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={thumb.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-8 text-left text-[11px] font-medium leading-tight text-white sm:px-3 sm:text-xs md:text-sm">
                    {thumb.title ?? thumb.alt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
