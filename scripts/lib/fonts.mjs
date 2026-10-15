// Shared by scripts/og.mjs and scripts/resume.mjs: the site's self-hosted IBM Plex faces as
// inline @font-face rules. Font files are content-hashed by Astro, so they're found through the
// built home page; run `npm run build` first. Inlined because a page made with setContent()
// may not read local files.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function plexFontFaces(root) {
  const home = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
  const faces = [
    ...home.matchAll(
      /font-family:"(IBM Plex (?:Sans|Mono))-[^"]*";src:url\("([^"]+)"\)[^}]*?font-weight:(\d+)/g,
    ),
  ]
    .map(([, family, url, weight]) => {
      const data = readFileSync(resolve(root, 'dist', url.replace(/^\//, ''))).toString('base64');
      return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${data}) format("woff2");font-weight:${weight}}`;
    })
    .join('\n');
  if (!faces) throw new Error('No fonts found in dist/index.html — run `npm run build` first.');
  return faces;
}
