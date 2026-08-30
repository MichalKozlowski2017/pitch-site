"use client";

import type { ClientConfig } from "@/lib/client-config";
import { BooksyWidgetLoader } from "@/components/booksy/BooksyWidgetLoader";

export function BooksyRoot({ booksy }: { booksy: ClientConfig["booksy"] }) {
  if (!booksy) return null;
  return <BooksyWidgetLoader booksy={booksy} />;
}
