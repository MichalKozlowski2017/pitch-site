import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/** Największe zdjęcie z posta IG (bez cropu s640x640). */
async function bestPhotoFromPost(page: import("playwright").Page): Promise<string | null> {
  return page.evaluate(() => {
    const imgs = [
      ...document.querySelectorAll('img[src*="cdninstagram"]'),
    ] as HTMLImageElement[];

    const posts = imgs.filter(
      (img) =>
        img.src.includes("/t39.30808-") &&
        !img.src.includes("s150x150") &&
        !img.src.includes("p150x150"),
    );

    if (posts.length === 0) return null;

    const scored = posts.map((img) => ({
      src: img.src,
      area: img.naturalWidth * img.naturalHeight,
      cropped: /s\d+x\d+|c\d+\.\d+\.\d+\.\d+a/.test(img.src),
    }));

    scored.sort((a, b) => {
      if (a.cropped !== b.cropped) return a.cropped ? 1 : -1;
      return b.area - a.area;
    });

    const best = scored[0]?.src;
    if (!best) return null;

    // Usuń crop/size z URL — zostaje pełna rozdzielczość (zwykle ~1080–1440 px).
    const url = new URL(best);
    url.searchParams.set("stp", "dst-jpg_e35_tt6");
    return url.toString();
  });
}

async function collectPostLinks(page: import("playwright").Page, limit: number) {
  const links = new Set<string>();

  for (let i = 0; i < 10 && links.size < limit; i += 1) {
    const batch: string[] = await page.evaluate(() =>
      [...document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]')]
        .map((a) => (a as HTMLAnchorElement).href.split("?")[0])
        .filter(Boolean),
    );
    batch.forEach((href) => links.add(href));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
  }

  return [...links].slice(0, limit);
}

async function main() {
  const username = process.argv[2] ?? "katarzyna.strzebinczyk_nail";
  const dest = join(
    process.cwd(),
    process.argv[3] ?? "public/images/katarzyna-strzebinczyk-gliwice",
  );
  const limit = Number(process.argv[4] ?? 12);
  mkdirSync(dest, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(2500);

  const postLinks = await collectPostLinks(page, limit);
  console.log(`Found ${postLinks.length} post URLs`);

  let saved = 0;
  for (const link of postLinks) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2000);

      const photoUrl = await bestPhotoFromPost(page);
      if (!photoUrl) {
        console.warn(`Skip (no photo): ${link}`);
        continue;
      }

      const res = await page.request.get(photoUrl);
      if (!res.ok()) {
        console.warn(`HTTP ${res.status()}: ${link}`);
        continue;
      }

      const buf = await res.body();
      if (buf.length < 20000) {
        console.warn(`Too small (${buf.length} B): ${link}`);
        continue;
      }

      saved += 1;
      const name = `ig-${String(saved).padStart(2, "0")}.jpg`;
      writeFileSync(join(dest, name), buf);
      console.log(`Saved ${name} (${Math.round(buf.length / 1024)} KB) ← ${link}`);
    } catch (err) {
      console.warn(`Error on ${link}:`, err);
    }
  }

  await browser.close();
  console.log(`Done: ${saved} Instagram photos → ${dest}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
