import { readFileSync } from "node:fs";
import { join } from "node:path";

export type TrackerRow = {
  slug: string;
  firma: string;
  branza: string;
  miasto: string;
  telefon: string;
  zrodlo_ogloszenia: string;
  status: string;
};

const TRACKER_PATH = join(process.cwd(), "data/outreach-tracker.csv");

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function normalizePhone(phone: string | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9) return `48${digits}`;
  return digits;
}

function normalizeUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, "");
  } catch {
    return url.trim().toLowerCase();
  }
}

export function readTracker(): TrackerRow[] {
  const raw = readFileSync(TRACKER_PATH, "utf8").trim();
  const lines = raw.split("\n");
  const header = parseCsvLine(lines[0] ?? "");

  return lines.slice(1).flatMap((line) => {
    if (!line.trim()) return [];
    const cols = parseCsvLine(line);
    const row: Record<string, string> = {};
    header.forEach((key, index) => {
      row[key] = cols[index] ?? "";
    });
    return [
      {
        slug: row.slug ?? "",
        firma: row.firma ?? "",
        branza: row.branza ?? "",
        miasto: row.miasto ?? "",
        telefon: row.telefon ?? "",
        zrodlo_ogloszenia: row.zrodlo_ogloszenia ?? "",
        status: row.status ?? "",
      },
    ];
  });
}

export function findTrackerDuplicate(input: {
  phone?: string;
  firma?: string;
  sourceUrl: string;
}): TrackerRow | undefined {
  const phoneNorm = normalizePhone(input.phone);
  const urlNorm = normalizeUrl(input.sourceUrl);
  const firmaNorm = (input.firma ?? "").trim().toLowerCase();

  return readTracker().find((row) => {
    if (phoneNorm && normalizePhone(row.telefon) === phoneNorm) return true;
    if (urlNorm && normalizeUrl(row.zrodlo_ogloszenia) === urlNorm) return true;
    if (firmaNorm && row.firma.trim().toLowerCase() === firmaNorm) return true;
    return false;
  });
}

export function slugFromListing(title: string, city?: string): string {
  const base = [title, city].filter(Boolean).join(" ");
  return base
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
