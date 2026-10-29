// Every literal t('…') key used in the apps must exist in both catalogs, so a missing string can't
// ship as a raw key on screen.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { resources } from './index.ts';

const root = fileURLToPath(new URL('../../../apps', import.meta.url));
const SKIP = new Set(['node_modules', '.next', '.expo', 'dist']);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (SKIP.has(name)) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|mts)$/.test(name) ? [path] : [];
  });
}

const has = (obj: object, key: string) =>
  key
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      obj,
    ) !== undefined;

const used = new Map<string, string>();
for (const file of sourceFiles(root)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/\bt\(\s*'([a-zA-Z][\w-]*(?:\.[\w-]+)+)'/g)) {
    if (m[1]) used.set(m[1], file.slice(root.length));
  }
}

describe('translation keys used in the apps', () => {
  it('finds keys to check', () => {
    expect(used.size).toBeGreaterThan(50);
  });
  it.each([...used])('%s exists in en and ne (%s)', (key) => {
    expect(has(resources.en, key), `en: ${key}`).toBe(true);
    expect(has(resources.ne, key), `ne: ${key}`).toBe(true);
  });
});
