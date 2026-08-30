"use client";

import type { SectionProps } from "@/lib/client-config";
import { BooksyBookButton } from "@/components/booksy/BooksyBookButton";
import { PrimaryButton, SecondaryButton } from "@/components/shared/ui";

export function ContactCtaRow({ client }: SectionProps) {
  const { hero, booksy } = client;

  return (
    <div className="mt-10 flex flex-wrap gap-3">
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
        />
      ) : hero.ctaSecondary ? (
        <SecondaryButton
          href={hero.ctaSecondary.href}
          label={hero.ctaSecondary.label}
          magnetic
        />
      ) : null}
    </div>
  );
}
