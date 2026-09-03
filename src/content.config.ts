import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { PublicArticleSchema, PublicSourceSchema, PublicTerritorySchema } from './generated/okf-schema';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  schema: PublicArticleSchema,
});

const sources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/sources' }),
  schema: PublicSourceSchema,
});

const territories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/territories' }),
  schema: PublicTerritorySchema,
});

export const collections = { articles, sources, territories };
