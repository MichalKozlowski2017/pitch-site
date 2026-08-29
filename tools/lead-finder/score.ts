import { buildResearchQueries } from "./research-queries";
import { findTrackerDuplicate, slugFromListing } from "./tracker";
import type {
  DimensionScore,
  LeadInput,
  LeadScoreResult,
  OnlinePresence,
  PitchAngle,
  Research,
  Verdict,
} from "./types";

const SKIP_KEYWORDS =
  /\b(model(?:ka|ki|ek)?|kurs(?:y|u)?|szkoleni[ae]|wynajem|szukam pracy|dam prac[eę]|zatrudni[ęe]|wsp[oó]łpraca\s+model|recruitment)\b/i;

const DUPLICATE_SKIP_STATUSES = new Set([
  "wyslane",
  "odpowiedzial",
  "negocjacje",
  "sprzedane",
  "odmowa",
  "cisza",
  "rezygnacja",
]);

function isBlockingDuplicate(
  duplicate: ReturnType<typeof findTrackerDuplicate>,
): boolean {
  if (!duplicate) return false;
  return DUPLICATE_SKIP_STATUSES.has(duplicate.status);
}
const HARD_SKIP_FLAGS = new Set([
  "duplikat_w_trackerze",
  "brak_kontaktu",
  "ogloszenie_szkoleniowe",
  "model_kurs",
]);

type DimensionDef = {
  id: string;
  label: string;
  weight: number;
  score: (input: LeadInput, ctx: ScoreContext) => { score: number; rationale: string };
};

type ScoreContext = {
  duplicate: ReturnType<typeof findTrackerDuplicate>;
  onlinePresence: OnlinePresence;
  skipKeywords: boolean;
};

function clamp(n: number, min = 0, max = 10): number {
  return Math.min(max, Math.max(min, n));
}

function scoreContact(input: LeadInput): { score: number; rationale: string } {
  const { listing } = input;
  let score = 0;
  const parts: string[] = [];

  if (listing.phone) {
    score += 8;
    parts.push("telefon w ogłoszeniu");
  } else {
    parts.push("brak telefonu");
  }
  if (listing.email) {
    score += 1;
    parts.push("e-mail");
  }
  if (listing.hasHoursInText) {
    score += 1;
    parts.push("godziny w opisie");
  }

  return { score: clamp(score), rationale: parts.join(", ") || "brak danych kontaktowych" };
}

function scoreListingContent(input: LeadInput): { score: number; rationale: string } {
  const { listing } = input;
  let score = 0;
  const parts: string[] = [];

  if (listing.photoCount >= 6) {
    score += 4;
    parts.push(`${listing.photoCount} zdjęć`);
  } else if (listing.photoCount >= 3) {
    score += 3;
    parts.push(`${listing.photoCount} zdjęć`);
  } else if (listing.photoCount >= 1) {
    score += 1.5;
    parts.push(`${listing.photoCount} zdjęć (mało)`);
  } else {
    parts.push("brak zdjęć");
  }

  const descLen = listing.description.length;
  if (descLen >= 300) {
    score += 3;
    parts.push("długi opis");
  } else if (descLen >= 100) {
    score += 2;
    parts.push("średni opis");
  } else if (descLen > 0) {
    score += 1;
    parts.push("krótki opis");
  }

  if (listing.priceText || /\d+\s*zł/i.test(listing.description)) {
    score += 2;
    parts.push("cennik / ceny w tekście");
  }

  if (listing.city) {
    score += 1;
    parts.push(`miasto: ${listing.city}`);
  }

  return { score: clamp(score), rationale: parts.join("; ") };
}

function scorePitchFit(input: LeadInput, ctx: ScoreContext): { score: number; rationale: string } {
  const text = `${input.listing.title} ${input.listing.description}`;
  if (ctx.skipKeywords || SKIP_KEYWORDS.test(text)) {
    return { score: 0, rationale: "ogłoszenie szkoleniowe / model / rekrutacja — nie usługa lokalna" };
  }

  const serviceSignals =
    /\b(manicure|pedicure|paznokci|hybryd|stylizacj|fryzjer|hydraul|remont|malow|elektryk|kosmetyk|masaż|beauty|salon|usług)\b/i;
  if (serviceSignals.test(text)) {
    return { score: 9, rationale: "wyraźna usługa lokalna w tytule/opisie" };
  }

  if (input.listing.category) {
    return { score: 7, rationale: `kategoria: ${input.listing.category}` };
  }

  return { score: 4, rationale: "niejasny typ ogłoszenia — sprawdź ręcznie" };
}

