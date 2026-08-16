import { asStringArray, readContentFiles } from './lib/content-files.js';

const files = readContentFiles();
const errors: string[] = [];
const ids = new Map<string, Set<string>>();

for (const file of files) {
  const collectionIds = ids.get(file.collection) ?? new Set<string>();
  if (collectionIds.has(file.id)) errors.push(`${file.relativePath}: IDが重複しています。`);
  collectionIds.add(file.id);
  ids.set(file.collection, collectionIds);
}

const sourceIds = ids.get('sources') ?? new Set<string>();

for (const file of files) {
  const { data } = file;
  const prefix = `${file.relativePath}:`;
  const status = data.claimStatus;
  const references = asStringArray(data.sourceIds);

  if (
    file.collection !== 'sources' &&
    ['verified', 'partner_verified'].includes(String(status)) &&
    references.length === 0
  ) {
    errors.push(`${prefix} 確認済み情報には出典が必要です。`);
  }
  for (const sourceId of references) {
    if (!sourceIds.has(sourceId)) errors.push(`${prefix} 出典 ${sourceId} が存在しません。`);
  }
  if (status === 'partner_verified' && !data.partnerVerifiedAt) {
    errors.push(`${prefix} partner_verified には partnerVerifiedAt が必要です。`);
  }
  if (data.heroImage && data.imagePermissionStatus !== 'granted') {
    errors.push(`${prefix} 画像公開には imagePermissionStatus: granted が必要です。`);
  }
  if (
    typeof data.createdAt === 'string' &&
    typeof data.updatedAt === 'string' &&
    data.updatedAt < data.createdAt
  ) {
    errors.push(`${prefix} updatedAt が createdAt より前です。`);
  }
  if (
    typeof data.lastVerifiedAt === 'string' &&
    data.lastVerifiedAt > new Date().toISOString().slice(0, 10)
  ) {
    errors.push(`${prefix} lastVerifiedAt が未来日です。`);
  }
}

const relationshipRules = [
  ['sakes', 'breweryId', 'breweries'],
  ['tasting-notes', 'sakeId', 'sakes'],
  ['pairings', 'sakeId', 'sakes'],
] as const;

for (const [collection, field, target] of relationshipRules) {
  for (const file of files.filter((item) => item.collection === collection)) {
    const value = file.data[field];
    if (typeof value === 'string' && !(ids.get(target) ?? new Set()).has(value)) {
      errors.push(`${file.relativePath}: ${field}=${value} に対応する ${target} がありません。`);
    }
  }
}

for (const file of files.filter((item) => item.collection === 'pairings')) {
  for (const experimentId of asStringArray(file.data.experimentIds)) {
    if (!(ids.get('experiments') ?? new Set()).has(experimentId)) {
      errors.push(`${file.relativePath}: experiment ${experimentId} が存在しません。`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Content validation passed: ${files.length} files checked.`);
}
