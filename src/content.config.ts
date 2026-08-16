import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const claimStatuses = [
  'verified',
  'partner_verified',
  'personal_observation',
  'draft',
] as const;

export const permissionStatuses = ['not_required', 'requested', 'granted', 'denied'] as const;
export const evidenceLevels = ['idea', 'bench_tested', 'event_tested', 'partner_adopted'] as const;

const isoDate = z.union([
  z.iso.date(),
  z.date().transform((date) => date.toISOString().slice(0, 10)),
]);
const optionalUrl = z.union([z.url(), z.literal('')]).optional();

const provenanceShape = {
  title: z.string().min(1),
  claimStatus: z.enum(claimStatuses),
  permissionStatus: z.enum(permissionStatuses),
  createdAt: isoDate,
  updatedAt: isoDate,
  lastVerifiedAt: isoDate.optional(),
  nextReviewAt: isoDate.optional(),
  sourceIds: z.array(z.string()).default([]),
  correctionUrl: optionalUrl,
};

const withProvenance = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ ...provenanceShape, ...shape });

const sources = defineCollection({
  loader: glob({ base: './src/content/sources', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    claimStatus: z.enum(claimStatuses),
    permissionStatus: z.enum(permissionStatuses),
    createdAt: isoDate,
    updatedAt: isoDate,
    publisher: z.string().min(1),
    url: z.url(),
    publishedAt: isoDate.optional(),
    accessedAt: isoDate,
    sourceType: z.enum([
      'official',
      'public_record',
      'partner_statement',
      'interview',
      'observation',
      'secondary',
    ]),
    archivedUrl: optionalUrl,
    supports: z.array(z.string()).default([]),
  }),
});

const breweries = defineCollection({
  loader: glob({ base: './src/content/breweries', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    name: z.string().min(1),
    reading: z.string().min(1),
    municipality: z.string().min(1),
    officialUrl: optionalUrl,
    summary: z.string().min(1),
    partnerVerifiedAt: isoDate.optional(),
    heroImage: z.string().optional(),
    imagePermissionStatus: z.enum(permissionStatuses).optional(),
  }).superRefine((entry, context) => {
    if (entry.claimStatus === 'partner_verified' && !entry.partnerVerifiedAt) {
      context.addIssue({
        code: 'custom',
        path: ['partnerVerifiedAt'],
        message: 'partner_verified には当事者確認日が必要です。',
      });
    }
    if (entry.heroImage && entry.imagePermissionStatus !== 'granted') {
      context.addIssue({
        code: 'custom',
        path: ['imagePermissionStatus'],
        message: '画像公開には granted が必要です。',
      });
    }
  }),
});

const sakes = defineCollection({
  loader: glob({ base: './src/content/sakes', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    breweryId: z.string().min(1),
    brandName: z.string().min(1),
    productName: z.string().min(1),
    category: z.string().min(1),
    officialUrl: optionalUrl,
    alcoholByVolume: z.number().min(0).max(100).optional(),
    availability: z.enum(['year_round', 'seasonal', 'limited', 'discontinued', 'unknown']),
    summary: z.string().min(1),
  }),
});

const tastingNotes = defineCollection({
  loader: glob({ base: './src/content/tasting-notes', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    sakeId: z.string().min(1),
    observer: z.string().min(1),
    tastedAt: isoDate,
    temperatureCelsius: z.number().min(-10).max(100).optional(),
    vessel: z.string().optional(),
    openedForMinutes: z.number().int().min(0).optional(),
    aroma: z.string().min(1),
    palate: z.string().min(1),
    finish: z.string().min(1),
    caveats: z.string().min(1),
  }),
});

const pairings = defineCollection({
  loader: glob({ base: './src/content/pairings', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    sakeId: z.string().min(1),
    food: z.string().min(1),
    hypothesis: z.string().min(1),
    interaction: z.string().min(1),
    serving: z.string().min(1),
    avoidWhen: z.string().optional(),
    evidenceLevel: z.enum(evidenceLevels),
    experimentIds: z.array(z.string()).default([]),
  }),
});

const experiments = defineCollection({
  loader: glob({ base: './src/content/experiments', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    hypothesis: z.string().min(1),
    audience: z.string().min(1),
    placeType: z.string().min(1),
    conductedAt: isoDate,
    conditions: z.array(z.string()).min(1),
    questions: z.array(z.string()).min(1),
    resultSummary: z.string().min(1),
    limitations: z.string().min(1),
    nextStep: z.string().min(1),
  }),
});

const stories = defineCollection({
  loader: glob({ base: './src/content/stories', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    summary: z.string().min(1),
    partnerName: z.string().optional(),
    publishedAt: isoDate,
    kind: z.enum(['interview', 'field_note', 'event_report']),
  }),
});

const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
  schema: withProvenance({
    startsAt: isoDate,
    endsAt: isoDate,
    venue: z.string().min(1),
    officialUrl: optionalUrl,
    eventStatus: z.enum(['scheduled', 'cancelled', 'completed']),
    summary: z.string().min(1),
  }),
});

export const collections = {
  sources,
  breweries,
  sakes,
  'tasting-notes': tastingNotes,
  pairings,
  experiments,
  stories,
  events,
};
