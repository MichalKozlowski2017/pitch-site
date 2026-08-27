"use client";

import { useId, useState } from "react";
import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function FaqAccordion({ client }: SectionProps) {
  const { faq } = client;
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faq || faq.items.length === 0) return null;

  return (
    <section
      id="faq"
      data-reveal-group
      data-faq-section
      className="relative overflow-hidden bg-[var(--color-primary)] py-16 text-[var(--color-primary-foreground)] sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[var(--color-accent)]/[0.07] blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <SectionHeading title={faq.title} subtitle={faq.subtitle} light />

        <div className="mx-auto max-w-3xl">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-btn-${index}`;

            return (
              <div
                key={item.question}
                data-reveal
                data-faq-item
                data-faq-open={open ? "" : undefined}
                className={`border-b border-white/12 px-5 transition-colors duration-500 first:border-t sm:px-8 ${
                  open ? "border-white/20" : ""
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="group flex w-full items-center gap-4 py-5 text-left sm:gap-5 sm:py-6"
                >
                  <span
                    className={`w-8 shrink-0 font-[family-name:var(--font-display)] text-xs font-medium tracking-[0.2em] transition-colors duration-500 sm:w-9 sm:text-sm ${
                      open
                        ? "text-[var(--color-accent)]"
                        : "text-white/35 group-hover:text-white/55"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`min-w-0 flex-1 font-[family-name:var(--font-display)] text-base font-semibold tracking-tight transition-colors duration-500 sm:text-lg ${
                      open ? "text-white" : "text-white/88 group-hover:text-white"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center border transition duration-500 ${
                      open
                        ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                        : "border-white/15 text-white/55 group-hover:border-white/30 group-hover:text-white"
                    }`}
                    aria-hidden
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span
                      className={`absolute h-3 w-px bg-current transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        open ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`max-w-2xl pb-5 pl-12 text-sm leading-relaxed text-white/65 transition duration-500 sm:pb-6 sm:pl-[3.25rem] sm:text-base ${
                        open
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-1 opacity-0"
                      }`}
                    >
                      {item.answer}
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
