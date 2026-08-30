"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";
import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

/** Master-detail: lista usług + duży panel opisu (trend tabbed spotlight 2025). */
export function ServicesSpotlight({ client }: SectionProps) {
  const { services } = client;
  const baseId = useId();
  const highlightIndex = services.items.findIndex((item) => item.highlight);
  const defaultIndex = highlightIndex >= 0 ? highlightIndex : 0;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const active = services.items[activeIndex] ?? services.items[0];

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = services.items.length;
      if (count <= 1) return;

      let next = activeIndex;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        next = (activeIndex + 1) % count;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        next = (activeIndex - 1 + count) % count;
      } else {
        return;
      }

      event.preventDefault();
      setActiveIndex(next);
    },
    [activeIndex, services.items.length],
  );

  return (
    <section
      id="uslugi"
      data-reveal-group
      data-services-section
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={services.title} subtitle={services.subtitle} />

        <div
          data-services-spotlight
          className="mx-auto max-w-5xl"
          onKeyDown={onKeyDown}
        >
          {/* Mobile: poziomy scroll pilli */}
          <div
            className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={services.title}
          >
            {services.items.map((service, index) => {
              const selected = index === activeIndex;
              const tabId = `${baseId}-tab-${index}`;
              const panelId = `${baseId}-panel`;

              return (
                <button
                  key={service.title}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition duration-300 ${
                    selected
                      ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10 text-[var(--color-foreground)]"
                      : "border-black/[0.08] bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:border-[var(--color-accent)]/30"
                  }`}
                >
                  {service.title}
                </button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-10 lg:items-start">
            {/* Desktop: pionowa lista */}
            <nav
              className="hidden lg:flex lg:flex-col lg:gap-1"
              role="tablist"
              aria-label={services.title}
            >
              {services.items.map((service, index) => {
                const selected = index === activeIndex;
                const tabId = `${baseId}-tab-lg-${index}`;
                const panelId = `${baseId}-panel`;

                return (
                  <button
                    key={service.title}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative rounded-xl px-4 py-3.5 text-left transition duration-300 ${
                      selected
                        ? "bg-[var(--color-accent)]/[0.08] text-[var(--color-foreground)]"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/60 hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-2 left-0 w-1 rounded-full transition duration-300 ${
                        selected
                          ? "bg-[var(--color-accent)]"
                          : "bg-transparent group-hover:bg-[var(--color-accent)]/35"
                      }`}
                      aria-hidden
                    />
                    <span className="block pl-2 font-[family-name:var(--font-display)] text-[0.95rem] font-semibold leading-snug tracking-tight">
                      {service.title}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Panel szczegółów */}
            <article
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-lg-${activeIndex}`}
              data-reveal
              data-service-spotlight-panel
              className="relative overflow-hidden rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-surface)] p-7 sm:p-9 lg:min-h-[16rem]"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[var(--color-accent)]/[0.07] blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent"
                aria-hidden
              />

              <span
                className="relative mb-6 block h-1 w-12 rounded-full bg-[var(--color-accent)]"
                aria-hidden
              />

              <div key={active.title} className="relative">
                <h3
                  data-service-title
                  className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl"
                >
                  {active.title}
                </h3>
                <p
                  data-service-desc
                  className="mt-4 max-w-prose text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg sm:leading-relaxed"
                >
                  {active.description}
                </p>
              </div>

              <div
                className="relative mt-8 flex gap-1.5"
                aria-hidden
              >
                {services.items.map((service, index) => (
                  <span
                    key={service.title}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-7 bg-[var(--color-accent)]"
                        : "w-1.5 bg-[var(--color-muted)]"
                    }`}
                  />
                ))}
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
