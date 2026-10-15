// Builds the résumé PDFs from resume/content.json.
// Run after `npm run build` (the PDF embeds the site's self-hosted IBM Plex fonts):
//   node scripts/resume.mjs            → application copies in resume/out/ (with phone), each
//                                        variant with and without the photo (-NoPhoto)
//   node scripts/resume.mjs --publish  → also writes the public web copy of variant A, without a
//                                        phone, to public/Rhenier-Gustilo-Resume.pdf
// Publishing refuses while any text still contains "[confirm: …]".
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { plexFontFaces } from './lib/fonts.mjs';

const root = resolve(import.meta.dirname, '..');
const content = JSON.parse(readFileSync(resolve(root, 'resume/content.json'), 'utf8'));
const privatePath = resolve(root, 'resume/private.local.json');
const priv = existsSync(privatePath) ? JSON.parse(readFileSync(privatePath, 'utf8')) : {};
const publish = process.argv.includes('--publish');
const outDir = resolve(root, 'resume/out');
mkdirSync(outDir, { recursive: true });

// Headshot for the top-right of the header: ~1 in square, so 300 px keeps it sharp in print.
const photoUri = content.header.photo
  ? `data:image/jpeg;base64,${(await sharp(resolve(root, content.header.photo)).resize(300, 300).jpeg({ quality: 85, mozjpeg: true }).toBuffer()).toString('base64')}`
  : null;

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Escapes text, then highlights unconfirmed placeholders so drafts make them obvious.
const text = (s) => esc(s).replace(/\[confirm:[^\]]*\]/g, (m) => `<mark class="confirm">${m}</mark>`);
const link = (l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`;
const sep = '<span class="sep">·</span>';
const inVariant = (item, v) => !item.variants || item.variants.includes(v);

function html(variant, { phone, photo }) {
  const h = content.header;
  const contact = [text(priv.location ?? h.location), link({ text: h.email, href: `mailto:${h.email}` })];
  if (phone) contact.push(esc(phone));

  const projects = content.projects
    .filter((p) => p.order[variant])
    .sort((a, b) => a.order[variant] - b.order[variant])
    .map(
      (p) => `
      <div class="entry">
        <div class="entry-head">
          <p class="entry-title">${link({ text: p.title, href: p.link.href })} <span class="purpose">— ${text(p.purpose)}</span><span class="scope">${sep}${text(p.scope)}</span></p>
          <p class="entry-date">${text(p.date)}</p>
        </div>
        <ul>${p.bullets.filter((b) => inVariant(b, variant)).map((b) => `<li>${text(b.text)}</li>`).join('')}</ul>
      </div>`,
    )
    .join('');

  const also = content.alsoBuilt && inVariant(content.alsoBuilt, variant)
    ? `<p class="plain">${content.alsoBuilt.links.reduce(
        (acc, l) => acc.replace(esc(l.text), link(l)),
        text(content.alsoBuilt.text),
      )}</p>`
    : '';

  const experience = content.experience
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-head">
          <p class="entry-title">${text(e.title)} <span class="purpose">— ${text(e.org)}</span></p>
          <p class="entry-date">${text(e.date)}</p>
        </div>
        <ul>${e.bullets.map((b) => `<li>${text(b.text)}</li>`).join('')}</ul>
      </div>`,
    )
    .join('');

  const education = content.education
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-head">
          <p class="entry-title">${text(e.title)} <span class="purpose">— ${text(e.org)}</span></p>
          <p class="entry-date">${text(e.date)}</p>
        </div>
        ${e.details.map((d) => `<p class="entry-meta">${text(d.text)}</p>`).join('')}
      </div>`,
    )
    .join('');

  const skills = content.skills.order[variant]
    .map((k) => content.skills.groups[k])
    .map((g) => `<p><span class="label">${esc(g.label)}:</span> ${text(g.items)}</p>`)
    .join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(h.name)} — Résumé</title>
<style>${plexFontFaces(root)}</style>
<style>${readFileSync(resolve(root, 'resume/resume.css'), 'utf8')}</style>
</head><body>
<header class="header">
  <div>
    <h1 class="name">${esc(h.name)}</h1>
    <p class="role">${esc(h.role)}</p>
    <p class="contact">${contact.join(sep)}</p>
    <p class="contact">${h.links.map(link).join(sep)}</p>
  </div>
  ${photo && photoUri ? `<img class="photo" src="${photoUri}" alt="Photo of ${esc(h.name)}">` : ''}
</header>
<section><h2>Summary</h2><p class="summary">${text(content.summary[variant])}</p></section>
<section><h2>Education</h2>${education}</section>
<section><h2>Projects</h2>${projects}${also}</section>
<section><h2>Experience</h2>${experience}</section>
<section class="skills"><h2>Skills</h2>${skills}</section>
<section><h2>Certifications</h2><p class="certs">${text(content.certifications.text)}</p></section>
</body></html>`;
}

const { $comment, ...rendered } = content;
const unconfirmed = JSON.stringify(rendered).match(/\[confirm:[^\]]*\]/g) ?? [];
if (publish && unconfirmed.length) {
  console.error(`Refusing to publish: ${unconfirmed.length} unconfirmed item(s):\n  ${[...new Set(unconfirmed)].join('\n  ')}`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
async function render(variant, file, opts) {
  await page.setContent(html(variant, opts), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true, tagged: true });
  writeFileSync(file, pdf);
  // HTML copies are for inspection only and stay in the gitignored output folder, never public/.
  if (file.startsWith(outDir)) writeFileSync(file.replace(/\.pdf$/, '.html'), html(variant, opts));
  console.log('wrote', file.replace(root, '.').replaceAll('\\', '/'));
}

for (const [variant, { file }] of Object.entries(content.variants)) {
  await render(variant, resolve(outDir, `${file}.pdf`), { phone: priv.phone, photo: true });
  // Photo-free copies for remote and international employers, where photos are not expected.
  await render(variant, resolve(outDir, `${file}-NoPhoto.pdf`), { phone: priv.phone, photo: false });
}
if (publish) {
  await render('A', resolve(root, 'public/Rhenier-Gustilo-Resume.pdf'), { phone: undefined, photo: true });
}
await browser.close();
if (unconfirmed.length) console.log(`Draft: ${new Set(unconfirmed).size} unconfirmed item(s) highlighted.`);
