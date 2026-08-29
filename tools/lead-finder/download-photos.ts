import { createWriteStream, mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { join } from "node:path";
import { slugFromListing } from "./tracker";

export type DownloadPhotosResult = {
  slug: string;
  outputDir: string;
  files: string[];
  failed: string[];
};

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Referer: "https://www.olx.pl/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!res.body) throw new Error("Empty body");

  await pipeline(Readable.fromWeb(res.body as import("stream/web").ReadableStream), createWriteStream(dest));
}

export async function downloadListingPhotos(input: {
  photoUrls: string[];
  title: string;
  city?: string;
  outputRoot?: string;
}): Promise<DownloadPhotosResult> {
  const slug = slugFromListing(input.title, input.city);
  const outputDir = join(process.cwd(), input.outputRoot ?? "data/leads/assets", slug);
  mkdirSync(outputDir, { recursive: true });

  const files: string[] = [];
  const failed: string[] = [];

  for (let i = 0; i < input.photoUrls.length; i += 1) {
    const url = input.photoUrls[i]!;
    const filename = `${String(i + 1).padStart(2, "0")}.jpg`;
    const dest = join(outputDir, filename);
    try {
      await downloadFile(url, dest);
      files.push(dest);
    } catch {
      failed.push(url);
    }
  }

  return { slug, outputDir, files, failed };
}

export function toPublicImagePaths(outputDir: string, slug: string): string[] {
  return Array.from({ length: 99 }, (_, i) => i + 1)
    .map((n) => join(outputDir, `${String(n).padStart(2, "0")}.jpg`))
    .filter((_, i) => i < 20)
    .map((_, i) => `/images/${slug}/${String(i + 1).padStart(2, "0")}.jpg`);
}
