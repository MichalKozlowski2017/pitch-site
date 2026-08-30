"use client";

import { useEffect, useRef } from "react";
import type { ClientConfig } from "@/lib/client-config";
import { booksyScriptUrl } from "@/lib/booksy";

declare global {
  interface Window {
    booksy?: unknown;
  }
}

/** Oficjalny loader Booksy — uzupełnia modal własnymi przyciskami platformy. */
export function BooksyWidgetLoader({
  booksy,
}: {
  booksy: NonNullable<ClientConfig["booksy"]>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const script = document.createElement("script");
    script.src = booksyScriptUrl(booksy);
    script.async = true;
    host.appendChild(script);

    return () => {
      script.remove();
      if (window.booksy) delete window.booksy;
    };
  }, [booksy.businessId, booksy.country, booksy.lang]);

  return <div ref={hostRef} className="hidden" aria-hidden />;
}
