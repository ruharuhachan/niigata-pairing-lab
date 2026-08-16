import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { asStringArray, readContentFiles } from './lib/content-files.js';

const output = resolve('public/data/source-index.json');
const sources = readContentFiles()
  .filter((file) => file.collection === 'sources' && file.data.claimStatus !== 'draft')
  .map((file) => ({
    id: file.id,
    title: file.data.title,
    publisher: file.data.publisher,
    url: file.data.url,
    accessedAt: file.data.accessedAt,
    sourceType: file.data.sourceType,
    supports: asStringArray(file.data.supports),
  }));

mkdirSync(resolve('public/data'), { recursive: true });
writeFileSync(
  output,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), sources }, null, 2)}\n`,
);
console.log(`Source index generated: ${sources.length} published sources.`);
