import type { CollectionEntry } from 'astro:content';

type PublishableEntry =
  | CollectionEntry<'breweries'>
  | CollectionEntry<'sakes'>
  | CollectionEntry<'tasting-notes'>
  | CollectionEntry<'pairings'>
  | CollectionEntry<'experiments'>
  | CollectionEntry<'stories'>
  | CollectionEntry<'events'>
  | CollectionEntry<'sources'>;

export function isPublished(entry: PublishableEntry): boolean {
  return entry.data.claimStatus !== 'draft';
}

export function formatDate(date?: string): string {
  if (!date) return '未確認';
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Tokyo',
  }).format(new Date(`${date}T00:00:00+09:00`));
}
