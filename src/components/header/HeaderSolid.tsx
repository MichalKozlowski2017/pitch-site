import type { SectionProps } from "@/lib/client-config";
import { getPhoneHref } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";

function BrandMark({
  client,
  light = false,
}: SectionProps & { light?: boolean }) {
  const { business } = client;
  if (business.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={business.logo}
        alt={business.name}
        className={`h-8 w-auto ${light ? "brightness-0 invert" : ""}`}
      />
    );
  }
  return <>{business.name}</>;
}

export function HeaderSolid({ client }: SectionProps) {
  const { business, navigation, hero } = client;
  const phoneHref = getPhoneHref(business.phone);
  const ctaHref = phoneHref ?? hero.ctaPrimary.href;
  const ctaLabel = phoneHref ? business.phone : hero.ctaPrimary.label;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--color-surface)]/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight"
        >
          <BrandMark client={client} />
        </a>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={ctaHref}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-foreground)]"
          {...(!phoneHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </Container>
    </header>
  );
}
