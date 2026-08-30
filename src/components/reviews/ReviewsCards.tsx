import type { SectionProps } from "@/lib/client-config";
import { lightSectionPatternStyle } from "@/lib/section-layout";
import { Container, SectionHeading, StarRating } from "@/components/shared/ui";

export function ReviewsCards({ client }: SectionProps) {
  const { reviews } = client;
  if (reviews.items.length === 0) return null;

  return (
    <section
      id="opinie"
      data-reveal-group
      className="relative overflow-hidden bg-[var(--color-muted)]/50 py-16 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={lightSectionPatternStyle("waves")}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent"
        aria-hidden
      />
      <Container className="relative z-[1]">
        <SectionHeading title={reviews.title} subtitle={reviews.subtitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.items.map((review) => (
            <blockquote
              key={`${review.author}-${review.text.slice(0, 24)}`}
              data-reveal
              className="flex flex-col border border-black/5 bg-[var(--color-surface)] p-6"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-foreground)]">
                „{review.text}”
              </p>
              <footer className="mt-5 border-t border-black/5 pt-4 text-sm">
                <cite className="not-italic font-semibold text-[var(--color-foreground)]">
                  {review.author}
                </cite>
                <span className="mt-1 block text-xs text-[var(--color-muted-foreground)]">
                  {review.source ?? "Google"}
                  {review.date ? ` · ${review.date}` : ""}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
