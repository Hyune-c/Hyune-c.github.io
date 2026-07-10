import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const schema = z.object({
  title: z.string(),
  company: z.string(),
  companySlug: z.string(),
  period: z.string().optional(),
  order: z.number().default(0),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  group: z.enum(["main", "troubleshooting"]).default("main"),
});

const portfolio = defineCollection({
  loader: glob({
    // Use one positive pattern: Astro's watch-mode matcher ignores negated array entries.
    pattern: "**/!(*.en).md",
    base: "./src/content/portfolio",
  }),
  schema,
});

const portfolioEn = defineCollection({
  loader: glob({
    pattern: ["**/*.en.md"],
    base: "./src/content/portfolio",
    // 기본 generateId 는 `.en` 의 점을 제거해 slug 가 망가지므로 직접 생성
    generateId: ({ entry }) => entry.replace(/\.en\.md$/, ""),
  }),
  schema,
});

export const collections = { portfolio, portfolioEn };
