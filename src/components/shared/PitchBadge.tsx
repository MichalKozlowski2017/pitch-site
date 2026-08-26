import type { SectionProps } from "@/lib/client-config";

export function PitchBadge({ client }: SectionProps) {
  if (!client.pitch.enabled) return null;

  const text =
    client.pitch.badgeText ??
    `Demo strony przygotowane dla ${client.business.name}`;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg border border-black/10 bg-[var(--color-foreground)] px-4 py-3 text-center text-sm text-[var(--color-background)] shadow-lg md:left-auto md:right-6 md:mx-0">
      <p>{text}</p>
      <a
        href="/pitch"
        className="mt-1 block text-xs underline opacity-80 hover:opacity-100"
      >
        Podoba się? Wdrożenie w 24h — szczegóły oferty
      </a>
    </div>
  );
}
