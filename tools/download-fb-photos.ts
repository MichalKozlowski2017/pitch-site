import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function bestPhotoFromFbPhotoPage(page: import("playwright").Page): Promise<string | null> {
  return page.evaluate(() => {
    const og = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
    const imgs = [...document.querySelectorAll('img[src*="fbcdn.net"]')] as HTMLImageElement[];

    const posts = imgs.filter(
      (img) =>
        img.naturalWidth >= 400 &&
        !img.src.includes("static.xx.fbcdn.net") &&
        !img.src.includes("emoji") &&
        !img.src.includes("s60x60") &&
        !img.src.includes("s206x206"),
    );

    posts.sort(
      (a, b) => b.naturalWidth * b.naturalHeight - a.naturalWidth * a.naturalHeight,
    );

    const best = posts[0]?.src ?? og;
    if (!best) return null;

    const url = new URL(best);
    url.searchParams.set("stp", "dst-jpg_tt6");
    return url.toString();
  });
}

async function collectPhotoLinks(page: import("playwright").Page, limit: number) {
  const links = new Set<string>();

  for (let i = 0; i < 8 && links.size < limit; i += 1) {
    const batch: string[] = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="/photo"]')]
        .map((a) => (a as HTMLAnchorElement).href.split("&__tn__")[0])
        .filter((href) => href.includes("fbid=")),
    );
    batch.forEach((href) => links.add(href));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
  }

  return [...links].slice(0, limit);
}

/** Pobiera zdjęcia z publicznej strony FB — pełne posty, nie miniatury z grida. */
async function main() {
  const pageUrl =
    process.argv[2] ?? "https://www.facebook.com/nailartistbfranek/photos_by";
  const dest = join(
    process.cwd(),
    process.argv[3] ?? "public/images/manifaktura-barbara-franek-marki",
  );
  const limit = Number(process.argv[4] ?? 6);
  mkdirSync(dest, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);

  const photoLinks = await collectPhotoLinks(page, limit);
  console.log(`Found ${photoLinks.length} FB photo URLs`);

  let saved = 0;
  for (const link of photoLinks) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2500);

      const photoUrl = await bestPhotoFromFbPhotoPage(page);
      if (!photoUrl) {
        console.warn(`Skip (no photo): ${link}`);
        continue;
      }

      const res = await page.request.get(photoUrl);
      if (!res.ok()) continue;

      const buf = await res.body();
      if (buf.length < 20000) continue;

      saved += 1;
      const name = `fb-${String(saved).padStart(2, "0")}.jpg`;
      writeFileSync(join(dest, name), buf);
      console.log(`Saved ${name} (${Math.round(buf.length / 1024)} KB)`);
    } catch (err) {
      console.warn(`Error on ${link}:`, err);
    }
  }

  await browser.close();
  console.log(`Done: ${saved} Facebook photos → ${dest}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
