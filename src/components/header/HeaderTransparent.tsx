import type { SectionProps } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";

export function HeaderTransparent({ client }: SectionProps) {
  const { business, navigation } = client;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <Container className="flex h-20 items-center justify-between gap-4">
        <a
          href="#top"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white drop-shadow"
        >
          {business.name}
        </a>
        <nav className="hidden items-center gap-6 text-sm text-white/90 md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={`tel:${business.phone.replace(/\s/g, "")}`}
          className="rounded-md bg-[var(--color-accent)] px-3 py-2 text-sm font-semibold text-[var(--color-foreground)]"
        >
          Zadzwoń
        </a>
      </Container>
    </header>
  );
}
