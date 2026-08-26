import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function UspList({ client }: SectionProps) {
  const { usp } = client;

  return (
    <section
      id="dlaczego"
      data-reveal-group
      className="bg-[var(--color-primary)] py-16 text-[var(--color-primary-foreground)] sm:py-24"
    >
      <Container>
        <SectionHeading title={usp.title} subtitle={usp.subtitle} light />
        <ol className="mx-auto grid max-w-4xl gap-6">
          {usp.items.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              className="grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-[4rem_1fr] sm:gap-8"
            >
              <span
                data-usp-num
                className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-accent)]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/80">
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
