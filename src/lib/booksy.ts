export type BooksyConfig = {
  businessId: string;
  profileUrl: string;
  country?: string;
  lang?: string;
};

export function booksyWidgetUrl({
  businessId,
  country = "pl",
  lang = "pl",
}: Pick<BooksyConfig, "businessId" | "country" | "lang">): string {
  const params = new URLSearchParams({
    id: businessId,
    lang,
    country,
    mode: "dialog",
    theme: "default",
  });
  return `https://booksy.com/widget/index.html?${params.toString()}`;
}

export function booksyScriptUrl({
  businessId,
  country = "pl",
  lang = "pl",
}: Pick<BooksyConfig, "businessId" | "country" | "lang">): string {
  const params = new URLSearchParams({ id: businessId, country, lang });
  return `https://booksy.com/widget/code.js?${params.toString()}`;
}
