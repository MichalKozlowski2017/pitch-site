import type { SectionProps } from "@/lib/client-config";
import { pricingGridClass } from "@/lib/section-layout";
import { Container, PrimaryButton, SectionHeading } from "@/components/shared/ui";

export function PricingCards({ client }: SectionProps) {
  const { pricing, hero } = client;
  if (!pricing || pricing.items.length === 0) return null;

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
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><path d='M0 48L48 0' stroke='white' stroke-width='0.6' fill='none'/><circle cx='24' cy='24' r='1.1' fill='white'/></svg>`,
          )}")`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 0.6px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
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
                  ? "border-[var(--color-accent)]/80 bg-[var(--color-accent)] text-[var(--color-foreground)]"
                  : "border-white/12 bg-white/[0.04]"
              }`}
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

              <h3
                className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight ${
                  item.highlight ? "text-[var(--color-foreground)]" : "text-white"
                }`}
              >
                {item.name}
              </h3>
              {item.description ? (
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed ${
                    item.highlight
                      ? "text-[var(--color-foreground)]/70"
                      : "text-white/65"
                  }`}
                >
                  {item.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <p
                data-pricing-price
                className={`mt-6 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums ${
                  item.highlight
                    ? "text-[var(--color-foreground)]"
                    : "text-[var(--color-accent)]"
                }`}
              >
                {item.price}
              </p>
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

        <div data-reveal className="mt-10 flex justify-center">
          <PrimaryButton
            href={hero.ctaPrimary.href}
            label={hero.ctaPrimary.label}
            magnetic
            className="min-w-[12rem]"
          />
        </div>
      </Container>
    </section>
  );
}
