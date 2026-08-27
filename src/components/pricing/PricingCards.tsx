import type { SectionProps } from "@/lib/client-config";
import { Container, PrimaryButton, SectionHeading } from "@/components/shared/ui";

export function PricingCards({ client }: SectionProps) {
  const { pricing, hero } = client;
  if (!pricing || pricing.items.length === 0) return null;

  return (
    <section
      id="cennik"
      data-reveal-group
      className="relative overflow-hidden bg-[var(--color-primary)] py-16 text-[var(--color-primary-foreground)] sm:py-24"
    >
      {/* Fine diagonal hatch + sparse dots — flat, no glow blobs */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        aria-hidden
        style={{
          backgroundImage: [
            `url("data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><path d='M0 48L48 0' stroke='white' stroke-width='0.6' fill='none'/><circle cx='24' cy='24' r='1.1' fill='white'/></svg>`,
            )}")`,
          ].join(","),
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

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pricing.items.map((item) => (
            <article
              key={item.name}
              data-reveal
              data-pricing-card
              className={`flex flex-col border p-6 transition sm:p-7 ${
                item.highlight
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-foreground)] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)]"
                  : "border-white/15 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10"
              }`}
            >
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
                      ? "text-[var(--color-foreground)]/75"
                      : "text-white/70"
                  }`}
                >
                  {item.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              <p
                data-pricing-price
                className={`mt-6 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl ${
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
