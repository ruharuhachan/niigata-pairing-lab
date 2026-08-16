import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readContentFiles } from './lib/content-files.js';

const textFiles = [
  ...readContentFiles().map((file) => file.absolutePath),
  resolve('README.md'),
  resolve('docs/content-policy.md'),
];
const urlPattern = /https?:\/\/[^\s)\]"'<>]+/g;
const urls = new Set<string>();
const errors: string[] = [];

for (const file of textFiles) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(urlPattern)) {
    const value = match[0].replace(/[.,;:]$/, '');
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol))
        errors.push(`${file}: 不正なURL ${value}`);
      if (!parsed.hostname.endsWith('.invalid')) urls.add(parsed.href);
    } catch {
      errors.push(`${file}: URLを解釈できません ${value}`);
    }
  }
}

if (process.env.LINK_CHECK_EXTERNAL === 'true') {
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'niigata-pairing-lab-link-check/1.0' },
      });
      if ([404, 410].includes(response.status)) errors.push(`${url}: HTTP ${response.status}`);
      else if (!response.ok)
        console.warn(`${url}: HTTP ${response.status}（一時的な拒否として警告）`);
    } catch (error) {
      console.warn(`${url}: 外部確認を完了できませんでした (${String(error)})`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Link validation failed\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Link validation passed: ${urls.size} external URLs parsed.`);
}
