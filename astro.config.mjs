import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// URLs de compatibilidade: páginas noindex que só redirecionam para a edição.
// Ficam fora do sitemap para não anunciar destinos que o buscador vai descartar.
const REDIRECT_ONLY = [/^\/noticias\//, /^\/article\.html\//];

export default defineConfig({
  site: 'https://ovigialocal.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !REDIRECT_ONLY.some((pattern) => pattern.test(new URL(page).pathname)) }),
    pagefind(),
  ],
});
