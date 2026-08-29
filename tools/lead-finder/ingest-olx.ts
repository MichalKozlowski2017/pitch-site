import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { analyzePhotos } from "./analyze-photos";
import { downloadListingPhotos } from "./download-photos";
import { fetchOlxListing, isOlxUrl } from "./fetch-olx";
import { formatIngestReport, formatMarkdownReport } from "./report";
import { scoreLead } from "./score";
import { leadInputSchema, type LeadInput } from "./types";

export type IngestOptions = {
  sourceUrl: string;
  save?: boolean;
  skipDownload?: boolean;
  industry?: string;
  phone?: string;
};

export type IngestResult = {
  input: LeadInput;
  score: ReturnType<typeof scoreLead>;
  assetsDir?: string;
  leadFile?: string;
};

export async function ingestOlxLead(options: IngestOptions): Promise<IngestResult> {
  if (!isOlxUrl(options.sourceUrl)) {
    throw new Error("Obsługiwane są na razie linki OLX (olx.pl).");
  }

  console.error("→ Pobieram ogłoszenie z OLX (Playwright)…");
  const fetched = await fetchOlxListing(options.sourceUrl, options.phone);

  let photoAnalysis;
  let assetsDir: string | undefined;

  if (!options.skipDownload && fetched.photoUrls.length > 0) {
    console.error(`→ Pobieram ${fetched.photoUrls.length} zdjęć…`);
    const downloaded = await downloadListingPhotos({
      photoUrls: fetched.photoUrls,
      title: fetched.title,
      city: fetched.city,
    });
    assetsDir = downloaded.outputDir;

    if (downloaded.failed.length > 0) {
      console.error(`⚠ Nie udało się pobrać ${downloaded.failed.length} zdjęć`);
    }

    console.error("→ Analizuję zdjęcia…");
    photoAnalysis = {
      ...analyzePhotos(downloaded.files),
      assetsDir: downloaded.outputDir,
    };
  }

  const description = [
    fetched.description,
    fetched.specializations.length > 0
      ? `Specjalizacje: ${fetched.specializations.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const input = leadInputSchema.parse({
    sourceUrl: options.sourceUrl,
    industry: options.industry ?? inferIndustry(fetched.title, description),
    listing: {
      title: fetched.title,
      description,
      phone: fetched.phone,
      city: fetched.city,
      sellerName: fetched.sellerName,
      photoCount: fetched.photoCount,
      photoUrls: fetched.photoUrls.map((u) => u.split(";")[0] ?? u),
      views: fetched.views,
      isPrivate: fetched.isPrivate,
      category: fetched.category,
      priceText: fetched.priceText,
      linksInDescription: [],
    },
    research: {
      website: { found: false },
      googleMaps: { found: false },
      booksy: { found: false },
      instagram: { found: false },
      facebook: { found: false },
      redFlags: photoAnalysis?.flags.includes("niska_jakosc") ? ["niska_jakosc_zdjec"] : [],
      notes: buildIngestNotes(fetched, photoAnalysis),
    },
    photoAnalysis,
  });

  const score = scoreLead(input);

  let leadFile: string | undefined;
  if (options.save) {
    const leadsDir = join(process.cwd(), "data/leads");
    mkdirSync(leadsDir, { recursive: true });
    leadFile = join(leadsDir, `${score.slug}.json`);
    writeFileSync(leadFile, JSON.stringify(input, null, 2));

    const scoresDir = join(process.cwd(), "data/leads/scores");
    mkdirSync(scoresDir, { recursive: true });
    const scoreBase = join(scoresDir, score.slug);
    writeFileSync(scoreBase + ".json", JSON.stringify({ input, result: score }, null, 2));
    writeFileSync(scoreBase + ".md", formatMarkdownReport(input, score));

    console.error(`Zapisano: ${leadFile}`);
    console.error(`Zapisano: ${scoreBase}.json, ${scoreBase}.md`);
    if (assetsDir) console.error(`Zdjęcia: ${assetsDir}`);
  }

  return { input, score, assetsDir, leadFile };
}

function inferIndustry(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (/paznokci|manicure|pedicure|hybryd|beauty|salon/.test(text)) return "beauty / paznokcie";
  if (/hydraul|remont|malow|budow|elektryk/.test(text)) return "budowlanka / usługi";
  return "usługi lokalne";
}

function buildIngestNotes(
  fetched: Awaited<ReturnType<typeof fetchOlxListing>>,
  photoAnalysis?: ReturnType<typeof analyzePhotos> & { assetsDir?: string },
): string {
  const parts = [
    "Auto-ingest z OLX.",
    fetched.offerId ? `ID ogłoszenia: ${fetched.offerId}.` : "",
    photoAnalysis ? `Analiza zdjęć: ${photoAnalysis.summary}` : "Bez pobranych zdjęć.",
    !fetched.phone ? "Telefon niewidoczny — uzupełnij ręcznie po kliknięciu Pokaż." : "",
    "Research www/Maps/Booksy — do uzupełnienia przez agenta.",
  ];
  return parts.filter(Boolean).join(" ");
}

function usage(): never {
  console.log(`Lead ingest — pobierz ogłoszenie OLX, zdjęcia i oceń

Użycie:
  npm run lead:ingest -- --url <OLX_URL>
  npm run lead:ingest -- --url <OLX_URL> --save
  npm run lead:ingest -- --url <OLX_URL> --save --skip-download

Opcje:
  --url <url>         Link do ogłoszenia OLX (wymagane)
  --save              Zapisz data/leads/<slug>.json + scores + zdjęcia
  --skip-download     Tylko fetch metadanych, bez pobierania zdjęć
  --phone <+48…>      Nadpisz telefon (gdy OLX nie odsłania w headless)
  --json              Wynik scoringu jako JSON
`);
  process.exit(1);
}

async function main() {
  const argv = process.argv.slice(2);
  let sourceUrl = "";
  let save = false;
  let skipDownload = false;
  let json = false;
  let phone = "";

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--url") sourceUrl = argv[++i] ?? "";
    else if (arg === "--save") save = true;
    else if (arg === "--skip-download") skipDownload = true;
    else if (arg === "--phone") phone = argv[++i] ?? "";
    else if (arg === "--json") json = true;
    else if (arg === "--help" || arg === "-h") usage();
  }

  if (!sourceUrl) usage();

  const result = await ingestOlxLead({ sourceUrl, save, skipDownload, phone: phone || undefined });

  if (json) {
    console.log(JSON.stringify(result.score, null, 2));
  } else {
    console.log(formatIngestReport(result.input, result.score, result.assetsDir));
  }
}

main().catch((err) => {
  console.error(`Błąd: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
