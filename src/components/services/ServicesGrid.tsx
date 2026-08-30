import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function ServicesGrid({ client }: SectionProps) {
  const { services } = client;
  const count = services.items.length;
  const cols =
    count <= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : count === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

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
          className={`grid gap-3 lg:gap-4 ${cols}`}
          style={{ perspective: "1100px" }}
        >
          {services.items.map((service, index) => (
            <article
              key={service.title}
              data-reveal
              data-service-card
              className="group relative flex min-h-[12rem] flex-col overflow-hidden border border-black/[0.07] bg-[var(--color-surface)] p-6 sm:min-h-[13rem] sm:p-7"
            >
              <span
                data-service-sheen
                className="pointer-events-none absolute inset-0 z-[1]"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />

              <span
                className="mb-4 block h-1 w-8 rounded-full bg-[var(--color-accent)]/30 transition-colors duration-500 group-hover:bg-[var(--color-accent)]/70"
                aria-hidden
              />

              <div className="relative z-[2] mt-auto">
                <h3
                  data-service-title
                  className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-foreground)]"
                >
                  {service.title}
                </h3>
                <p
                  data-service-desc
                  className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]"
                >
                  {service.description}
                </p>
              </div>

              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
