import { Container } from "@/components/shared/ui";

export function HeroTrustStrip({ badges }: { badges: string[] }) {
  if (badges.length === 0) return null;

  return (
    <div
      data-hero-trust-strip
      className="border-y border-white/10 bg-[var(--color-primary)] py-3.5 sm:py-4"
    >
      <Container>
        <ul className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-y-2">
          {badges.map((badge, index) => (
            <li
              key={badge}
              className="flex items-center text-sm font-medium leading-snug text-[var(--color-primary-foreground)]/90"
            >
              {index > 0 ? (
                <span
                  className="mx-3 hidden h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)] sm:inline-block"
                  aria-hidden
                />
              ) : null}
              {badge}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
