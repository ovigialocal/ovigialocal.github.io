export function GET({ site }: { site?: URL }) {
  const base = site ?? new URL('https://ovigialocal.github.io');
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', base).toString()}\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
