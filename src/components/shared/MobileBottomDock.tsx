"use client";

import type { SectionProps } from "@/lib/client-config";
import { getPhoneHref } from "@/lib/client-config";
import { BooksyBookButton } from "@/components/booksy/BooksyBookButton";

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/** Kompaktowy dock na mobile: telefon + Booksy + cienki pasek demo. */
export function MobileBottomDock({ client }: SectionProps) {
  const { business, hero, pitch, booksy } = client;
  const phoneHref = getPhoneHref(business.phone);
  const href = phoneHref ?? hero.ctaPrimary.href;
  const external = !phoneHref;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="flex items-center gap-2 border-t border-black/10 bg-[var(--color-surface)]/95 px-2 py-2 backdrop-blur">
        <a
          href={href}
          aria-label={`Zadzwoń ${business.phone}`}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/10 bg-[var(--color-background)] text-[var(--color-foreground)]"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <PhoneIcon />
        </a>
        {booksy ? (
          <BooksyBookButton
            booksy={booksy}
            label="Umów wizytę"
            variant="primary"
            className="h-10 min-h-0 flex-1 py-0 text-sm"
          />
        ) : (
          <a
            href={href}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-md bg-[var(--color-accent)] text-sm font-semibold text-white"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            Zadzwoń
          </a>
        )}
      </div>
      {pitch.enabled ? (
        <a
          href="/pitch"
          className="flex items-center justify-center gap-1 bg-[var(--color-foreground)] px-2 py-1 text-[10px] font-medium text-[var(--color-background)]"
        >
          <span>Demo strony</span>
          <span className="opacity-60">·</span>
          <span className="underline underline-offset-2">wdrożenie →</span>
        </a>
      ) : null}
    </div>
  );
}
