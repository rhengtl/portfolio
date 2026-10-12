# rhengtl.tech

Portfolio of Rhenier Gustilo — Software Engineer (Machine Learning & Backend).

The design, content rules and every decision behind this site are in
[PORTFOLIO_SPEC.md](PORTFOLIO_SPEC.md). Read it before changing anything substantial.

## Stack

Astro 7 (static output) · TypeScript (strict) · MDX · scoped CSS with design tokens ·
IBM Plex Sans/Mono via the Astro Fonts API. No client framework; the only JavaScript is a few
small inline scripts (theme, menu, active section).

## Run

Requires Node 22.12 or newer.

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # type-checks, then builds to dist/
npm run preview   # serves dist/
```

## Common edits

| To change | Edit |
|---|---|
| Name, title, mission, education, links, nav | `src/data/site.ts` |
| Colours, spacing, type scale | `src/styles/tokens.css` |
| Fonts | `fonts` in `astro.config.mjs` |
| Site origin (canonical URLs, sitemap) | `SITE` in `astro.config.mjs` and `public/robots.txt` |

### Add a project

Add `src/content/projects/<slug>.md` (or `.mdx`) with the frontmatter defined in
`src/content.config.ts`. The build fails if a published flagship is missing a cover image,
alt text or a metric, or if any project has no public evidence link.

### Update the résumé

Replace `public/Rhenier-Gustilo-Resume.pdf` and update `lastUpdated` in `src/data/site.ts`.
The Résumé buttons appear only when that file exists, so the site never links to a missing PDF.

## Deploy

Vercel (Hobby), project name `rhengtl`. `vercel.json` sets clean URLs and security headers.
Canonical domain: `rhengtl.tech`; fallback: `rhengtl.vercel.app`. The `.tech` domain expires on
2027-10-12 with auto-renew off — see PORTFOLIO_SPEC §25.0 for the renewal plan.
