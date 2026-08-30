import type { ClientConfig } from "@/lib/client-config";
import type { ReactNode } from "react";

type Cta = ClientConfig["hero"]["ctaPrimary"];

export function PrimaryButton({
  href,
  label,
  className = "",
  magnetic = false,
}: {
  href: string;
  label: string;
  className?: string;
  magnetic?: boolean;
}) {
  return (
    <a
      href={href}
      data-magnetic={magnetic ? "" : undefined}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 ${className}`}
    >
      {label}
    </a>
  );
}

export function SecondaryButton({
  href,
  label,
  className = "",
  magnetic = false,
}: {
  href: string;
  label: string;
  className?: string;
  magnetic?: boolean;
}) {
  return (
    <a
      href={href}
      data-magnetic={magnetic ? "" : undefined}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md border border-current/20 bg-transparent px-5 py-3 text-sm font-semibold transition hover:bg-black/5 ${className}`}
    >
      {label}
    </a>
  );
}

export function CtaPair({
  primary,
  secondary,
  className = "",
  magnetic = false,
}: {
  primary: Cta;
  secondary?: Cta;
  className?: string;
  magnetic?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <PrimaryButton
        href={primary.href}
        label={primary.label}
        magnetic={magnetic}
      />
      {secondary ? (
        <SecondaryButton
          href={secondary.href}
          label={secondary.label}
          magnetic={magnetic}
        />
      ) : null}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div data-reveal className="mx-auto mb-10 max-w-2xl text-center">
      <h2
        className={`font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-[var(--color-foreground)]"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-base leading-relaxed ${
            light ? "text-white/80" : "text-[var(--color-muted-foreground)]"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} na 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]"}
        >
          ★
        </span>
      ))}
    </div>
  );
}
