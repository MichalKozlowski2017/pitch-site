"use client";

import { useCallback, useId, useState, type KeyboardEvent } from "react";
import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

const ACTIVE_FLEX = 5;
const INACTIVE_FLEX = 1;

/** Rozszerzające się taby w poziomie (desktop) + akordeon (mobile). */
export function ServicesRail({ client }: SectionProps) {
  const { services } = client;
  const baseId = useId();
  const highlightIndex = services.items.findIndex((item) => item.highlight);
  const defaultIndex = highlightIndex >= 0 ? highlightIndex : 0;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [mobileOpen, setMobileOpen] = useState<number | null>(defaultIndex);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = services.items.length;
      if (count <= 1) return;

      let next = activeIndex;
      if (event.key === "ArrowRight") {
        next = (activeIndex + 1) % count;
      } else if (event.key === "ArrowLeft") {
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

        {/* Desktop: flex rail */}
        <div
          data-services-rail
          className="mx-auto hidden max-w-6xl gap-2 md:flex md:min-h-[19rem]"
          role="tablist"
          aria-label={services.title}
          onKeyDown={onKeyDown}
        >
          {services.items.map((service, index) => {
            const active = index === activeIndex;
            const tabId = `${baseId}-rail-${index}`;

            return (
              <button
                key={service.title}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveIndex(index)}
                data-service-rail-tab
                data-service-rail-active={active ? "" : undefined}
                style={{
                  flex: active
                    ? `${ACTIVE_FLEX} 1 0%`
                    : `${INACTIVE_FLEX} 1 0%`,
                }}
                className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border text-left transition-[flex,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? "border-[var(--color-accent)]/45 bg-[var(--color-surface)] p-6 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.35)] sm:p-7"
                    : "border-black/[0.07] bg-[var(--color-surface)]/80 p-4 hover:border-[var(--color-accent)]/25 hover:bg-[var(--color-surface)]"
                }`}
              >
                <span
                  className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent transition-opacity duration-500 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                  aria-hidden
                />

                {active ? (
                  <div
                    key={service.title}
                    className="relative flex h-full flex-col justify-end"
                    data-service-rail-panel
                  >
                    <span
                      className="mb-5 block h-1 w-10 rounded-full bg-[var(--color-accent)]"
                      aria-hidden
                    />
                    <h3
                      data-service-title
                      className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl"
                    >
                      {service.title}
                    </h3>
                    <p
                      data-service-desc
                      className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base"
                    >
                      {service.description}
                    </p>
                  </div>
                ) : (
                  <span className="mt-auto flex min-h-0 flex-1 items-end justify-center pb-1">
                    <span
                      className="max-h-full overflow-hidden text-center font-[family-name:var(--font-display)] text-xs font-semibold leading-tight tracking-tight text-[var(--color-muted-foreground)] transition-colors duration-300 [writing-mode:vertical-rl] group-hover:text-[var(--color-foreground)] sm:text-sm"
                      style={{ textOrientation: "mixed" }}
                    >
                      {service.title}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile: akordeon */}
        <div
          data-services-rail-mobile
          className="mx-auto max-w-2xl divide-y divide-black/[0.08] border-y border-black/[0.08] md:hidden"
        >
          {services.items.map((service, index) => {
            const open = mobileOpen === index;
            const panelId = `${baseId}-mobile-panel-${index}`;
            const buttonId = `${baseId}-mobile-btn-${index}`;

            return (
              <div
                key={service.title}
                data-service-rail-mobile-item
                data-service-rail-open={open ? "" : undefined}
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setMobileOpen(open ? null : index)}
                  className="group flex w-full items-center gap-4 py-5 text-left"
                >
                  <span
                    className={`h-8 w-1 shrink-0 rounded-full transition-colors duration-300 ${
                      open
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-muted)] group-hover:bg-[var(--color-accent)]/40"
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`min-w-0 flex-1 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight transition-colors duration-300 ${
                      open
                        ? "text-[var(--color-foreground)]"
                        : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]"
                    }`}
                  >
                    {service.title}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none transition duration-300 ${
                      open
                        ? "rotate-45 border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "border-black/[0.08] text-[var(--color-muted-foreground)]"
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pl-5 pr-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
