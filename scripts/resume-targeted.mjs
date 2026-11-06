// Local-only artifact generation. Does not deploy or contact an AI service.
// npm run build, then node scripts/resume-targeted.mjs
// Editable content/CSS and application copies stay in the ignored resume/ folder.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { plexFontFaces } from './lib/fonts.mjs';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'resume/targeted');
mkdirSync(out, { recursive: true });
const privateFile = resolve(root, 'resume/private.local.json');
const phone = existsSync(privateFile)
  ? JSON.parse(readFileSync(privateFile, 'utf8')).phone
  : undefined;
const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const link = (text, url) => `<a href="${esc(url)}">${esc(text)}</a>`;
const bullets = (items) => `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
function html(c, includePhone) {
  const entry = (title, meta, date, body) =>
    `<article><h3>${title}</h3><p class="meta">${esc(meta)} | ${esc(date)}</p>${body}</article>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(c.name)} | ${esc(c.role)}</title><style>${plexFontFaces(root)}</style><style>${readFileSync(resolve(root, 'resume/targeted.css'), 'utf8')}</style></head><body>
<header><h1>${esc(c.name)}</h1><p class="role">${esc(c.role)}</p>
<p class="contact">${esc(c.location)} | ${link(c.email, `mailto:${c.email}`)}${includePhone && phone ? ` | ${esc(phone)}` : ''}</p>
<p class="contact">${c.links.map((l) => link(l.text, l.href)).join(' | ')}</p></header>
<section><h2>Summary</h2><p>${esc(c.summary)}</p></section>
<section><h2>Selected Projects</h2>${c.projects.map((p) => entry(`${link(p.title, p.url)} - <span>${esc(p.subtitle)}</span>`, p.scope, p.date, bullets(p.bullets))).join('')}</section>
<section><h2>Experience</h2>${c.experience.map((e) => `<article><h3>${esc(e.title)} - <span>${esc(e.org)} | ${esc(e.date)}</span></h3>${bullets(e.bullets)}</article>`).join('')}</section>
<section><h2>Technical Skills</h2>${c.skills.map(([k, v]) => `<p class="skill"><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join('')}</section>
<section><h2>Education</h2><h3>${esc(c.education.title)}</h3><p>${esc(c.education.org)} | ${esc(c.education.date)}</p><p class="meta">${esc(c.education.detail)}</p></section>
<section><h2>Certifications &amp; Training</h2>${c.training.map((t) => `<p class="training">${esc(t)}</p>`).join('')}</section>
</body></html>`;
}
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const page = await browser.newPage();
  for (const source of ['content-ai-backend.json', 'content-applied-ml.json']) {
    const c = JSON.parse(readFileSync(resolve(root, 'resume', source), 'utf8'));
    const variants = [{ dir: out, includePhone: true }];
    if (source === 'content-ai-backend.json')
      variants.push({ dir: resolve(root, 'public'), includePhone: false });
    for (const v of variants) {
      const markup = html(c, v.includePhone);
      await page.setContent(markup, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      if (overflow) throw new Error('Resume HTML has horizontal overflow');
      await page.pdf({
        path: resolve(v.dir, c.file + '.pdf'),
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
      if (v.includePhone) writeFileSync(resolve(v.dir, c.file + '.html'), markup);
      console.log(`Generated ${v.includePhone ? 'application' : 'public'} PDF: ${c.file}`);
    }
  }
  // Preserve the existing download URL, serving the same new phone-free primary copy.
  copyFileSync(
    resolve(root, 'public/Rhenier-Gustilo-Resume-AI-Applications-Backend.pdf'),
    resolve(root, 'public/Rhenier-Gustilo-Resume.pdf'),
  );
} finally {
  await browser.close();
}
