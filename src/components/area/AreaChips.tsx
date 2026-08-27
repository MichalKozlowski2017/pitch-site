import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function AreaChips({ client }: SectionProps) {
  const { area } = client;
  if (!area || area.places.length === 0) return null;
  return (
    <section
      id="obszar"
      data-reveal-group
      className="bg-[var(--color-muted)]/35 py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={area.title} subtitle={area.subtitle} />
        <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
          {area.places.map((place) => (
            <li key={place} data-reveal>
              <span className="inline-flex items-center border border-[var(--color-primary)]/15 bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium tracking-wide text-[var(--color-foreground)] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)]">
                <span
                  className="mr-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                  aria-hidden
                />
                {place}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
