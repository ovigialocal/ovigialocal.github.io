import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortStories, storyUrl } from '../lib/news';

export async function GET(context: { site?: URL }) {
  const stories = sortStories(await getCollection('articles'));
  return rss({
    title: 'O Vigia',
    description: 'Jornalismo local em Porto Velho, com fontes verificáveis.',
    site: context.site ?? new URL('https://ovigialocal.github.io'),
    items: stories.map((story) => ({
      title: story.data.title,
      description: story.data.description,
      pubDate: new Date(story.data.published_at),
      link: storyUrl(story),
      customData: `<source>${escapeXml(story.data.source_name)}</source>`,
    })),
  });
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char);
}
