import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";
import {
  servicesCardSpanClass,
  servicesCardsEqualGrid,
  servicesCardsGridClass,
} from "@/lib/section-layout";

/** Karty usług bez numeracji — layout dopasowany do liczby pozycji. */
export function ServicesCards({ client }: SectionProps) {
  const { services } = client;
  const highlightIndex = services.items.findIndex((item) => item.highlight);
  const featuredIndex = highlightIndex >= 0 ? highlightIndex : 0;
  const count = services.items.length;
  const equalGrid = servicesCardsEqualGrid(count);

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
          data-services-grid
          data-services-cards
          className={servicesCardsGridClass(count)}
          style={{ perspective: "1100px" }}
        >
          {services.items.map((service, index) => {
            const isFeatured = index === featuredIndex;

            return (
              <article
                key={service.title}
                data-reveal
                data-service-card
                data-service-featured={isFeatured ? "" : undefined}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.01] sm:p-7 ${servicesCardSpanClass(index, count, featuredIndex)} ${
                  isFeatured
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.07]"
                    : "border-black/[0.07] bg-[var(--color-surface)]"
                }`}
              >
                <span
                  data-service-sheen
                  className="pointer-events-none absolute inset-0 z-[1]"
                  aria-hidden
                />
                <span
                  className={`mb-5 block h-1 w-10 rounded-full ${
                    isFeatured
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-accent)]/35 group-hover:bg-[var(--color-accent)]/70"
                  }`}
                  aria-hidden
                />

                <div className="relative z-[2] mt-auto">
                  <h3
                    data-service-title
                    className={`font-[family-name:var(--font-display)] font-semibold tracking-tight text-[var(--color-foreground)] ${
                      isFeatured && !equalGrid
                        ? "text-2xl sm:text-[1.65rem]"
                        : "text-lg sm:text-xl"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    data-service-desc
                    className={`mt-2 leading-relaxed text-[var(--color-muted-foreground)] ${
                      isFeatured && !equalGrid ? "text-base" : "text-sm"
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
