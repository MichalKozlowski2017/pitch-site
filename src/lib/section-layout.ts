/** Klasy siatki cennika — dopasowanie do liczby pozycji (9 = 3×3). */
export function pricingGridClass(count: number): string {
  const base = "mx-auto grid gap-4";
  if (count === 1) return `${base} max-w-md grid-cols-1`;
  if (count === 2) return `${base} max-w-3xl grid-cols-1 sm:grid-cols-2`;
  if (count === 3) return `${base} max-w-5xl grid-cols-1 sm:grid-cols-3`;
  if (count === 4) return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
  if (count <= 6 || count % 3 === 0) {
    return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
  }
  return `${base} max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
}
