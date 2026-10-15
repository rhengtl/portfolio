// Validates the résumé PDFs.
// Needs Poppler (pdfinfo, pdffonts, pdftotext, pdftohtml) on PATH. Run after scripts/resume.mjs:
//   node scripts/resume-check.mjs            → application copies in resume/out/
//   node scripts/resume-check.mjs --public   → also the public web copy (must have no phone)
//   node scripts/resume-check.mjs --links    → also fetch every hyperlink
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const content = JSON.parse(readFileSync(resolve(root, 'resume/content.json'), 'utf8'));
const privatePath = resolve(root, 'resume/private.local.json');
const priv = existsSync(privatePath) ? JSON.parse(readFileSync(privatePath, 'utf8')) : {};
const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8' });
const PHONE = /(\+?63[\s-]?|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/;

let failures = 0;
const check = (ok, label) => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}`);
  if (!ok) failures++;
};

async function validate(file, variant, { expectPhone, expectPhoto }) {
  console.log(`\n${file.replace(root, '.').replaceAll('\\', '/')} (variant ${variant})`);
  const info = run('pdfinfo', [file]);
  check(/^Pages:\s+1$/m.test(info), 'exactly 1 page');
  check(/Page size:\s+612 x 792 pts/.test(info), 'US Letter (612 × 792 pt)');

  const fonts = run('pdffonts', [file]).split('\n').slice(2).filter(Boolean);
  check(fonts.length > 0 && fonts.every((l) => /\s+yes\s+yes\s+yes\s+/.test(l)), `all ${fonts.length} fonts embedded, subset, with ToUnicode`);

  const images = run('pdfimages', ['-list', file]).split('\n').slice(2).filter(Boolean).length;
  check(expectPhoto ? images === 1 : images === 0, expectPhoto ? 'headshot embedded (1 image)' : 'no photo');

  const text = run('pdftotext', ['-enc', 'UTF-8', file, '-']);
  const flat = text.replace(/\s+/g, ' ');
  check(!text.includes('�'), 'no replacement characters in extracted text');
  check(!/\[confirm:/.test(text), 'no unconfirmed placeholders');

  // Reading order: header → sections → projects in this variant's order → key numbers.
  const projects = content.projects
    .filter((p) => p.order[variant])
    .sort((a, b) => a.order[variant] - b.order[variant])
    .map((p) => p.title);
  const sequence = [
    content.header.name, content.header.email, 'rhengtl.tech',
    'SUMMARY', 'EDUCATION', 'PROJECTS', ...projects, 'EXPERIENCE', 'SKILLS', 'CERTIFICATIONS',
  ];
  let at = -1;
  const missing = sequence.filter((s) => {
    const i = flat.indexOf(s, at + 1);
    if (i < 0) return true;
    at = i;
    return false;
  });
  check(missing.length === 0, `text extracts in reading order${missing.length ? ` (missing/out of order: ${missing.join(', ')})` : ''}`);
  for (const metric of ['1,015', '456', '3.8 s', '4.2 s', '96.25%', '2,465']) {
    check(flat.includes(metric), `metric "${metric}" extracts intact`);
  }

  const hasPhone = PHONE.test(flat) || (priv.phone && flat.includes(priv.phone));
  check(expectPhone ? Boolean(hasPhone) : !hasPhone, expectPhone ? 'phone number present (application copy)' : 'no phone number (public copy)');

  // Links: every annotation the PDF carries must be one we put there.
  const xml = run('pdftohtml', ['-xml', '-stdout', '-i', '-q', file]);
  const links = [...new Set([...xml.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))];
  const expected = new Set([
    `mailto:${content.header.email}`,
    ...content.header.links.map((l) => l.href),
    ...content.projects.filter((p) => p.order[variant]).map((p) => p.link.href),
    ...(content.alsoBuilt && (!content.alsoBuilt.variants || content.alsoBuilt.variants.includes(variant))
      ? content.alsoBuilt.links.map((l) => l.href) : []),
  ]);
  const unexpected = links.filter((l) => !expected.has(l));
  const absent = [...expected].filter((l) => !links.includes(l));
  check(!unexpected.length && !absent.length, `links match (${links.length})${unexpected.length ? ` unexpected: ${unexpected}` : ''}${absent.length ? ` missing: ${absent}` : ''}`);

  if (process.argv.includes('--links')) {
    for (const href of links.filter((l) => l.startsWith('http'))) {
      const res = await fetch(href, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 resume-link-check' } }).catch(() => null);
      const status = res?.status ?? 0;
      // LinkedIn answers automated requests with 999; the URL is the owner's own profile.
      check(status === 200 || (status === 999 && href.includes('linkedin.com')), `${status} ${href}`);
    }
  }
}

for (const [variant, { file }] of Object.entries(content.variants)) {
  for (const [suffix, expectPhoto] of [['', true], ['-NoPhoto', false]]) {
    await validate(resolve(root, 'resume/out', `${file}${suffix}.pdf`), variant, { expectPhone: Boolean(priv.phone), expectPhoto });
  }
}
if (process.argv.includes('--public')) {
  await validate(resolve(root, 'public/Rhenier-Gustilo-Resume.pdf'), 'A', { expectPhone: false, expectPhoto: true });
}
console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
