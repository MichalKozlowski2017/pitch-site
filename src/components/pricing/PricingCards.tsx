import type { SectionProps } from "@/lib/client-config";
import {
  pricingGridClass,
  pricingPatternStyle,
  resolvePricingPattern,
} from "@/lib/section-layout";
import { BooksyBookButton } from "@/components/booksy/BooksyBookButton";
import { Container, PrimaryButton, SectionHeading } from "@/components/shared/ui";

export function PricingCards({ client }: SectionProps) {
  const { pricing, hero, business, booksy } = client;
  if (!pricing || pricing.items.length === 0) return null;

  const patternId = resolvePricingPattern(
    pricing.pattern,
    business.name.toLowerCase().replace(/\s+/g, "-"),
  );
  const count = pricing.items.length;

  return (
    <section
      id="cennik"
      data-reveal-group
      className="relative overflow-hidden bg-[var(--color-primary)] py-16 text-[var(--color-primary-foreground)] sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={pricingPatternStyle(patternId)}
      />

      <Container className="relative">
        <SectionHeading title={pricing.title} subtitle={pricing.subtitle} light />

        <div
          data-pricing-grid
          className={pricingGridClass(count)}
          style={{ perspective: "1200px" }}
        >
          {pricing.items.map((item) => (
            <article
              key={item.name}
              data-reveal
              data-pricing-card
              data-pricing-highlight={item.highlight ? "" : undefined}
              className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 sm:p-7 ${
                item.highlight
                  ? "border-[var(--color-accent)]/80 bg-[var(--color-accent)] text-white"
                  : "border-white/12 bg-white/[0.04] text-white"
              } ${count === 3 ? "min-h-[15rem]" : ""}`}
            >
              <span
                data-pricing-sheen
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden
              />
              <span
                className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
                  item.highlight
                    ? "bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    : "bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                }`}
                aria-hidden
              />

              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white">
                {item.name}
              </h3>
              {item.description ? (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">
                  {item.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <p
                data-pricing-price
                className="mt-6 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-white"
              >
                {item.price}
              </p>
              {booksy ? (
                <div className="relative z-[2] mt-4">
                  <BooksyBookButton
                    booksy={booksy}
                    label="Umów →"
                    variant="inline"
                    className="text-white hover:brightness-110"
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>

        {pricing.note ? (
          <p
            data-reveal
            className="mx-auto mt-8 max-w-2xl text-center text-sm text-white/65"
          >
            {pricing.note}
          </p>
        ) : null}

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          <PrimaryButton
            href={hero.ctaPrimary.href}
            label={hero.ctaPrimary.label}
            magnetic
            className="min-w-[12rem]"
          />
          {booksy ? (
            <BooksyBookButton
              booksy={booksy}
              label={booksy.buttonLabel ?? "Rezerwuj na Booksy"}
              variant="secondary"
              magnetic
              className="min-w-[12rem] border-white/25 text-white hover:bg-white/10"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
