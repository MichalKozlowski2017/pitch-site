import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function AreaChips({ client }: SectionProps) {
  const { area } = client;

  return (
    <section
      id="obszar"
      data-reveal-group
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={area.title} subtitle={area.subtitle} />
        <div className="flex flex-wrap justify-center gap-2">
          {area.places.map((place) => (
            <span
              key={place}
              data-reveal
              className="border border-black/10 bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-foreground)]"
            >
              {place}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
