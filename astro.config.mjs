import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://ovigialocal.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap(), pagefind()],
});
