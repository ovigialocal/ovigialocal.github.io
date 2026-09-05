import { getCollection } from 'astro:content';
import { storyUrl, territoryUrl } from '../lib/news';

const SITE = 'https://ovigialocal.github.io';
const STATIC_PATHS = ['/', '/esportes/', '/editorias.html', '/territorios.html', '/arquivo.html', '/metodologia.html', '/correcoes.html'];

export async function GET() {
  const stories = await getCollection('articles');
  const territories = await getCollection('territories');
  const urls = [...STATIC_PATHS, ...stories.map(storyUrl), ...territories.map(territoryUrl)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${SITE}${escapeXml(path)}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);
}
