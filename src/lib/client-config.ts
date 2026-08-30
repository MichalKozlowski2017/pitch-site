import type { CSSProperties } from "react";
import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlight: z.boolean().optional(),
});

export const uspItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const reviewSchema = z.object({
  author: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
  source: z.string().optional(),
  date: z.string().optional(),
});

export const galleryItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  place: z.string().optional(),
});

export const pricingItemSchema = z.object({
  name: z.string(),
  price: z.string(),
  description: z.string().optional(),
  highlight: z.boolean().optional(),
});

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const booksySchema = z.object({
  businessId: z.string(),
  profileUrl: z.string().url(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  buttonLabel: z.string().optional(),
  country: z.string().optional(),
  lang: z.string().optional(),
});

export const themeSchema = z.object({
  primary: z.string(),
  primaryForeground: z.string(),
  accent: z.string(),
  background: z.string(),
  foreground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  surface: z.string(),
});

export const variantsSchema = z.object({
  header: z.enum(["solid", "transparent"]),
  hero: z.enum(["fullBleedPhoto", "split"]),
  services: z.enum(["grid", "bento", "bentoFull", "cards", "spotlight", "rail"]),
  pricing: z.enum(["cards"]),
  usp: z.enum(["list"]),
  reviews: z.enum(["cards"]),
  gallery: z.enum(["grid", "featuredSlider", "fullBleedShowcase"]),
  area: z.enum(["chips"]),
  faq: z.enum(["accordion"]),
  contact: z.enum(["simple"]),
  footer: z.enum(["simple"]),
});

export const clientConfigSchema = z.object({
  business: z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    location: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    whatsapp: z.string().optional(),
    hours: z.string().optional(),
    logo: z.string().optional(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  theme: themeSchema,
  navigation: z.array(navItemSchema),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    image: z.string().optional(),
    trustBadges: z.array(z.string()).optional(),
    ctaPrimary: z.object({
      label: z.string(),
      href: z.string(),
    }),
    ctaSecondary: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
  services: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(serviceSchema),
  }),
  pricing: z
    .object({
      title: z.string(),
      subtitle: z.string().optional(),
      note: z.string().optional(),
      pattern: z
        .enum(["diagonal", "dots", "waves", "crosshatch", "rings"])
        .optional(),
      items: z.array(pricingItemSchema),
    })
    .optional(),
  usp: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(uspItemSchema),
  }),
  reviews: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(reviewSchema),
  }),
  gallery: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(galleryItemSchema),
  }),
  area: z
    .object({
      title: z.string(),
      subtitle: z.string().optional(),
      places: z.array(z.string()),
    })
    .optional(),
  faq: z
    .object({
      title: z.string(),
      subtitle: z.string().optional(),
      items: z.array(faqItemSchema),
    })
    .optional(),
  contact: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  }),
  booksy: booksySchema.optional(),
  variants: variantsSchema,
  pitch: z.object({
    enabled: z.boolean(),
    badgeText: z.string().optional(),
    offerHeadline: z.string().optional(),
    offerBody: z.string().optional(),
    offerBullets: z.array(z.string()).optional(),
    priceNote: z.string().optional(),
    /** Krótka informacja obok CTA — np. odpowiedź na wiadomość OLX. */
    contactNote: z.string().optional(),
    /** CTA sprzedawcy (Ty) — nie telefon klienta z `business`. */
    ctaPrimary: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
    ctaSecondary: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type Variants = z.infer<typeof variantsSchema>;
export type SectionProps = { client: ClientConfig };

/** tel: only when phone has enough digits; otherwise null (use OLX / CTA link). */
export function getPhoneHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 9) return `tel:${digits}`;
  return null;
}

export function themeStyleVars(client: ClientConfig): CSSProperties {
  const theme = client.theme;
  return {
    "--color-primary": theme.primary,
    "--color-primary-foreground": theme.primaryForeground,
    "--color-accent": theme.accent,
    "--color-background": theme.background,
    "--color-foreground": theme.foreground,
    "--color-muted": theme.muted,
    "--color-muted-foreground": theme.mutedForeground,
    "--color-surface": theme.surface,
  } as CSSProperties;
}
