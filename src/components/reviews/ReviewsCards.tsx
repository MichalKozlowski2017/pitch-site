import type { SectionProps } from "@/lib/client-config";
import { Container, SectionHeading, StarRating } from "@/components/shared/ui";

export function ReviewsCards({ client }: SectionProps) {
  const { reviews } = client;
  if (reviews.items.length === 0) return null;

  return (
    <section id="opinie" className="bg-[var(--color-background)] py-16 sm:py-24">
      <Container>
        <SectionHeading title={reviews.title} subtitle={reviews.subtitle} />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.items.map((review) => (
            <blockquote
              key={`${review.author}-${review.text.slice(0, 24)}`}
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
