import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { PublicArticleSchema } from './generated/okf-schema';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  schema: PublicArticleSchema,
});

export const collections = { articles };
