import type { Metadata } from "next";
import Link from "next/link";
import { getPhoneHref, loadClientConfig } from "@/lib/client-config";
import { Container, PrimaryButton } from "@/components/shared/ui";

export function generateMetadata(): Metadata {
  const client = loadClientConfig();
  return {
    title: `Oferta wdrożenia — ${client.business.name}`,
    description: client.pitch.offerBody ?? client.seo.description,
  };
}

export default function PitchPage() {
  const client = loadClientConfig();
  const { pitch, business, hero } = client;
  const phoneHref = getPhoneHref(business.phone);
  const primaryHref = phoneHref ?? hero.ctaPrimary.href;
  const primaryLabel = phoneHref
    ? `Zadzwoń: ${business.phone}`
    : hero.ctaPrimary.label;

  return (
    <div className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="border-b border-black/5 bg-[var(--color-surface)]">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-muted-foreground)]"
          >
            ← Wróć do podglądu strony
          </Link>
          <span className="font-[family-name:var(--font-display)] font-semibold">
            {business.name}
          </span>
        </Container>
      </header>

      <main className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-primary)]">
            Oferta wdrożenia
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
            {pitch.offerHeadline ?? "Gotowa strona — wdrożenie w 24h"}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            {pitch.offerBody}
          </p>

          {pitch.offerBullets?.length ? (
            <ul className="mt-10 space-y-4">
              {pitch.offerBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 border-l-2 border-[var(--color-accent)] pl-4 text-base leading-relaxed"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {pitch.priceNote ? (
            <p className="mt-10 rounded-md bg-[var(--color-muted)]/60 px-4 py-3 text-sm">
              {pitch.priceNote}
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <PrimaryButton href={primaryHref} label={primaryLabel} />
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-black/10 px-5 py-3 text-sm font-semibold transition hover:bg-black/5"
            >
              Zobacz demo strony
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
