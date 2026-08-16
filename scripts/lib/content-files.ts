import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import matter from 'gray-matter';

const CONTENT_ROOT = resolve('src/content');
const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);

export interface ContentFile {
  absolutePath: string;
  relativePath: string;
  collection: string;
  id: string;
  data: Record<string, unknown>;
  body: string;
}

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

export function readContentFiles(): ContentFile[] {
  return walk(CONTENT_ROOT)
    .filter((file) => CONTENT_EXTENSIONS.has(extname(file)))
    .map((absolutePath) => {
      const relativePath = relative(CONTENT_ROOT, absolutePath).replaceAll('\\', '/');
      const [collection = 'unknown'] = relativePath.split('/');
      const id = relativePath.replace(`${collection}/`, '').replace(/\.(md|mdx)$/, '');
      const parsed = matter(readFileSync(absolutePath, 'utf8'));
      return {
        absolutePath,
        relativePath,
        collection,
        id,
        data: parsed.data,
        body: parsed.content,
      };
    });
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}
