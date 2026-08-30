import type { SectionProps } from "@/lib/client-config";

export function PitchBadge({ client }: SectionProps) {
  if (!client.pitch.enabled) return null;

  const text =
    client.pitch.badgeText ??
    `Demo strony przygotowane dla ${client.business.name}`;

  return (
    <div className="fixed bottom-4 left-auto right-6 z-50 hidden max-w-sm rounded-2xl border border-black/10 bg-[var(--color-foreground)] px-4 py-3 text-center text-sm text-[var(--color-background)] shadow-lg md:block">
      <p>{text}</p>
      <a
        href="/pitch"
        className="mt-1.5 inline-block text-xs font-medium underline underline-offset-2 opacity-90 hover:opacity-100"
      >
        Szczegóły wdrożenia →
      </a>
    </div>
  );
}
