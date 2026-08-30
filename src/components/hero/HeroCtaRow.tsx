"use client";

import type { SectionProps } from "@/lib/client-config";
import { BooksyBookButton } from "@/components/booksy/BooksyBookButton";
import { PrimaryButton, SecondaryButton } from "@/components/shared/ui";

export function HeroCtaRow({ client }: SectionProps) {
  const { hero, booksy } = client;

  return (
    <div className="mt-8 flex flex-wrap gap-3 text-white">
      <PrimaryButton
        href={hero.ctaPrimary.href}
        label={hero.ctaPrimary.label}
        magnetic
      />
      {booksy ? (
        <BooksyBookButton
          booksy={booksy}
          label={hero.ctaSecondary?.label ?? booksy.buttonLabel ?? "Umów wizytę"}
          variant="secondary"
          magnetic
          className="border-white/30 text-white hover:bg-white/10"
        />
      ) : hero.ctaSecondary ? (
        <SecondaryButton
          href={hero.ctaSecondary.href}
          label={hero.ctaSecondary.label}
          magnetic
          className="border-white/30 text-white hover:bg-white/10"
        />
      ) : null}
    </div>
  );
}
