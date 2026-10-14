// Generates the 1200×630 Open Graph images in public/og/ (PORTFOLIO_SPEC §22).
// Run after `npm run build` (it reads the self-hosted font files from dist/):
//   node scripts/og.mjs
// Re-run whenever a title, tagline, headline metric or cover image changes.
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'public/og');
mkdirSync(out, { recursive: true });

// Font files are content-hashed by Astro; find them through the built home page.
const home = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const fontFaces = [
  ...home.matchAll(
    /font-family:"(IBM Plex (?:Sans|Mono))-[^"]*";src:url\("([^"]+)"\)[^}]*?font-weight:(\d+)/g,
  ),
]
  .map(([, family, url, weight]) => {
    // Inlined: a page made with setContent() may not read local files.
    const data = readFileSync(resolve(root, 'dist', url.replace(/^\//, ''))).toString('base64');
    return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${data}) format("woff2");font-weight:${weight}}`;
  })
  .join('\n');
if (!fontFaces) throw new Error('No fonts found in dist/index.html — run `npm run build` first.');

// Optional crop ({ left, top, width, height } in source pixels) keeps small UI legible at card size.
const asset = async (p, crop) => {
  let img = sharp(resolve(root, p));
  if (crop) img = img.extract(crop);
  const data = await img.resize({ width: 1000, withoutEnlargement: true }).png().toBuffer();
  return `data:image/png;base64,${data.toString('base64')}`;
};

const cards = [
  {
    file: 'default.png',
    label: 'Software Engineer · ML & Backend',
    title: 'Rhenier Gustilo',
    lead: 'I build complete software, from ML models and LLM features to the backends, APIs and apps around them.',
    metric: 'Python · PyTorch · LLM APIs · FastAPI · TypeScript · PostgreSQL',
    image: 'src/assets/headshot.jpg',
    portrait: true,
  },
  {
    file: 'earprompt.png',
    label: 'Thesis prototype · Team of 4 · 2025–⁠26',
    title: 'EarPrompt',
    lead: 'A wearable that listens to a conversation and whispers one short tip on how to respond.',
    metric: '3.8 s average end-to-end latency',
    image: 'src/assets/projects/earprompt/cover.jpg',
  },
  {
    file: 'contex.png',
    label: 'Live · Team of 4 · 2025–⁠26',
    title: 'ConTeX',
    lead: 'Photograph handwriting or drop in a PDF and get LaTeX back, compiled in your browser.',
    metric: '1,197 automated checks',
    image: 'src/assets/projects/contex/cover.png',
    crop: { left: 220, top: 150, width: 1480, height: 925 },
  },
  {
    file: 'tindabot.png',
    label: 'Live · Solo · 2026',
    title: 'TindaBot',
    lead: 'Tells sari-sari store owners what to buy, how many, and how much money to bring.',
    metric: '456 tests · 8× faster recompute',
    image: 'src/assets/projects/tindabot/cover.png',
    crop: { left: 418, top: 54, width: 1084, height: 678 },
  },
];

const html = (c, img) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#fafaf7;color:#17181a;font-family:"IBM Plex Sans";
  display:grid;grid-template-columns:1fr ${c.portrait ? '360px' : '470px'};gap:56px;align-items:center;
  padding:64px 72px;border-top:10px solid #c2410c;position:relative}
.label{font-family:"IBM Plex Mono";font-weight:500;font-size:20px;white-space:nowrap;letter-spacing:.06em;text-transform:uppercase;color:#c2410c}
h1{font-size:${c.title.length > 12 ? 64 : 76}px;line-height:1.05;font-weight:600;letter-spacing:-.02em;margin:22px 0 20px}
p{font-size:29px;line-height:1.4;color:#4a4f57}
.metric{margin-top:30px;font-family:"IBM Plex Mono";font-size:22px;font-weight:500;color:#17181a;
  padding-top:22px;border-top:2px solid #e4e4de}
.media{border:2px solid #e4e4de;border-radius:14px;overflow:hidden;background:#fff;
  aspect-ratio:${c.portrait ? '1 / 1' : '16 / 10'}}
.media img{width:100%;height:100%;object-fit:cover;display:block}
.foot{position:absolute;left:72px;bottom:36px;font-family:"IBM Plex Mono";font-size:19px;color:#5b6068;letter-spacing:.04em}
</style></head><body>
<div><div class="label">${c.label}</div><h1>${c.title}</h1><p>${c.lead}</p><div class="metric">${c.metric}</div></div>
<div class="media"><img src="${img}" alt=""></div>
<div class="foot">${c.file === 'default.png' ? 'rhengtl.tech' : 'Rhenier Gustilo · rhengtl.tech'}</div>
</body></html>`;

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const c of cards) {
  await page.setContent(html(c, await asset(c.image, c.crop)), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(out, c.file) });
  console.log('wrote public/og/' + c.file);
}
await browser.close();
