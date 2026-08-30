"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { ClientConfig } from "@/lib/client-config";
import { booksyWidgetUrl } from "@/lib/booksy";

type Variant = "primary" | "secondary" | "ghost" | "inline";

const variantClass: Record<Variant, string> = {
  primary:
    "inline-flex cursor-pointer items-center justify-center rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95",
  secondary:
    "inline-flex cursor-pointer items-center justify-center rounded-md border border-current/20 bg-transparent px-5 py-3 text-sm font-semibold transition hover:bg-black/5",
  ghost:
    "inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-[var(--color-accent)] transition hover:brightness-110",
  inline:
    "inline-flex cursor-pointer items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)] transition hover:brightness-110",
};

type Props = {
  booksy: NonNullable<ClientConfig["booksy"]>;
  label?: string;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
};

export function BooksyBookButton({
  booksy,
  label = "Umów wizytę",
  variant = "primary",
  className = "",
  magnetic = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const widgetUrl = booksyWidgetUrl(booksy);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-magnetic={magnetic ? "" : undefined}
        className={`${variantClass[variant]} ${className}`}
      >
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          role="presentation"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative flex h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl bg-[var(--color-surface)] shadow-2xl sm:h-[min(720px,90dvh)] sm:rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-black/8 px-4 py-3">
              <p
                id={titleId}
                className="text-sm font-semibold text-[var(--color-foreground)]"
              >
                Rezerwacja online — Booksy
              </p>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition hover:bg-black/5 hover:text-[var(--color-foreground)]"
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>
            <iframe
              title="Rezerwacja Booksy"
              src={widgetUrl}
              className="min-h-0 flex-1 w-full border-0 bg-white"
              allow="payment"
            />
            <p className="shrink-0 border-t border-black/6 px-4 py-2 text-center text-[10px] text-[var(--color-muted-foreground)]">
              Powered by{" "}
              <a
                href={booksy.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Booksy
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
