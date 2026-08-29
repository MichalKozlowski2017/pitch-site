import { readFileSync } from "node:fs";
import { basename } from "node:path";
import sizeOf from "image-size";

import type { PhotoAnalysis } from "./types";

export type PhotoFileAnalysis = PhotoAnalysis["files"][number];

function analyzeFile(filePath: string): PhotoFileAnalysis {
  const buffer = readFileSync(filePath);
  const dimensions = sizeOf(buffer);
  const width = dimensions.width ?? 0;
  const height = dimensions.height ?? 0;
  const longEdge = Math.max(width, height);

  return {
    file: filePath,
    name: basename(filePath),
    width,
    height,
    bytes: buffer.length,
    aspectRatio: height > 0 ? width / height : 1,
    longEdge,
    isPortrait: height > width,
  };
}

export function analyzePhotos(filePaths: string[]): PhotoAnalysis {
  if (filePaths.length === 0) {
    return {
      count: 0,
      avgWidth: 0,
      avgHeight: 0,
      avgLongEdge: 0,
      minLongEdge: 0,
      maxLongEdge: 0,
      totalBytes: 0,
      portraitCount: 0,
      qualityScore: 0,
      suitableForHero: false,
      suitableForGallery: false,
      flags: ["brak_zdjec"],
      files: [],
      summary: "Brak pobranych zdjęć — demo bez galerii.",
    };
  }

  const files = filePaths.map(analyzeFile);
  const flags: string[] = [];

  const totalBytes = files.reduce((sum, f) => sum + f.bytes, 0);
  const avgWidth = Math.round(files.reduce((s, f) => s + f.width, 0) / files.length);
  const avgHeight = Math.round(files.reduce((s, f) => s + f.height, 0) / files.length);
  const longEdges = files.map((f) => f.longEdge);
  const avgLongEdge = Math.round(longEdges.reduce((s, n) => s + n, 0) / longEdges.length);
  const minLongEdge = Math.min(...longEdges);
  const maxLongEdge = Math.max(...longEdges);
  const portraitCount = files.filter((f) => f.isPortrait).length;

  const sharpPhotos = files.filter((f) => f.longEdge >= 720 && f.bytes >= 25_000);
  const weakPhotos = files.filter((f) => f.longEdge < 540 || f.bytes < 15_000);

  if (files.length < 3) flags.push("mal_zdjec");
  if (sharpPhotos.length < Math.ceil(files.length / 2)) flags.push("niska_jakosc");
  if (minLongEdge < 400) flags.push("bardzo_mala_rozdzielczosc");
  if (weakPhotos.length === files.length) flags.push("wszystkie_slabe");

  const suitableForGallery = sharpPhotos.length >= 3;
  const suitableForHero = files.some(
    (f) => f.longEdge >= 800 && f.bytes >= 35_000 && (f.isPortrait || Math.abs(f.aspectRatio - 1) < 0.15),
  );

  let qualityScore = 0;
  qualityScore += Math.min(3, files.length * 0.5);
  qualityScore += Math.min(4, sharpPhotos.length * 0.7);
  qualityScore += suitableForHero ? 1.5 : 0;
  qualityScore += suitableForGallery ? 1.5 : 0;
  qualityScore = Math.min(10, Math.round(qualityScore * 10) / 10);

  const summary = [
    `${files.length} zdjęć (${sharpPhotos.length} w dobrej jakości)`,
    `rozdz. ${minLongEdge}–${maxLongEdge}px`,
    suitableForHero ? "OK na hero" : "słabe na hero",
    suitableForGallery ? "OK na galerię" : "mało materiału do galerii",
  ].join("; ");

  return {
    count: files.length,
    avgWidth,
    avgHeight,
    avgLongEdge,
    minLongEdge,
    maxLongEdge,
    totalBytes,
    portraitCount,
    qualityScore,
    suitableForHero,
    suitableForGallery,
    flags,
    files,
    summary,
  };
}