function inferOnlinePresence(research: Research): OnlinePresence {
  const www = research.website;
  if (www.found && www.quality === "strong") return "mocna_www";
  if (www.found && (www.quality === "weak" || www.quality === "medium")) return "slaba_www";
  if (www.found && www.isCatalogOnly) return "tylko_katalogi";

  const hasSocial =
    research.instagram.found || research.facebook.found || research.booksy.found;
  if (hasSocial) return "social";

  return "brak";
}

function scoreOnlineGap(_input: LeadInput, ctx: ScoreContext): { score: number; rationale: string } {
  switch (ctx.onlinePresence) {
    case "brak":
      return { score: 10, rationale: "brak własnej strony — mocny kąt greenfield" };
    case "tylko_katalogi":
      return { score: 9, rationale: "tylko katalogi / wizytówki — greenfield" };
    case "social":
      return { score: 7, rationale: "social / Booksy bez domeny — landing pod OLX ma sens" };
    case "slaba_www":
      return { score: 8, rationale: "słaba strona — kąt refresh" };
    case "mocna_www":
      return { score: 2, rationale: "mocna strona — trudno sprzedać stronę od zera" };
  }
}

function scoreDemoReady(input: LeadInput): { score: number; rationale: string } {
  const { listing } = input;
  let score = 0;
  const parts: string[] = [];

  if (listing.photoCount >= 4) {
    score += 4;
    parts.push("wystarczająco zdjęć do galerii");
  } else if (listing.photoCount >= 1) {
    score += 2;
    parts.push("kilka zdjęć — demo możliwe, ale słabsze");
  } else {
    parts.push("mało zdjęć do portfolio");
  }

  if (listing.description.length >= 150) {
    score += 3;
    parts.push("opis pod usługi/USP");
  } else if (listing.description.length >= 50) {
    score += 1.5;
  }

  if (listing.phone && listing.city) {
    score += 2;
    parts.push("telefon + miasto pod CTA");
  }

  if (listing.sellerName || /\b[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+\b/.test(listing.title)) {
    score += 1;
    parts.push("nazwa / marka do brandingu");
  }

  return { score: clamp(score), rationale: parts.join("; ") };
}

function scoreTrustAssets(input: LeadInput): { score: number; rationale: string } {
  const gm = input.research.googleMaps;
  if (!gm.found) {
    return { score: 4, rationale: "brak wizytówki Google — opinie w demo pominiemy" };
  }
  if (gm.reviewCount && gm.reviewCount >= 5) {
    return {
      score: 10,
      rationale: `${gm.reviewCount} opinii Google (${gm.rating ?? "?"}★) — social proof do demo`,
    };
  }
  if (gm.reviewCount && gm.reviewCount >= 1) {
    return {
      score: 7,
      rationale: `${gm.reviewCount} opinii Google — można użyć prawdziwych recenzji`,
    };
  }
  return { score: 5, rationale: "wizytówka Google bez opinii" };
}

function scoreActivity(input: LeadInput): { score: number; rationale: string } {
  const { listing } = input;
  if (listing.views === undefined) {
    return { score: 5, rationale: "brak danych o wyświetleniach — neutralnie" };
  }
  if (listing.views >= 200) {
    return { score: 9, rationale: `${listing.views} wyświetleń — aktywne ogłoszenie` };
  }
  if (listing.views >= 50) {
    return { score: 7, rationale: `${listing.views} wyświetleń` };
  }
  return { score: 4, rationale: `${listing.views} wyświetleń — niska widoczność` };
}

function scoreRedFlags(input: LeadInput, ctx: ScoreContext): { score: number; rationale: string } {
  const flags = [...input.research.redFlags];
  const blockingDup = isBlockingDuplicate(ctx.duplicate);
  if (blockingDup) flags.push("duplikat_w_trackerze");
  if (!input.listing.phone) flags.push("brak_kontaktu");
  if (ctx.skipKeywords) flags.push("ogloszenie_szkoleniowe");

  const hard = flags.filter((f) => HARD_SKIP_FLAGS.has(f) || f.startsWith("duplikat"));
  if (hard.length > 0) {
    return { score: 0, rationale: hard.join(", ") };
  }
  if (ctx.duplicate && !blockingDup) {
    return {
      score: 6,
      rationale: `w trackerze (${ctx.duplicate.status}) — kontynuacja, nie nowy outreach`,
    };
  }
  if (flags.length > 0) {
    return { score: 3, rationale: flags.join(", ") };
  }
  return { score: 10, rationale: "brak czerwonych flag" };
}

function inferPitchAngle(
  onlinePresence: OnlinePresence,
  verdict: Verdict,
): PitchAngle | undefined {
  if (verdict === "skip") return undefined;
  switch (onlinePresence) {
    case "brak":
    case "tylko_katalogi":
      return "greenfield";
    case "slaba_www":
      return "refresh";
    case "social":
      return "complement";
    case "mocna_www":
      return "complement";
  }
}

function buildReasons(
  dimensions: DimensionScore[],
  ctx: ScoreContext,
  verdict: Verdict,
  angle?: PitchAngle,
): string[] {
  const reasons: string[] = [];
  const top = [...dimensions].sort((a, b) => b.weighted - a.weighted).slice(0, 3);
  for (const dim of top) {
    reasons.push(`**${dim.label}** (${dim.score}/10): ${dim.rationale}`);
  }
  if (ctx.duplicate) {
    const note = isBlockingDuplicate(ctx.duplicate)
      ? `Duplikat w trackerze: \`${ctx.duplicate.slug}\` (status: ${ctx.duplicate.status}) — nie pitchuj ponownie`
      : `W trackerze: \`${ctx.duplicate.slug}\` (status: ${ctx.duplicate.status}) — praca w toku`;
    reasons.push(note);
  }
  if (verdict === "pitch" && angle) {
    reasons.push(`Rekomendowany kąt pitcha: \`${angle}\``);
  }
  return reasons;
}

const DIMENSIONS: DimensionDef[] = [
  { id: "contact", label: "Kontakt", weight: 0.15, score: (i) => scoreContact(i) },
  { id: "listing", label: "Treść ogłoszenia", weight: 0.15, score: (i) => scoreListingContent(i) },
  {
    id: "pitchFit",
    label: "Dopasowanie do pitcha",
    weight: 0.15,
    score: (i, ctx) => scorePitchFit(i, ctx),
  },
  {
    id: "onlineGap",
    label: "Luka online (szansa sprzedaży)",
    weight: 0.2,
    score: (i, ctx) => scoreOnlineGap(i, ctx),
  },
  { id: "demoReady", label: "Gotowość demo", weight: 0.15, score: (i) => scoreDemoReady(i) },
  { id: "trust", label: "Social proof", weight: 0.1, score: (i) => scoreTrustAssets(i) },
  { id: "activity", label: "Aktywność ogłoszenia", weight: 0.05, score: (i) => scoreActivity(i) },
  {
    id: "redFlags",
    label: "Czerwone flagi",
    weight: 0.05,
    score: (i, ctx) => scoreRedFlags(i, ctx),
  },
];

export function scoreLead(input: LeadInput): LeadScoreResult {
  const duplicate = findTrackerDuplicate({
    phone: input.listing.phone,
    firma: input.listing.sellerName ?? input.listing.title,
    sourceUrl: input.sourceUrl,
  });

  const skipKeywords = SKIP_KEYWORDS.test(`${input.listing.title} ${input.listing.description}`);
  const onlinePresence = inferOnlinePresence(input.research);

  const ctx: ScoreContext = { duplicate, onlinePresence, skipKeywords };

  const dimensions: DimensionScore[] = DIMENSIONS.map((def) => {
    const { score, rationale } = def.score(input, ctx);
    return {
      id: def.id,
      label: def.label,
      score,
      weight: def.weight,
      weighted: Math.round(score * def.weight * 10),
      rationale,
    };
  });

  let totalScore = dimensions.reduce((sum, d) => sum + d.weighted, 0);

  let verdict: Verdict = "skip";
  if (isBlockingDuplicate(duplicate)) {
    verdict = "skip";
    totalScore = Math.min(totalScore, 30);
  } else if (skipKeywords || dimensions.find((d) => d.id === "pitchFit")?.score === 0) {
    verdict = "skip";
  } else if (onlinePresence === "mocna_www" && totalScore < 80) {
    verdict = "skip";
    totalScore = Math.min(totalScore, 40);
  } else if (!input.listing.phone && totalScore < 60) {
    verdict = "maybe";
  } else if (totalScore >= 70) {
    verdict = "pitch";
  } else if (totalScore >= 45) {
    verdict = "maybe";
  }

  const pitchAngle = inferPitchAngle(onlinePresence, verdict);
  const reasons = buildReasons(dimensions, ctx, verdict, pitchAngle);

  return {
    slug: slugFromListing(input.listing.title, input.listing.city),
    sourceUrl: input.sourceUrl,
    totalScore,
    verdict,
    pitchAngle,
    onlinePresence,
    duplicateInTracker: Boolean(duplicate),
    trackerMatch: duplicate
      ? { slug: duplicate.slug, firma: duplicate.firma, status: duplicate.status }
      : undefined,
    dimensions,
    reasons,
    researchQueries: buildResearchQueries(input),
    scoredAt: new Date().toISOString(),
  };
}
