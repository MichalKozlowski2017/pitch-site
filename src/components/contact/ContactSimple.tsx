import type { SectionProps } from "@/lib/client-config";
import { getPhoneHref } from "@/lib/client-config";
import { Container, CtaPair } from "@/components/shared/ui";

export function ContactSimple({ client }: SectionProps) {
  const { business, contact, hero } = client;
  const phoneHref = getPhoneHref(business.phone);

  return (
    <section
      id="kontakt"
      data-reveal-group
      className="bg-[var(--color-surface)] py-16 sm:py-24"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div data-reveal>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
              {contact.title}
            </h2>
            {contact.subtitle ? (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
                {contact.subtitle}
              </p>
            ) : null}
            <CtaPair
              primary={hero.ctaPrimary}
              secondary={hero.ctaSecondary}
              className="mt-8"
            />
          </div>
          <dl
            data-reveal
            className="space-y-4 border border-black/5 bg-[var(--color-background)] p-6 text-sm"
          >
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Kontakt</dt>
              <dd className="mt-1 font-semibold text-[var(--color-foreground)]">
                {phoneHref ? (
                  <a href={phoneHref}>{business.phone}</a>
                ) : (
                  <a
                    href={hero.ctaPrimary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {business.phone}
                  </a>
                )}
              </dd>
            </div>
            {business.email ? (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">E-mail</dt>
                <dd className="mt-1 font-semibold text-[var(--color-foreground)]">
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Lokalizacja</dt>
              <dd className="mt-1 font-semibold text-[var(--color-foreground)]">
                {business.location}
              </dd>
            </div>
            {business.hours ? (
              <div>
                <dt className="text-[var(--color-muted-foreground)]">Godziny</dt>
                <dd className="mt-1 font-semibold text-[var(--color-foreground)]">
                  {business.hours}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Container>
    </section>
  );
}
