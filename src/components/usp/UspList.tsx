import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function UspList({ client }: SectionProps) {
  const { usp } = client;

  return (
    <section
      id="dlaczego"
      data-reveal-group
      className="bg-[var(--color-background)] py-16 sm:py-24"
    >
      <Container>
        <SectionHeading title={usp.title} subtitle={usp.subtitle} />
        <ol className="mx-auto grid max-w-4xl gap-0 overflow-hidden border border-black/8 bg-[var(--color-surface)]">
          {usp.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              className="grid gap-3 border-b border-black/8 p-6 last:border-b-0 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:p-8"
            >
              <span
                data-usp-num
                className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-accent)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-foreground)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
