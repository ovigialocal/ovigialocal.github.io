import type { CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'articles'>;
export type Territory = CollectionEntry<'territories'>;

const TIME_ZONE = 'America/Porto_Velho';

export function storyUrl(story: Story): string {
  return `/porto-velho/noticias/${encodeURIComponent(story.data.story_id)}/`;
}

export function territoryUrl(territory: Territory): string {
  return `/territorios/${encodeURIComponent(territory.data.territory_id)}/`;
}

export function sortStories(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => Date.parse(b.data.published_at) - Date.parse(a.data.published_at));
}

export function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function format(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: TIME_ZONE, ...options }).format(new Date(value));
}

export const formatDateTime = (value: string) => format(value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
export const formatDayTime = (value: string) => format(value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
export const formatDayMonth = (value: string) => format(value, { day: '2-digit', month: '2-digit' });
export const formatTime = (value: string) => format(value, { hour: '2-digit', minute: '2-digit', hour12: false });

export function groupBy(stories: Story[], key: 'category'): Map<string, Story[]> {
  const groups = new Map<string, Story[]>();
  for (const story of stories) {
    const value = story.data[key];
    const items = groups.get(value) ?? [];
    items.push(story);
    groups.set(value, items);
  }
  return groups;
}

export function futureTemporal(stories: Story[]): Story[] {
  const now = Date.now();
  return stories.filter((story) => story.data.next_event_at && Date.parse(story.data.next_event_at) >= now).sort((a, b) => Date.parse(a.data.next_event_at ?? '') - Date.parse(b.data.next_event_at ?? ''));
}

export function storyTerritoryName(story: Story): string {
  return story.data.bairro ?? story.data.locality;
}

export const territory = storyTerritoryName;

export function resolveStoryTerritory(story: Story, territories: Territory[]): Territory {
  const name = storyTerritoryName(story);
  const resolved = territories.find((item) => item.data.name === name);
  if (!resolved) throw new Error(`OKF relation unresolved at presentation boundary: ${story.data.story_id} -> ${name}`);
  return resolved;
}

export function storiesForTerritory(stories: Story[], territory: Territory): Story[] {
  return sortStories(stories.filter((story) => story.data.locality === territory.data.name || story.data.bairro === territory.data.name));
}
