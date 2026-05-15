import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    companySlug: z.string(),
    period: z.string().optional(),
    order: z.number().default(0),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    group: z.enum(["main", "troubleshooting"]).default("main"),
  }),
});

export const collections = { portfolio };
