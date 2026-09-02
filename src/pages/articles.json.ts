import { getCollection } from 'astro:content';
import { sortStories, storyUrl } from '../lib/news';

export async function GET() {
  const stories = sortStories(await getCollection('articles'));
  const payload = stories.map((story) => ({
    ...story.data,
    url: storyUrl(story),
  }));
  return new Response(`${JSON.stringify(payload, null, 2)}\n`, {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
