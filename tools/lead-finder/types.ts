import { z } from "zod";

export const photoFileAnalysisSchema = z.object({
  file: z.string(),
  name: z.string(),
  width: z.number(),
  height: z.number(),
  bytes: z.number(),
  aspectRatio: z.number(),
  longEdge: z.number(),
  isPortrait: z.boolean(),
});

export const photoAnalysisSchema = z.object({
  count: z.number().int().min(0),
  avgWidth: z.number(),
  avgHeight: z.number(),
  avgLongEdge: z.number(),
  minLongEdge: z.number(),
  maxLongEdge: z.number(),
  totalBytes: z.number(),
  portraitCount: z.number().int().min(0),
  qualityScore: z.number().min(0).max(10),
  suitableForHero: z.boolean(),
  suitableForGallery: z.boolean(),
  flags: z.array(z.string()),
  files: z.array(photoFileAnalysisSchema),
  summary: z.string(),
  assetsDir: z.string().optional(),
});

export type PhotoAnalysis = z.infer<typeof photoAnalysisSchema>;

export const verdictSchema = z.enum(["pitch", "maybe", "skip"]);
export type Verdict = z.infer<typeof verdictSchema>;

export const pitchAngleSchema = z.enum(["greenfield", "refresh", "complement"]);
export type PitchAngle = z.infer<typeof pitchAngleSchema>;

export const onlinePresenceSchema = z.enum([
  "brak",
  "tylko_katalogi",
  "social",
  "slaba_www",
  "mocna_www",
]);
export type OnlinePresence = z.infer<typeof onlinePresenceSchema>;

export const websiteQualitySchema = z.enum(["none", "weak", "medium", "strong"]);
export type WebsiteQuality = z.infer<typeof websiteQualitySchema>;

export const listingSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  phone: z.string().optional(),
  email: z.string().optional(),
  city: z.string().optional(),
  sellerName: z.string().optional(),
  photoCount: z.number().int().min(0).default(0),
  photoUrls: z.array(z.string().url()).optional(),
  views: z.number().int().min(0).optional(),
  lastOnline: z.string().optional(),
  isPrivate: z.boolean().optional(),
  category: z.string().optional(),
  priceText: z.string().optional(),
  hasHoursInText: z.boolean().optional(),
  linksInDescription: z.array(z.string()).default([]),
});

export const websiteResearchSchema = z.object({
  found: z.boolean(),
  url: z.string().optional(),
  quality: websiteQualitySchema.optional(),
  isCatalogOnly: z.boolean().optional(),
  notes: z.string().optional(),
});

export const googleMapsResearchSchema = z.object({
  found: z.boolean(),
  url: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  hasWebsite: z.boolean().optional(),
  businessName: z.string().optional(),
});

export const socialResearchSchema = z.object({
  found: z.boolean(),
  url: z.string().optional(),
  active: z.boolean().optional(),
  photoCount: z.number().int().min(0).optional(),
});

export const researchSchema = z.object({
  website: websiteResearchSchema.default({ found: false }),
  googleMaps: googleMapsResearchSchema.default({ found: false }),
  booksy: socialResearchSchema.default({ found: false }),
  instagram: socialResearchSchema.default({ found: false }),
  facebook: socialResearchSchema.default({ found: false }),
  otherProfiles: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  redFlags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export const leadInputSchema = z.object({
  sourceUrl: z.string().url(),
  listing: listingSchema,
  research: researchSchema.default({}),
  photoAnalysis: photoAnalysisSchema.optional(),
  industry: z.string().optional(),
  manualNotes: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type Research = z.infer<typeof researchSchema>;

export const dimensionScoreSchema = z.object({
  id: z.string(),
  label: z.string(),
  score: z.number().min(0).max(10),
  weight: z.number(),
  weighted: z.number(),
  rationale: z.string(),
});

export const leadScoreResultSchema = z.object({
  slug: z.string(),
  sourceUrl: z.string(),
  totalScore: z.number().min(0).max(100),
  verdict: verdictSchema,
  pitchAngle: pitchAngleSchema.optional(),
  onlinePresence: onlinePresenceSchema,
  duplicateInTracker: z.boolean(),
  trackerMatch: z
    .object({
      slug: z.string(),
      firma: z.string(),
      status: z.string(),
    })
    .optional(),
  dimensions: z.array(dimensionScoreSchema),
  reasons: z.array(z.string()),
  researchQueries: z.array(
    z.object({
      label: z.string(),
      query: z.string(),
      url: z.string().url(),
    }),
  ),
  scoredAt: z.string(),
});

export type DimensionScore = z.infer<typeof dimensionScoreSchema>;
export type LeadScoreResult = z.infer<typeof leadScoreResultSchema>;
