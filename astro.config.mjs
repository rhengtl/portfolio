// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Canonical origin (PORTFOLIO_SPEC §25.0). If rhengtl.tech lapses, switch this
// to https://rhengtl.vercel.app — it is the only place the origin is defined.
const SITE = 'https://rhengtl.tech';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  // Stylesheets stay external: styles of components used only inside MDX are inlined after
  // Astro computes CSP hashes, so inline copies would be blocked. External CSS is covered by 'self'.
  build: { format: 'file', inlineStylesheets: 'never' },
  // Astro 7 defaults to JSX whitespace rules, which drop spaces between
  // adjacent inline elements. Prose-heavy pages are safer with plain minification.
  compressHTML: true,
  // No fenced code blocks on the site, and Shiki's inline styles conflict with the CSP below.
  markdown: { syntaxHighlight: false },
  integrations: [mdx(), sitemap({ filter: (page) => !page.endsWith('/404') })],
  // Content-Security-Policy as a per-page <meta> (PORTFOLIO_SPEC §R security). Astro hashes every
  // inline script and style it emits. Chart marks are positioned with style="…" attributes, so
  // only style *attributes* may be inline; <style>/<script> elements still need a hash.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
