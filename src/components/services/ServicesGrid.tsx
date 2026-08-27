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
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={services.title} subtitle={services.subtitle} />
        <div className={`grid gap-3 lg:gap-4 ${cols}`}>
          {services.items.map((service, index) => (
            <article
              key={service.title}
              data-reveal
              className="group relative flex min-h-[11rem] flex-col justify-between overflow-hidden border border-black/8 bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-primary)]/25 hover:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] sm:min-h-[12.5rem] sm:p-7"
            >
              <span
                className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-none text-[var(--color-muted)] transition group-hover:text-[var(--color-accent)]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mt-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {service.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[var(--color-accent)] transition duration-300 group-hover:scale-x-100"
                aria-hidden
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
