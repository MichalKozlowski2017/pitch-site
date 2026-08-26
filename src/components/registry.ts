import type { ComponentType } from "react";
import type { ClientConfig, SectionProps, Variants } from "@/lib/client-config";

import { HeaderSolid } from "@/components/header/HeaderSolid";
import { HeaderTransparent } from "@/components/header/HeaderTransparent";
import { HeroFullBleed } from "@/components/hero/HeroFullBleed";
import { HeroSplit } from "@/components/hero/HeroSplit";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { UspList } from "@/components/usp/UspList";
import { ReviewsCards } from "@/components/reviews/ReviewsCards";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryFeaturedSlider } from "@/components/gallery/GalleryFeaturedSlider";
import { AreaChips } from "@/components/area/AreaChips";
import { ContactSimple } from "@/components/contact/ContactSimple";
import { FooterSimple } from "@/components/footer/FooterSimple";

type RegistryMap = {
  [K in keyof Variants]: Record<Variants[K], ComponentType<SectionProps>>;
};

export const registry: RegistryMap = {
  header: {
    solid: HeaderSolid,
    transparent: HeaderTransparent,
  },
  hero: {
    fullBleedPhoto: HeroFullBleed,
    split: HeroSplit,
  },
  services: {
    grid: ServicesGrid,
  },
  usp: {
    list: UspList,
  },
  reviews: {
    cards: ReviewsCards,
  },
  gallery: {
    grid: GalleryGrid,
    featuredSlider: GalleryFeaturedSlider,
  },
  area: {
    chips: AreaChips,
  },
  contact: {
    simple: ContactSimple,
  },
  footer: {
    simple: FooterSimple,
  },
};

export const slotOrder = [
  "header",
  "hero",
  "services",
  "usp",
  "reviews",
  "gallery",
  "area",
  "contact",
  "footer",
] as const satisfies ReadonlyArray<keyof Variants>;

export function resolveSection<K extends keyof Variants>(
  slot: K,
  variant: Variants[K],
): ComponentType<SectionProps> {
  const map = registry[slot] as Record<string, ComponentType<SectionProps>>;
  const Component = map[variant];
  if (!Component) {
    throw new Error(`Unknown variant "${String(variant)}" for slot "${String(slot)}"`);
  }
  return Component;
}

export function renderLandingSlots(client: ClientConfig) {
  return slotOrder.map((slot) => {
    const Component = resolveSection(slot, client.variants[slot]);
    return { slot, Component };
  });
}

export const variantCatalog = {
  header: {
    solid: "Domyślny sticky header na jasnym tle — większość zleceń.",
    transparent:
      "Nad full-bleed hero ze zdjęciem — elegancki look, wymaga ciemnego overlay.",
  },
  hero: {
    fullBleedPhoto:
      "Gdy klient ma mocne zdjęcie pracy / obiektu — największy efekt wow.",
    split: "Gdy zdjęcie jest słabsze albo chcesz więcej tekstu od razu.",
  },
  services: {
    grid: "Standardowa siatka usług z ogłoszenia.",
  },
  usp: {
    list: "Lista benefitów / USP.",
  },
  reviews: {
    cards: "Karty z prawdziwymi opiniami Google.",
  },
  gallery: {
    grid: "Prosta siatka realizacji.",
    featuredSlider:
      "Duży kadr + opis realizacji, thumbs i GSAP przy zmianie — gdy masz 3–6 mocnych zdjęć.",
  },
  area: {
    chips: "Chipsy miast / dzielnic.",
  },
  contact: {
    simple: "Telefon, mail, godziny + CTA.",
  },
  footer: {
    simple: "Minimalny footer.",
  },
} as const;
