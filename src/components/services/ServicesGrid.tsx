import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function ServicesGrid({ client }: SectionProps) {
  const { services } = client;

  return (
    <section
      id="uslugi"
      data-reveal-group
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={services.title} subtitle={services.subtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service) => (
            <article
              key={service.title}
              data-reveal
              className="border border-black/5 bg-[var(--color-surface)] p-6"
            >
              <span
                className="mb-4 block h-1 w-10 bg-[var(--color-accent)]"
                aria-hidden
              />
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
