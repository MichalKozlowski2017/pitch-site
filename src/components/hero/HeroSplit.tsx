import Image from "next/image";
import type { SectionProps } from "@/lib/client-config";
import { Container, CtaPair } from "@/components/shared/ui";

export function HeroSplit({ client }: SectionProps) {
  const { business, hero } = client;

  return (
    <section id="top" className="bg-[var(--color-background)] pt-24 sm:pt-28">
      <Container className="grid items-center gap-10 pb-16 lg:grid-cols-2 lg:gap-14 lg:pb-24">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {business.location}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            {hero.subheadline}
          </p>
          <CtaPair
            primary={hero.ctaPrimary}
            secondary={hero.ctaSecondary}
            className="mt-8"
          />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--color-muted)] sm:aspect-[5/4] lg:aspect-square">
          {hero.image ? (
            <Image
              src={hero.image}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
