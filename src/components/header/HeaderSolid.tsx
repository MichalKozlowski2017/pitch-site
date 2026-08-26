import type { SectionProps } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";

export function HeaderSolid({ client }: SectionProps) {
  const { business, navigation } = client;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--color-surface)]/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
          {business.name}
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
          href={`tel:${business.phone.replace(/\s/g, "")}`}
          className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-[var(--color-primary-foreground)]"
        >
          {business.phone}
        </a>
      </Container>
    </header>
  );
}
