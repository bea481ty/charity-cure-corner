// @vitest-environment node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
it('provides standalone Android and desktop installation metadata and real icons', () => {
  const manifest = JSON.parse(readFileSync(resolve('public/manifest.webmanifest'), 'utf8'));
  expect(manifest.name).toBe("Charity's Cure Corner");
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain('192x192');
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toContain('512x512');
  for (const icon of manifest.icons) expect(existsSync(resolve('public', icon.src.slice(1)))).toBe(true);
});