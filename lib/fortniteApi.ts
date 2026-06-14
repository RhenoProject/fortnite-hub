const BASE_URL = 'https://fortnite-api.com';

export type NewsCategory = 'br' | 'stw' | 'creative';

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  image: string;
  date: string;
  category: NewsCategory;
  isJaLocalized: boolean;
}

export interface UpdateItem {
  id: string;
  title: string;
  body: string;
  image: string;
  date: string;
}

export interface CompetitivePlaylist {
  id: string;
  name: string;
  maxPlayers: number;
  isTournament: boolean;
}

function hasJapanese(text: string): boolean {
  return /[　-鿿＀-￯]/.test(text);
}

export async function fetchFortniteNews(): Promise<NewsItem[]> {
  const response = await fetch(`${BASE_URL}/v2/news?language=ja`, { next: { revalidate: 300 } });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const json = await response.json();
  const { br, stw, creative } = json.data ?? {};

  const brItems: NewsItem[] = (br?.motds ?? [])
    .filter((m: any) => !m.hidden)
    .map((m: any) => ({
      id: `br-${m.id}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: br.date,
      category: 'br' as NewsCategory,
      isJaLocalized: hasJapanese(m.title || '') || hasJapanese(m.body || ''),
    }));

  const stwItems: NewsItem[] = (stw?.messages ?? []).map((m: any, i: number) => ({
    id: `stw-${i}`,
    title: m.title,
    body: m.body,
    image: m.image || '',
    date: stw?.date ?? '',
    category: 'stw' as NewsCategory,
    isJaLocalized: hasJapanese(m.title || '') || hasJapanese(m.body || ''),
  }));

  const creativeRaw = creative?.motds ?? creative?.messages ?? [];
  const creativeItems: NewsItem[] = creativeRaw
    .filter((m: any) => !m.hidden)
    .map((m: any, i: number) => ({
      id: `creative-${m.id ?? i}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: creative?.date ?? '',
      category: 'creative' as NewsCategory,
      isJaLocalized: hasJapanese(m.title || '') || hasJapanese(m.body || ''),
    }));

  return [...brItems, ...stwItems, ...creativeItems];
}

export async function fetchUpdates(): Promise<UpdateItem[]> {
  const response = await fetch(`${BASE_URL}/v2/news?language=ja`, { next: { revalidate: 600 } });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const json = await response.json();
  const br = json.data?.br;
  return (br?.motds ?? [])
    .filter((m: any) => !m.hidden)
    .map((m: any) => ({
      id: `update-${m.id}`,
      title: m.title ?? '',
      body: m.body ?? '',
      image: m.tileImage || m.image || '',
      date: br?.date ?? '',
    }));
}

export async function fetchCompetitivePlaylists(): Promise<CompetitivePlaylist[]> {
  const response = await fetch(`${BASE_URL}/v1/playlists`, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const json = await response.json();
  const all: any[] = json.data ?? [];
  const keywords = ['ranked', 'arena', 'cup', 'fncs', 'competitive', 'champion', 'tournament', 'cash', 'solo', 'duo', 'trio', 'squad'];
  return all
    .filter((p: any) => {
      const name = (p.name ?? '').toLowerCase();
      return keywords.some(k => name.includes(k));
    })
    .slice(0, 12)
    .map((p: any) => ({
      id: p.id ?? '',
      name: p.name ?? '',
      maxPlayers: p.maxPlayers ?? 0,
      isTournament: /(cup|fncs|champion|cash|tournament)/i.test(p.name ?? ''),
    }));
}
