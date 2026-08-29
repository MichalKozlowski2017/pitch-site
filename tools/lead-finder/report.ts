import { buildResearchQueries } from "./research-queries";
import type { LeadInput, LeadScoreResult } from "./types";

function verdictEmoji(verdict: LeadScoreResult["verdict"]): string {
  switch (verdict) {
    case "pitch":
      return "🟢";
    case "maybe":
      return "🟡";
    case "skip":
      return "🔴";
  }
}

export function formatMarkdownReport(input: LeadInput, result: LeadScoreResult): string {
  const lines: string[] = [];

  lines.push(`# Ocena leada: ${input.listing.title}`);
  lines.push("");
  lines.push(`| Pole | Wartość |`);
  lines.push(`|------|---------|`);
  lines.push(`| **Werdykt** | ${verdictEmoji(result.verdict)} \`${result.verdict}\` |`);
  lines.push(
    `| **Kąt** | ${result.pitchAngle ? `\`${result.pitchAngle}\`` : "—"} |`,
  );
  lines.push(`| **Obecność online** | \`${result.onlinePresence}\` |`);
  lines.push(`| **Duplikat** | ${result.duplicateInTracker ? "tak" : "nie"} |`);
  lines.push(`| **Wynik** | **${result.totalScore}/100** |`);
  lines.push(`| **Źródło** | ${result.sourceUrl} |`);
  lines.push("");

  if (input.photoAnalysis) {
    lines.push("## Analiza zdjęć");
    lines.push("");
    lines.push(`| Metryka | Wartość |`);
    lines.push(`|---------|---------|`);
    lines.push(`| Liczba | ${input.photoAnalysis.count} |`);
    lines.push(`| Jakość | **${input.photoAnalysis.qualityScore}/10** |`);
    lines.push(`| Rozdzielczość | ${input.photoAnalysis.minLongEdge}–${input.photoAnalysis.maxLongEdge}px (śr. ${input.photoAnalysis.avgLongEdge}) |`);
    lines.push(`| Hero | ${input.photoAnalysis.suitableForHero ? "tak" : "nie"} |`);
    lines.push(`| Galeria | ${input.photoAnalysis.suitableForGallery ? "tak" : "nie"} |`);
    if (input.photoAnalysis.assetsDir) {
      lines.push(`| Folder | \`${input.photoAnalysis.assetsDir}\` |`);
    }
    if (input.photoAnalysis.flags.length > 0) {
      lines.push(`| Flagi | ${input.photoAnalysis.flags.join(", ")} |`);
    }
    lines.push("");
    lines.push(input.photoAnalysis.summary);
    lines.push("");
  }

  lines.push("## Wymiary");
  lines.push("");
  lines.push("| Wymiar | Wynik | Waga | Uzasadnienie |");
  lines.push("|--------|-------|------|--------------|");
  for (const dim of result.dimensions) {
    lines.push(
      `| ${dim.label} | ${dim.score}/10 | ${Math.round(dim.weight * 100)}% | ${dim.rationale} |`,
    );
  }
  lines.push("");

  lines.push("## Dlaczego");
  lines.push("");
  for (const reason of result.reasons) {
    lines.push(`- ${reason}`);
  }
  lines.push("");

  if (input.research.notes) {
    lines.push("## Notatki researchu");
    lines.push("");
    lines.push(input.research.notes);
    lines.push("");
  }

  const incompleteResearch =
    !input.research.website.found &&
    !input.research.googleMaps.found &&
    !input.research.booksy.found &&
    !input.research.instagram.found;

  if (incompleteResearch && result.verdict !== "skip") {
    lines.push("## Do uzupełnienia (research)");
    lines.push("");
    lines.push("Agent / człowiek: uzupełnij `research` w pliku JSON i odpal ponownie.");
    lines.push("");
    for (const q of result.researchQueries) {
      lines.push(`- **${q.label}:** [${q.query}](${q.url})`);
    }
    lines.push("");
  }

  lines.push("## Następne kroki");
  lines.push("");
  if (result.verdict === "pitch") {
    lines.push("- [ ] Dopisz wiersz w `data/outreach-tracker.csv` (`status=research`)");
    lines.push("- [ ] Branch `pitch/<slug>` + `content/client.json`");
    lines.push(`- [ ] Kąt w copy: \`${result.pitchAngle ?? "greenfield"}\``);
  } else if (result.verdict === "maybe") {
    lines.push("- [ ] Doprecyzuj research (www, opinie) lub zapytaj użytkownika");
    lines.push("- [ ] Ewentualnie dopisz w trackerze z `status=research` + notatka");
  } else {
    lines.push("- [ ] Nie rób demo — opcjonalnie wpis w trackerze z werdyktem skip");
  }

  return lines.join("\n");
}

export function formatBriefMarkdown(input: LeadInput): string {
  const lines: string[] = [];
  lines.push(`# Brief researchu: ${input.listing.title}`);
  lines.push("");
  lines.push("Użyj auto-ingest: `npm run lead:ingest -- --url <OLX> --save`");
  lines.push("");
  lines.push("## Z ogłoszenia (wklej do JSON)");
  lines.push("");
  lines.push("```json");
  lines.push(
    JSON.stringify(
      {
        sourceUrl: input.sourceUrl,
        listing: {
          title: input.listing.title || "<tytuł>",
          description: "<opis>",
          phone: "<+48…>",
          city: "<miasto>",
          sellerName: "<nick / firma>",
          photoCount: 0,
          views: 0,
          priceText: "",
          hasHoursInText: false,
          linksInDescription: [],
        },
        research: {
          website: { found: false },
          googleMaps: { found: false },
          booksy: { found: false },
          instagram: { found: false },
          facebook: { found: false },
          redFlags: [],
        },
      },
      null,
      2,
    ),
  );
  lines.push("```");
  lines.push("");
  lines.push("## Zapytania do researchu");
  lines.push("");
  for (const q of buildResearchQueries(input)) {
    lines.push(`- **${q.label}:** [${q.query}](${q.url})`);
  }
  return lines.join("\n");
}

export function formatIngestReport(
  input: LeadInput,
  result: LeadScoreResult,
  assetsDir?: string,
): string {
  const report = formatMarkdownReport(input, result);
  const header = assetsDir
    ? `> Zdjęcia pobrane do \`${assetsDir}\`\n\n`
    : "";
  return header + report;
}
