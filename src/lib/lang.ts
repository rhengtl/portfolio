/**
 * Marks Tagalog words in otherwise-English text with lang="tl", so screen readers pronounce them
 * correctly (WCAG 3.1.2). Returns escaped HTML for use with `set:html`.
 */
const TAGALOG = /\b(sari-sari|utang|listahan|bakit|tindahan)\b/gi;

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function markTagalog(text: string): string {
  return escape(text).replace(TAGALOG, '<span lang="tl">$1</span>');
}
