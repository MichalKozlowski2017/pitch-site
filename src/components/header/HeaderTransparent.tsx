import type { SectionProps } from "@/lib/client-config";
import { getPhoneHref } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";

function BrandMark({ client }: SectionProps) {
  const { business } = client;
  if (business.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={business.logo}
        alt={business.name}
        data-header-logo
        className="h-8 w-auto"
      />
    );
  }
  return <>{business.name}</>;
}

/** Overlays full-bleed hero; sticks via CSS `fixed` + `data-header-scrolled` from LandingMotion. */
export function HeaderTransparent({ client }: SectionProps) {
  const { business, navigation, hero } = client;
  const phoneHref = getPhoneHref(business.phone);
  const ctaHref = phoneHref ?? hero.ctaPrimary.href;
  const ctaLabel = phoneHref ? "Zadzwoń" : hero.ctaPrimary.label;

  return (
    <header data-site-header data-variant="transparent">
      <Container className="flex items-center justify-between gap-4">
        <a
          href="#top"
          data-header-brand
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight"
        >
          <BrandMark client={client} />
        </a>
        <nav data-header-nav className="hidden items-center gap-6 text-sm md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={ctaHref}
          className="shrink-0 rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)]"
          {...(!phoneHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </Container>
    </header>
  );
}
