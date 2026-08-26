import type { SectionProps } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";

export function FooterSimple({ client }: SectionProps) {
  const year = new Date().getFullYear();
  const { business } = client;

  return (
    <footer className="border-t border-black/5 bg-[var(--color-background)] py-10">
      <Container className="flex flex-col gap-3 text-sm text-[var(--color-muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[family-name:var(--font-display)] text-base text-[var(--color-foreground)]">
          {business.name}
        </p>
        <p>
          © {year} · {business.location}
        </p>
      </Container>
    </footer>
  );
}
