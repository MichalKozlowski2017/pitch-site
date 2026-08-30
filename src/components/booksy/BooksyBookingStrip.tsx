import type { SectionProps } from "@/lib/client-config";
import { Container } from "@/components/shared/ui";
import { BooksyBookButton } from "@/components/booksy/BooksyBookButton";

export function BooksyBookingStrip({ client }: SectionProps) {
  const { booksy } = client;
  if (!booksy) return null;

  const rating = booksy.rating ?? 5;
  const reviewLine =
    booksy.reviewCount != null
      ? `${rating.toFixed(1).replace(".", ",")} ★ · ${booksy.reviewCount} opinii na Booksy`
      : "Rezerwacja online przez Booksy";

  return (
    <section
      id="rezerwacja"
      className="relative border-y border-[var(--color-accent)]/15 bg-[var(--color-muted)]/40 py-5 sm:py-6"
    >
      <Container>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {reviewLine}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Wybierz usługę i termin — bez dzwonienia
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <BooksyBookButton
              booksy={booksy}
              label={booksy.buttonLabel ?? "Umów wizytę online"}
              variant="primary"
              className="min-w-[12rem] shadow-[0_12px_32px_-16px_rgba(0,0,0,0.35)]"
              magnetic
            />
            <a
              href={booksy.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--color-muted-foreground)] underline-offset-2 hover:text-[var(--color-foreground)] hover:underline"
            >
              Otwórz profil Booksy
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
