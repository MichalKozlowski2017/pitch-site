import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const username = process.argv[2] ?? "katarzyna.strzebinczyk_nail";
  const dest = join(
    process.cwd(),
    process.argv[3] ?? "public/images/katarzyna-strzebinczyk-gliwice",
  );
  mkdirSync(dest, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  for (let i = 0; i < 5; i += 1) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
  }

  const urls: string[] = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("main img")];
    return [
      ...new Set(
        imgs
          .map((img) => (img as HTMLImageElement).src)
          .filter(
            (s) =>
              s.includes("cdninstagram") &&
              !s.includes("s150x150") &&
              !s.includes("p150x150"),
          ),
      ),
    ];
  });

  console.log(`Found ${urls.length} thumbnail URLs`);

  let saved = 0;
  for (const url of urls) {
    const candidates = [
      url.replace(/s\d+x\d+/g, "s1080x1080").replace(/p\d+x\d+/g, "p1080x1080"),
      url.replace(/s640x640/g, "s1080x1080"),
      url,
    ];
    for (const hi of [...new Set(candidates)]) {
      try {
        const res = await page.request.get(hi);
        if (!res.ok()) continue;
        const buf = await res.body();
        if (buf.length < 8000) continue;
        saved += 1;
        writeFileSync(join(dest, `ig-${String(saved).padStart(2, "0")}.jpg`), buf);
        console.log(`Saved ig-${String(saved).padStart(2, "0")}.jpg (${buf.length} bytes)`);
        break;
      } catch {
        /* try next candidate */
      }
    }
  }

  await browser.close();
  console.log(`Done: ${saved} Instagram photos → ${dest}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
