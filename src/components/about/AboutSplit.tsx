import Image from "next/image";
import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading } from "@/components/shared/ui";

export function AboutSplit({ client }: SectionProps) {
  const { about } = client;
  if (!about) return null;

  return (
    <section
      id="o-mnie"
      data-reveal-group
      className="relative overflow-hidden bg-[var(--color-muted)]/35 py-16 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/25 to-transparent"
        aria-hidden
      />
      <Container>
        <SectionHeading title={about.title} subtitle={about.subtitle} />

        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div
            data-reveal
            className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.35)] lg:mx-0 lg:max-w-none"
          >
            <Image
              src={about.image}
              alt={about.imageAlt ?? about.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 42vw"
            />
          </div>

          <div data-reveal className="space-y-5">
            {about.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg"
              >
                {paragraph}
              </p>
            ))}

            {about.highlights && about.highlights.length > 0 ? (
              <ul className="mt-6 space-y-3 border-t border-black/8 pt-6">
                {about.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--color-foreground)] sm:text-base"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
