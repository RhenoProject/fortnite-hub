const BASE_URL = 'https://fortnite-api.com';

export type NewsCategory = 'br' | 'stw' | 'creative';

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  image: string;
  date: string;
  category: NewsCategory;
}

export interface GameVersion {
  version: string;
  build: string;
}

function hasJapanese(text: string): boolean {
  return /[　-鿿＀-￯]/.test(text);
}

export async function fetchFortniteNews(): Promise<NewsItem[]> {
  const response = await fetch(`${BASE_URL}/v2/news?language=ja`, { next: { revalidate: 300 } });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const json = await response.json();
  const { br, stw, creative } = json.data ?? {};

  type WithPriority = NewsItem & { _sp: number };

  const brItems: WithPriority[] = (br?.motds ?? [])
    .filter((m: any) => !m.hidden && hasJapanese(m.title || m.body || ''))
    .map((m: any, i: number) => ({
      id: `br-${m.id}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: m.date || br.date,
      category: 'br' as NewsCategory,
      _sp: m.sortingPriority ?? (1000 - i),
    }));

  const stwItems: WithPriority[] = (stw?.messages ?? [])
    .filter((m: any) => hasJapanese(m.title || m.body || ''))
    .map((m: any, i: number) => ({
      id: `stw-${i}`,
      title: m.title,
      body: m.body,
      image: m.image || '',
      date: m.date || (stw?.date ?? ''),
      category: 'stw' as NewsCategory,
      _sp: m.sortingPriority ?? (1000 - i),
    }));

  const creativeRaw = creative?.motds ?? creative?.messages ?? [];
  const creativeItems: WithPriority[] = creativeRaw
    .filter((m: any) => !m.hidden && hasJapanese(m.title || m.body || ''))
    .map((m: any, i: number) => ({
      id: `creative-${m.id ?? i}`,
      title: m.title,
      body: m.body,
      image: m.tileImage || m.image || '',
      date: m.date || (creative?.date ?? ''),
      category: 'creative' as NewsCategory,
      _sp: m.sortingPriority ?? (1000 - i),
    }));

  return [...brItems, ...stwItems, ...creativeItems]
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      // 同日付の場合はsortingPriority昇順（低い値ほど後から追加された新しい記事）
      return a._sp - b._sp;
    })
    .map(({ _sp, ...item }) => item);
}

export interface MapPOI {
  id: string;
  name: string;
  location: { x: number; y: number; z: number };
}

export interface FortniteMap {
  images: { blank: string; pois: string };
  pois: MapPOI[];
}

export async function fetchMap(): Promise<FortniteMap> {
  const response = await fetch(`${BASE_URL}/v1/map?language=ja`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const json = await response.json();
  return json.data as FortniteMap;
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: { value: string; displayValue: string };
  rarity: { value: string; displayValue: string };
  series?: { value: string; colors?: string[] };
  set?: { value: string; text: string };
  introduction?: { chapter: string; season: string; text: string };
  images: { smallIcon?: string; icon?: string; featured?: string };
  variants?: Array<{
    channel: string;
    type: string;
    options: Array<{ tag: string; name: string; image: string }>;
  }>;
  added: string;
}

export async function fetchCosmeticById(id: string): Promise<CosmeticItem | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/v2/cosmetics/br/${id}?language=ja`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as CosmeticItem;
  } catch {
    return null;
  }
}

export async function fetchRecentOutfits(limit = 200): Promise<{ id: string; added: string }[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/v2/cosmetics/br/search/all?language=ja&type=outfit`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as CosmeticItem[])
      .sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
      .slice(0, limit)
      .map(({ id, added }) => ({ id, added }));
  } catch {
    return [];
  }
}

export async function fetchGameVersion(): Promise<GameVersion | null> {
  try {
    const response = await fetch(`${BASE_URL}/v2/aes`, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const json = await response.json();
    const build: string = json.data?.build ?? '';
    // "++Fortnite+Release-41.00-CL-54872343" → "41.00"
    const match = build.match(/Release-(\d+\.\d+)/);
    return match ? { version: match[1], build } : null;
  } catch {
    return null;
  }
}

