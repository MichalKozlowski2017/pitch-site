import { chromium, type Browser, type Page } from "playwright";

export type OlxFetchResult = {
  title: string;
  description: string;
  city: string;
  sellerName: string;
  phone?: string;
  photoUrls: string[];
  photoCount: number;
  views?: number;
  offerId?: string;
  specializations: string[];
  isPrivate: boolean;
  category?: string;
  priceText?: string;
};

const SPEC_KEYWORDS = [
  "manicure",
  "pedicure",
  "paznokci",
  "hybryd",
  "żel",
  "zel",
  "rekonstrukc",
  "przedłuż",
];

function normalizePhotoUrl(url: string): string {
  const base = url.replace(":443", "").split(";")[0] ?? url;
  return `${base};s=1280x960`;
}

function normalizePhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) return `+48${digits}`;
  if (digits.length === 11 && digits.startsWith("48")) return `+${digits}`;
  return undefined;
}

async function parseJsonLd(page: Page): Promise<Partial<OlxFetchResult>> {
  return page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    );
    for (const script of scripts) {
      try {
        const data = JSON.parse(script.textContent ?? "");
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item["@type"] !== "Service" && item["@type"] !== "Product") continue;
          const provider = item.provider ?? item;
          const images = (provider.image ?? item.image ?? []) as string | string[];
          const imageList = Array.isArray(images) ? images : [images];
          return {
            title: provider.name ?? item.name,
            description: provider.description ?? item.description,
            city: provider.address?.addressLocality,
            photoUrls: imageList.filter(Boolean),
          };
        }
      } catch {
        // ignore invalid JSON-LD
      }
    }
    return {};
  });
}

async function extractFromDom(page: Page): Promise<Partial<OlxFetchResult>> {
  return page.evaluate((specKeywords) => {
    const title =
      document.querySelector("h1")?.textContent?.trim() ??
      document.title.split("•")[0]?.trim() ??
      "";

    const descEl =
      document.querySelector('[data-cy="ad_description"]') ??
      document.querySelector('[data-testid="ad-description"]');
    const description = descEl?.textContent?.trim() ?? "";

    const bodyText = document.body.innerText;
    const offerId = bodyText.match(/ID:\s*(\d+)/i)?.[1];

    const cityFromTitle = title.match(
      /(Chorzów|Wrocław|Kraków|Katowice|Gliwice|Bytom|Zabrze|[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż\-]+)\s*$/i,
    )?.[1]?.trim();
    const breadcrumbCity = bodyText.match(/Paznokcie\s*-\s*([A-Za-zÀ-ž\-]+)/i)?.[1]?.trim();
    const city = cityFromTitle ?? breadcrumbCity ?? "";

    const sellerName =
      document.querySelector('[data-testid="user-profile-link"] h4')?.textContent?.trim() ??
      "";

    const telHref = document.querySelector('a[href^="tel:"]')?.getAttribute("href");
    const phoneFromTel = telHref?.replace("tel:", "").trim();
    const phoneFromText = bodyText.match(/(\d{3}[\s-]\d{3}[\s-]\d{3})/)?.[1];

    const viewsMatch =
      bodyText.match(/Wyświetlenia:\s*(\d+)/i) ??
      bodyText.match(/(\d+)\s*wyświetle/i);
    const views = Number(viewsMatch?.[1] ?? NaN);

    const imgs = [
      ...new Set(
        Array.from(document.querySelectorAll("img"))
          .map((img) => (img as HTMLImageElement).currentSrc || img.src)
          .filter((src) => src.includes("apollo.olxcdn.com/v1/files/"))
          .map((src) => src.split(";")[0] ?? src),
      ),
    ];

    const specs = Array.from(document.querySelectorAll("li, span"))
      .map((el) => el.textContent?.trim() ?? "")
      .filter(
        (text) =>
          text.length > 4 &&
          text.length < 50 &&
          specKeywords.some((kw) => text.toLowerCase().includes(kw)),
      );

    const isPrivate = /Prywatne|Osoba prywatna/i.test(bodyText);
    const priceText =
      bodyText.match(/(\d+[\s,.]?\d*\s*zł)/i)?.[1] ??
      description.match(/(\d+[\s,.]?\d*\s*zł)/i)?.[1];

    return {
      title,
      description,
      city,
      sellerName,
      phone: phoneFromTel || phoneFromText,
      photoUrls: imgs,
      photoCount: imgs.length,
      views: Number.isFinite(views) ? views : undefined,
      offerId,
      specializations: [...new Set(specs)],
      isPrivate,
      priceText,
      category: "paznokcie",
    };
  }, SPEC_KEYWORDS);
}

async function revealPhone(page: Page): Promise<string | undefined> {
  const showButton = page
    .locator('button:has-text("Pokaż"), [data-testid="show-phone"]')
    .first();
  if ((await showButton.count()) === 0) return undefined;

  try {
    await showButton.click({ timeout: 4000 });
    await page.waitForTimeout(800);
  } catch {
    return undefined;
  }

  const phone = await page.evaluate(() => {
    const tel = document.querySelector('a[href^="tel:"]')?.getAttribute("href");
    if (tel) return tel.replace("tel:", "").trim();
    const match = document.body.innerText.match(/(\d{3}[\s-]\d{3}[\s-]\d{3})/);
    return match?.[1];
  });

  return phone ? normalizePhone(phone) : undefined;
}

async function launchBrowser(): Promise<Browser> {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

export async function fetchOlxListing(
  sourceUrl: string,
  phoneOverride?: string,
): Promise<OlxFetchResult> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    await page.goto(sourceUrl, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForTimeout(1500);

    const [jsonLd, dom] = await Promise.all([parseJsonLd(page), extractFromDom(page)]);
    const revealedPhone = await revealPhone(page);
    const phone =
      normalizePhone(phoneOverride ?? "") ??
      revealedPhone ??
      normalizePhone(dom.phone ?? "");

    const photoUrls = [
      ...new Set(
        [...(jsonLd.photoUrls ?? []), ...(dom.photoUrls ?? [])].map(normalizePhotoUrl),
      ),
    ];

    const description = dom.description || jsonLd.description || "";
    const title = (dom.title || jsonLd.title || "Ogłoszenie OLX")
      .replace(/\s+•.*$/, "")
      .replace(/\s+Chorzów\s*$/i, "")
      .trim();

    return {
      title,
      description,
      city: jsonLd.city ?? dom.city ?? "",
      sellerName: dom.sellerName ?? "",
      phone,
      photoUrls,
      photoCount: photoUrls.length,
      views: dom.views,
      offerId: dom.offerId,
      specializations: dom.specializations ?? [],
      isPrivate: dom.isPrivate ?? true,
      category: dom.category,
      priceText: dom.priceText,
    };
  } finally {
    await browser.close();
  }
}

export function isOlxUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.includes("olx.pl") || host.includes("olx.");
  } catch {
    return false;
  }
}
