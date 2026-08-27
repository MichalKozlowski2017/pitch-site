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
      className="relative overflow-hidden bg-[var(--color-surface)] py-16 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/50 to-transparent"
        aria-hidden
      />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div
            data-reveal
            className="flex flex-col justify-between border border-black/8 bg-[var(--color-background)] p-8 sm:p-10"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Kontakt
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
                {contact.title}
              </h2>
              {contact.subtitle ? (
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-muted-foreground)]">
                  {contact.subtitle}
                </p>
              ) : null}
            </div>
            <CtaPair
              primary={hero.ctaPrimary}
              secondary={hero.ctaSecondary}
              magnetic
              className="mt-10"
            />
          </div>

          <dl
            data-reveal
            className="relative flex flex-col justify-center gap-6 border border-black/8 bg-[var(--color-primary)] p-8 text-sm text-[var(--color-primary-foreground)] sm:p-10"
          >
            <span
              className="absolute left-0 top-8 h-16 w-1 bg-[var(--color-accent)]"
              aria-hidden
            />
            <div>
              <dt className="text-white/55">Telefon</dt>
              <dd className="mt-1 text-lg font-semibold tracking-tight">
                {phoneHref ? (
                  <a href={phoneHref} className="hover:text-[var(--color-accent)]">
                    {business.phone}
                  </a>
                ) : (
                  <a
                    href={hero.ctaPrimary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--color-accent)]"
                  >
                    {business.phone}
                  </a>
                )}
              </dd>
            </div>
            {business.email ? (
              <div>
                <dt className="text-white/55">E-mail</dt>
                <dd className="mt-1 font-semibold">
                  <a
                    href={`mailto:${business.email}`}
                    className="hover:text-[var(--color-accent)]"
                  >
                    {business.email}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="text-white/55">Lokalizacja</dt>
              <dd className="mt-1 font-semibold">{business.location}</dd>
            </div>
            {business.hours ? (
              <div>
                <dt className="text-white/55">Godziny</dt>
                <dd className="mt-1 font-semibold">{business.hours}</dd>
              </div>
            ) : null}
            <p className="border-t border-white/10 pt-5 text-xs leading-relaxed text-white/55">
              Napisz krótko czego potrzebujesz — odpiszę z proponowanym terminem.
            </p>
          </dl>
        </div>
      </Container>
    </section>
  );
}
