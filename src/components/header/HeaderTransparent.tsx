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

export function HeaderTransparent({ client }: SectionProps) {
  const { business, navigation, hero } = client;
  const phoneHref = getPhoneHref(business.phone);
  const ctaHref = phoneHref ?? hero.ctaPrimary.href;
  const ctaLabel = phoneHref ? "Zadzwoń" : hero.ctaPrimary.label;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <Container className="flex h-20 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white drop-shadow"
        >
          <BrandMark client={client} light />
        </a>
        <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={ctaHref}
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)]"
          {...(!phoneHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </Container>
    </header>
  );
}
