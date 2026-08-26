import Image from "next/image";
import type { SectionProps } from "@/lib/client-config";
import { Container, CtaPair } from "@/components/shared/ui";

export function HeroFullBleed({ client }: SectionProps) {
  const { business, hero } = client;

  return (
    <section id="top" className="relative min-h-[88vh] overflow-hidden">
      {hero.image ? (
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[var(--color-primary)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
      <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 sm:pb-24">
        <p
          data-hero-item
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]"
        >
          {business.location}
        </p>
        <h1
          data-hero-item
          className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {hero.headline}
        </h1>
        <p
          data-hero-item
          className="mt-5 max-w-xl text-lg leading-relaxed text-white/85"
        >
          {hero.subheadline}
        </p>
        <div data-hero-item>
          <CtaPair
            primary={hero.ctaPrimary}
            secondary={hero.ctaSecondary}
            className="mt-8 text-white"
          />
        </div>
      </Container>
    </section>
  );
}
