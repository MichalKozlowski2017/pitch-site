#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { formatBriefMarkdown, formatMarkdownReport } from "./report";
import { scoreLead } from "./score";
import { leadInputSchema } from "./types";

function usage(): never {
  console.log(`Lead scoring — pitch-site

Użycie:
  npm run lead:score -- --url <OLX_URL> --brief
  npm run lead:score -- --file data/leads/<slug>.json
  npm run lead:score -- --file data/leads/<slug>.json --save

Opcje:
  --url <url>     Tylko brief researchu (bez pełnej oceny)
  --file <path>   Plik JSON z listing + research (patrz data/leads/example-lead.json)
  --save          Zapisz wynik do data/leads/scores/<slug>.json i .md
  --json          Tylko JSON na stdout
  --brief         Brief researchu (z --url lub --file bez researchu)

Workflow agenta:
  1. Otwórz ogłoszenie w przeglądarce, wypełnij listing w JSON
  2. Wykonaj zapytania researchu (www, Google Maps, Booksy, IG)
  3. npm run lead:score -- --file data/leads/foo.json --save
`);
  process.exit(1);
}

function parseArgs(argv: string[]) {
  const args = { url: "", file: "", save: false, json: false, brief: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--url") args.url = argv[++i] ?? "";
    else if (arg === "--file") args.file = argv[++i] ?? "";
    else if (arg === "--save") args.save = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--brief") args.brief = true;
    else if (arg === "--help" || arg === "-h") usage();
  }
  return args;
}

function loadInput(filePath: string) {
  const raw = readFileSync(filePath, "utf8");
  return leadInputSchema.parse(JSON.parse(raw));
}

function researchIsEmpty(input: ReturnType<typeof loadInput>): boolean {
  const r = input.research;
  const l = input.listing;

  const hasResearchSignal =
    r.notes ||
    r.website.url ||
    r.googleMaps.url ||
    r.booksy.url ||
    r.instagram.url ||
    r.facebook.url ||
    r.otherProfiles.length > 0 ||
    r.redFlags.length > 0;

  if (hasResearchSignal) return false;

  // Listing wypełniony z ogłoszenia = można ocenić (research „nic nie znalazł” też jest OK)
  const listingReady =
    Boolean(l.phone) && l.photoCount > 0 && l.description.length >= 20 && Boolean(l.city);

  return !listingReady;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.url && !args.file) usage();

  let input;
  if (args.file) {
    input = loadInput(args.file);
  } else {
    input = leadInputSchema.parse({
      sourceUrl: args.url,
      listing: { title: args.url },
      research: {},
    });
  }

  if (args.brief || (args.url && !args.file)) {
    console.log(formatBriefMarkdown(input));
    return;
  }

  if (researchIsEmpty(input) && !args.json) {
    console.error("⚠ Research pusty — pokazuję brief. Uzupełnij JSON i odpal ponownie.\n");
    console.log(formatBriefMarkdown(input));
    process.exit(0);
  }

  const result = scoreLead(input);

  if (args.save) {
    const dir = join(process.cwd(), "data/leads/scores");
    mkdirSync(dir, { recursive: true });
    const base = join(dir, result.slug);
    writeFileSync(`${base}.json`, JSON.stringify({ input, result }, null, 2));
    writeFileSync(`${base}.md`, formatMarkdownReport(input, result));
    console.error(`Zapisano: ${base}.json, ${base}.md`);
  }

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatMarkdownReport(input, result));
  }
}

main();
