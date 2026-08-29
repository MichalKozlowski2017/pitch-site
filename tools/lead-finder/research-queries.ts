import type { LeadInput } from "./types";

function googleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function buildResearchQueries(input: LeadInput) {
  const { listing } = input;
  const rawName =
    listing.sellerName ?? listing.title.split(/[–\-|]/)[0]?.trim() ?? listing.title;
  const name = rawName.includes("css-") || rawName.length > 40
    ? (rawName.match(/\b(Ludmila|Lena|[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{2,})\b/)?.[1] ?? listing.title.split(/[–\-/]/)[0]?.trim() ?? "salon")
    : rawName;
  const city = (listing.city ?? "").replace(/.*-\s*/, "").trim() || listing.city || "";
  const phone = listing.phone?.replace(/\s/g, "") ?? "";

  const queries: { label: string; query: string; url: string }[] = [
    {
      label: "Strona www",
      query: `"${name}" ${city} strona`.trim(),
      url: googleSearchUrl(`"${name}" ${city} strona`.trim()),
    },
    {
      label: "Google Maps / opinie",
      query: `${name} ${city}`.trim(),
      url: googleSearchUrl(`${name} ${city}`.trim()),
    },
    {
      label: "Booksy",
      query: `${name} ${city} booksy`.trim(),
      url: googleSearchUrl(`${name} ${city} booksy`.trim()),
    },
    {
      label: "Instagram",
      query: `${name} ${city} instagram paznokcie manicure`.trim(),
      url: googleSearchUrl(`${name} ${city} instagram`.trim()),
    },
    {
      label: "Facebook",
      query: `${name} ${city} facebook`.trim(),
      url: googleSearchUrl(`${name} ${city} facebook`.trim()),
    },
  ];

  if (phone) {
    queries.push({
      label: "Telefon (duplikat / inne ogłoszenia)",
      query: phone,
      url: googleSearchUrl(phone),
    });
  }

  return queries;
}
