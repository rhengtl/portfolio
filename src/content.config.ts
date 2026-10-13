/**
 * Project content collection — PORTFOLIO_SPEC §18.2.
 * The schema enforces the content rules: a published flagship must have a cover with
 * alt text and at least one metric, and every project needs a public evidence link.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        tagline: z.string().max(140),
        summary: z.string().max(320),
        tier: z.enum(['flagship', 'featured']),
        order: z.number().int(),
        status: z.enum(['live', 'released', 'thesis', 'prototype']),
        /** e.g. "Solo", "Team of 4", "Thesis · Team of 4" */
        scope: z.string(),
        role: z.string(),
        timeline: z.object({
          start: z.coerce.date(),
          end: z.coerce.date().optional(),
        }),
        stack: z.array(z.string()).min(1).max(5),
        metrics: z
          .array(
            z.object({
              label: z.string(),
              value: z.string(),
              context: z.string().optional(),
            }),
          )
          .default([]),
        links: z
          .object({
            repo: z.url().optional(),
            live: z.url().optional(),
            release: z.url().optional(),
            paper: z.url().optional(),
            video: z.url().optional(),
          })
          .default({}),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        /** Case-study TL;DR (PORTFOLIO_SPEC §9.2 part 2). Required when the entry has a body. */
        tldr: z
          .object({
            problem: z.string(),
            built: z.string(),
            result: z.string(),
          })
          .optional(),
        /** Case-study meta strip: e.g. "Oct 2025 – Sep 2026". Falls back to the year range. */
        period: z.string().optional(),
        /** Short phrase for the case-study <title> ("Title — phrase | Name"); falls back to the tagline. */
        seoTitle: z.string().max(60).optional(),
        draft: z.boolean().default(false),
      })
      .superRefine((p, ctx) => {
        if (!Object.values(p.links).some(Boolean)) {
          ctx.addIssue({ code: 'custom', message: 'needs at least one public evidence link' });
        }
        if (p.tier === 'flagship' && !p.draft) {
          if (!p.cover || !p.coverAlt) {
            ctx.addIssue({ code: 'custom', message: 'a published flagship needs cover + coverAlt' });
          }
          if (p.metrics.length === 0) {
            ctx.addIssue({ code: 'custom', message: 'a published flagship needs at least one metric' });
          }
        }
      }),
});

export const collections = { projects };
