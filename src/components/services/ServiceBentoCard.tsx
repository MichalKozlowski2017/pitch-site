import type { ClientConfig } from "@/lib/client-config";

type ServiceItem = ClientConfig["services"]["items"][number];

export function ServiceBentoCard({
  service,
  index,
  isFeatured = false,
  layout = "default",
  className = "",
}: {
  service: ServiceItem;
  index: number;
  isFeatured?: boolean;
  layout?: "default" | "wide";
  className?: string;
}) {
  const isWide = layout === "wide";

  return (
    <article
      data-reveal
      data-service-card
      data-service-featured={isFeatured ? "" : undefined}
      className={`group relative flex overflow-hidden rounded-2xl border p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] sm:p-7 ${
        isWide
          ? "h-full flex-col lg:flex-row lg:items-center lg:gap-8"
          : "h-full flex-col"
      } ${
        isFeatured
          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/[0.08]"
          : "border-black/[0.07] bg-[var(--color-surface)]"
      } ${className}`}
    >
      <span
        data-service-sheen
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div
        className={`relative z-[2] ${isWide ? "lg:pt-0" : "mt-auto"} ${isFeatured ? "pt-2 sm:pt-3" : "pt-5 sm:pt-6"}`}
      >
        <h3
          data-service-title
          className={`font-[family-name:var(--font-display)] font-semibold tracking-tight text-[var(--color-foreground)] ${
            isFeatured
              ? "text-2xl sm:text-3xl"
              : isWide
                ? "text-xl lg:text-2xl"
                : "text-lg sm:text-xl"
          }`}
        >
          {service.title}
        </h3>
        <p
          data-service-desc
          className={`mt-2 leading-relaxed text-[var(--color-muted-foreground)] ${
            isFeatured ? "text-base" : "text-sm"
          }`}
        >
          {service.description}
        </p>
      </div>

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        aria-hidden
      />
    </article>
  );
}
