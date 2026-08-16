import { appendFileSync } from 'node:fs';
import { readContentFiles } from './lib/content-files.js';

const today = new Date().toISOString().slice(0, 10);
const stale = readContentFiles().filter(
  (file) =>
    file.data.claimStatus !== 'draft' &&
    typeof file.data.nextReviewAt === 'string' &&
    file.data.nextReviewAt < today,
);

const summary = stale.length
  ? `## 期限切れコンテンツ\n\n${stale.map((file) => `- \`${file.relativePath}\`（次回確認: ${file.data.nextReviewAt}）`).join('\n')}\n`
  : '## コンテンツ鮮度\n\n期限切れの公開コンテンツはありません。\n';

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);
if (stale.length > 0) process.exitCode = 1;
