import Link from "next/link";
import type { ClientConfig } from "@/lib/client-config";
import { Container, CtaPair, PrimaryButton } from "@/components/shared/ui";

export function PitchOfferView({ client }: { client: ClientConfig }) {
  const { pitch, business } = client;
  const hasSellerCta = Boolean(pitch.ctaPrimary?.href);

  return (
    <div
      className={`min-h-full bg-[var(--color-background)] text-[var(--color-foreground)] ${
        hasSellerCta ? "pb-24 md:pb-0" : ""
      }`}
    >
      <header className="border-b border-black/5 bg-[var(--color-surface)]">
        <Container className="flex h-14 items-center justify-between gap-4">
          <span className="truncate font-[family-name:var(--font-display)] text-sm font-semibold sm:text-base">
            {business.name}
          </span>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline"
          >
            Podgląd strony →
          </Link>
        </Container>
      </header>

      <div className="border-b border-white/10 bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-[var(--color-primary-foreground)]/90 sm:text-sm">
        Propozycja wdrożenia — to jeszcze nie Twoja opublikowana strona
      </div>

      <main className="py-12 sm:py-20">
        <Container className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Oferta wdrożenia
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {pitch.offerHeadline ?? "Gotowa strona — wdrożenie w 24h"}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            {pitch.offerBody}
          </p>

          {pitch.offerBullets?.length ? (
            <ul className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
              {pitch.offerBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 border-l-2 border-[var(--color-accent)] pl-4 text-sm leading-relaxed sm:text-base"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {pitch.priceNote ? (
            <p className="mt-8 rounded-2xl border border-black/[0.06] bg-[var(--color-surface)] px-4 py-3.5 text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:mt-10">
              {pitch.priceNote}
            </p>
          ) : null}

          <div className="mt-10 border-t border-black/[0.06] pt-10">
            {hasSellerCta && pitch.ctaPrimary ? (
              <CtaPair
                primary={pitch.ctaPrimary}
                secondary={pitch.ctaSecondary}
                className="justify-start"
              />
            ) : null}
            <p
              className={`text-sm leading-relaxed text-[var(--color-muted-foreground)] sm:text-base ${
                hasSellerCta && pitch.ctaPrimary ? "mt-5" : ""
              }`}
            >
              {pitch.contactNote ??
                (hasSellerCta && pitch.ctaPrimary
                  ? "Możesz też po prostu odpowiedzieć na wiadomość, w której dostałaś ten link — omówimy szczegóły i cenę."
                  : "Jeśli chcesz wdrożyć tę stronę, odpowiedz na wiadomość, w której dostałaś ten link — omówimy szczegóły i cenę.")}
            </p>
          </div>

          <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
            <Link
              href="/"
              className="font-medium text-[var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Zobacz podgląd strony dla {business.name}
            </Link>
          </p>
        </Container>
      </main>

      {hasSellerCta && pitch.ctaPrimary ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[var(--color-surface)]/95 p-3 backdrop-blur md:hidden">
          <PrimaryButton
            href={pitch.ctaPrimary.href}
            label={pitch.ctaPrimary.label}
            className="w-full"
          />
        </div>
      ) : null}
    </div>
  );
}
