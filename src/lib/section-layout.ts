/** SVG tła sekcji — rotuj wzór między pitchami (patrz docs/pitch-design-algorithm.md). */
export type PricingPatternId =
  | "diagonal"
  | "dots"
  | "waves"
  | "crosshatch"
  | "rings";

const patterns: Record<PricingPatternId, { layers: string[] }> = {
  diagonal: {
    layers: [
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><path d='M0 48L48 0' stroke='white' stroke-width='0.6' fill='none'/><circle cx='24' cy='24' r='1.1' fill='white'/></svg>`,
      )}")`,
    ],
  },
  dots: {
    layers: [
      `radial-gradient(circle at 1px 1px, white 0.55px, transparent 0)`,
    ],
  },
  waves: {
    layers: [
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'><path d='M0 20 Q20 8 40 20 T80 20' stroke='white' stroke-width='0.5' fill='none'/><path d='M0 28 Q20 16 40 28 T80 28' stroke='white' stroke-width='0.35' fill='none' opacity='0.6'/></svg>`,
      )}")`,
    ],
  },
  crosshatch: {
    layers: [
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M0 32L32 0M-8 8L8 -8M24 40L40 24' stroke='white' stroke-width='0.45' fill='none'/></svg>`,
      )}")`,
    ],
  },
  rings: {
    layers: [
      `url("data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' stroke='white' stroke-width='0.4' fill='none' opacity='0.5'/><circle cx='32' cy='32' r='18' stroke='white' stroke-width='0.35' fill='none' opacity='0.35'/></svg>`,
      )}")`,
    ],
  },
};

const patternSizes: Record<PricingPatternId, string> = {
  diagonal: "48px 48px",
  dots: "22px 22px",
  waves: "80px 40px",
  crosshatch: "32px 32px",
  rings: "64px 64px",
};

const patternOpacity: Record<PricingPatternId, number> = {
  diagonal: 0.14,
  dots: 0.06,
  waves: 0.12,
  crosshatch: 0.1,
  rings: 0.11,
};

/** Kolejność rotacji — agent wybiera inny wzór niż w poprzednim pitchu tej branży. */
export const pricingPatternRotation: PricingPatternId[] = [
  "diagonal",
  "dots",
  "waves",
  "crosshatch",
  "rings",
];

export function resolvePricingPattern(
  id: PricingPatternId | undefined,
  slugHint?: string,
): PricingPatternId {
  if (id) return id;
  if (!slugHint) return "diagonal";
  let hash = 0;
  for (let i = 0; i < slugHint.length; i += 1) {
    hash = (hash + slugHint.charCodeAt(i) * (i + 1)) % pricingPatternRotation.length;
  }
  return pricingPatternRotation[hash] ?? "diagonal";
}

export function pricingPatternStyle(id: PricingPatternId): import("react").CSSProperties {
  const config = patterns[id];
  const size = patternSizes[id];
  const opacity = patternOpacity[id];

  if (id === "dots") {
    return {
      backgroundImage: config.layers[0],
      backgroundSize: size,
      opacity,
    };
  }

  return {
    backgroundImage: config.layers.join(", "),
    backgroundSize: size,
    opacity,
  };
}

/** Delikatne wzory na jasnych sekcjach — rozdziela bloki o tym samym tle. */
export type LightSectionPatternId = "dots" | "waves" | "rings" | "crosshatch";

const lightPatternSizes: Record<LightSectionPatternId, string> = {
  dots: "22px 22px",
  waves: "80px 40px",
  rings: "64px 64px",
  crosshatch: "32px 32px",
};

export function lightSectionPatternStyle(
  id: LightSectionPatternId,
): import("react").CSSProperties {
  const accentSoft = "color-mix(in srgb, var(--color-accent) 11%, transparent)";
  const inkStroke = encodeURIComponent("#2A2224");

  switch (id) {
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle at 1px 1px, ${accentSoft} 1px, transparent 0)`,
        backgroundSize: lightPatternSizes.dots,
      };
    case "waves":
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'><path d='M0 20 Q20 8 40 20 T80 20' stroke='${decodeURIComponent(inkStroke)}' stroke-width='0.55' fill='none' opacity='0.07'/><path d='M0 28 Q20 16 40 28 T80 28' stroke='${decodeURIComponent(inkStroke)}' stroke-width='0.4' fill='none' opacity='0.04'/></svg>`,
        )}")`,
        backgroundSize: lightPatternSizes.waves,
      };
    case "rings":
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' stroke='${decodeURIComponent(inkStroke)}' stroke-width='0.45' fill='none' opacity='0.06'/><circle cx='32' cy='32' r='18' stroke='${decodeURIComponent(inkStroke)}' stroke-width='0.35' fill='none' opacity='0.04'/></svg>`,
        )}")`,
        backgroundSize: lightPatternSizes.rings,
      };
    case "crosshatch":
      return {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M0 32L32 0M-8 8L8 -8M24 40L40 24' stroke='${decodeURIComponent(inkStroke)}' stroke-width='0.4' fill='none' opacity='0.05'/></svg>`,
        )}")`,
        backgroundSize: lightPatternSizes.crosshatch,
      };
  }
}

/** Klasy siatki cennika — wyśrodkowanie i rozciągnięcie przy małej liczbie pozycji. */
export function pricingGridClass(count: number): string {
  const base = "mx-auto grid gap-4";
  if (count === 1) return `${base} max-w-md grid-cols-1`;
  if (count === 2) return `${base} max-w-3xl grid-cols-1 sm:grid-cols-2`;
  if (count === 3) return `${base} max-w-5xl grid-cols-1 sm:grid-cols-3`;
  if (count === 4) return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
  if (count <= 6) return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
  return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
}

/** Klasy siatki usług dla wariantu `cards`. */
export function servicesCardsGridClass(count: number): string {
  const base = "mx-auto grid gap-3 lg:gap-4";
  if (count === 1) return `${base} max-w-md grid-cols-1`;
  if (count === 2) return `${base} max-w-3xl grid-cols-1 sm:grid-cols-2`;
  if (count === 3) return `${base} max-w-5xl grid-cols-1 sm:grid-cols-3`;
  if (count === 4) return `${base} max-w-4xl grid-cols-1 sm:grid-cols-2`;
  if (count === 5) {
    return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2`;
  }
  if (count === 6) {
    return `${base} max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
  }
  return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
}

export function servicesCardsEqualGrid(count: number): boolean {
  return count === 6 || count >= 8;
}

export function servicesCardSpanClass(
  index: number,
  count: number,
  highlightIndex: number,
): string {
  if (servicesCardsEqualGrid(count)) {
    return "min-h-[12rem]";
  }
  if (count === 5 && index === highlightIndex) {
    return "lg:col-span-3 lg:row-span-2 min-h-[14rem]";
  }
  if (count === 5) return "lg:col-span-3 min-h-[10rem]";
  if (count >= 6 && index === highlightIndex) {
    return "sm:col-span-2 lg:col-span-2 min-h-[13rem]";
  }
  return "min-h-[11rem]";
}
