import type { ComponentType } from "react";
import type { ClientConfig, SectionProps, Variants } from "@/lib/client-config";

import { HeaderSolid } from "@/components/header/HeaderSolid";
import { HeaderTransparent } from "@/components/header/HeaderTransparent";
import { HeroFullBleed } from "@/components/hero/HeroFullBleed";
import { HeroSplit } from "@/components/hero/HeroSplit";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesBento } from "@/components/services/ServicesBento";
import { ServicesBentoFull } from "@/components/services/ServicesBentoFull";
import { ServicesCards } from "@/components/services/ServicesCards";
import { ServicesSpotlight } from "@/components/services/ServicesSpotlight";
import { ServicesRail } from "@/components/services/ServicesRail";
import { PricingCards } from "@/components/pricing/PricingCards";
import { UspList } from "@/components/usp/UspList";
import { ReviewsCards } from "@/components/reviews/ReviewsCards";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryFeaturedSlider } from "@/components/gallery/GalleryFeaturedSlider";
import { GalleryFullBleedShowcase } from "@/components/gallery/GalleryFullBleedShowcase";
import { AreaChips } from "@/components/area/AreaChips";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
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
    bento: ServicesBento,
    bentoFull: ServicesBentoFull,
    cards: ServicesCards,
    spotlight: ServicesSpotlight,
    rail: ServicesRail,
  },
  pricing: {
    cards: PricingCards,
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
    fullBleedShowcase: GalleryFullBleedShowcase,
  },
  area: {
    chips: AreaChips,
  },
  faq: {
    accordion: FaqAccordion,
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
  "gallery",
  "pricing",
  "usp",
  "reviews",
  "area",
  "faq",
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
    bento:
      "Asymetryczna siatka bento — większa karta na usługę z `highlight: true` (beauty, premium).",
    bentoFull:
      "Bento 50/50 — featured + dolna karta po lewej, 2×2 po prawej na pełną wysokość (6 usług).",
    cards:
      "Karty bez numeracji — layout dopasowany do liczby usług (3 wyśrodkowane, 6 siatka). Inny look niż bento.",
    spotlight:
      "Master-detail — lista + duży panel opisu; pill scroll na mobile. Trend tabbed spotlight (2025).",
    rail:
      "Rozszerzające się taby w poziomie (desktop) + akordeon (mobile). Filmowy flex-rail.",
  },
  pricing: {
    cards:
      "Cennik w kartach. Siatka dopasowana do liczby pozycji (3 = wyśrodkowane). Wzór tła: `pricing.pattern`.",
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
      "Duży kadr + opis realizacji, thumbs i GSAP — budowlanka / projekty z opisem.",
    fullBleedShowcase:
      "Wycentrowane portfolio cinematic (beauty) — jasne tło sekcji, ciemny kadr; nie primary obok cennika.",
  },
  area: {
    chips:
      "Chipsy miast / dzielnic. Bez bloku `area` w JSON lub puste `places` = ukryte (studio z jednym adresem).",
  },
  faq: {
    accordion:
      "FAQ w accordionie. Bez bloku `faq` w JSON albo puste items = sekcja ukryta.",
  },
  contact: {
    simple: "Telefon, mail, godziny + CTA.",
  },
  footer: {
    simple: "Minimalny footer.",
  },
} as const;
