import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // Short name used on the career trace
    short: z.string(),
    summary: z.string(),
    context: z.string(),
    // ISO months, e.g. "2026-03". `end` is inclusive.
    start: z.string(),
    end: z.string(),
    period: z.string(),
    stack: z.array(z.string()),
    results: z.array(z.string()),
    order: z.number(),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
