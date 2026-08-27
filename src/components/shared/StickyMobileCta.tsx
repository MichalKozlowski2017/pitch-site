import type { SectionProps } from "@/lib/client-config";
import { getPhoneHref } from "@/lib/client-config";

/** Fixed call bar on mobile — sits above pitch badge when demo is on. */
export function StickyMobileCta({ client }: SectionProps) {
  const { business, hero, pitch } = client;
  const phoneHref = getPhoneHref(business.phone);
  const href = phoneHref ?? hero.ctaPrimary.href;
  const label = phoneHref
    ? `Zadzwoń · ${business.phone.replace("+48 ", "")}`
    : hero.ctaPrimary.label;
  const external = !phoneHref;

  return (
    <div
      className={`fixed inset-x-0 z-40 border-t border-black/10 bg-[var(--color-surface)]/95 p-3 backdrop-blur md:hidden ${
        pitch.enabled ? "bottom-[4.75rem]" : "bottom-0"
      }`}
    >
      <a
        href={href}
        className="flex w-full items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-3.5 text-sm font-semibold text-[var(--color-foreground)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    </div>
  );
}
