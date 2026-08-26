import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function UspList({ client }: SectionProps) {
  const { usp } = client;

  return (
    <section id="dlaczego" className="bg-[var(--color-surface)] py-16 sm:py-24">
      <Container>
        <SectionHeading title={usp.title} subtitle={usp.subtitle} />
        <ul className="mx-auto grid max-w-4xl gap-4">
          {usp.items.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 border border-black/5 bg-[var(--color-background)] p-5 sm:p-6"
            >
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                aria-hidden
              />
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
