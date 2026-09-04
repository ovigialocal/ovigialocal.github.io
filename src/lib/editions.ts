export const EDITIONS = [
  { slug: 'porto-velho', name: 'Porto Velho', state: 'Rondônia', latitude: -8.7608, longitude: -63.8999 },
] as const;

export type Edition = (typeof EDITIONS)[number];
