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
  subName: string;
  mode: string;
  maxTeamSize: number;
  maxPlayers: number;
  isTournament: boolean;
}

export interface GameVersion {
  version: string;
  build: string;
}

function hasJapanese(text: string): boolean {
  return /[　-鿿＀-￯]/.test(text);
}

const modeFromTeamSize: Record<number, string> = {
  1: 'ソロ',
  2: 'デュオ',
  3: 'トリオ',
  4: 'スクワッド',
};

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
  const { br, stw, creative } = json.data ?? {};

  const brItems = (br?.motds ?? [])
    .filter((m: any) => !m.hidden)
    .map((m: any) => ({
      id: `update-br-${m.id}`,
      title: m.title ?? '',
      body: m.body ?? '',
      image: m.tileImage || m.image || '',
      date: br?.date ?? '',
    }));

  const stwItems = (stw?.messages ?? []).map((m: any, i: number) => ({
    id: `update-stw-${i}`,
    title: m.title ?? '',
    body: m.body ?? '',
    image: m.image || '',
    date: stw?.date ?? '',
  }));

  const creativeRaw = creative?.motds ?? creative?.messages ?? [];
  const creativeItems = creativeRaw
    .filter((m: any) => !m.hidden)
    .map((m: any, i: number) => ({
      id: `update-creative-${m.id ?? i}`,
      title: m.title ?? '',
      body: m.body ?? '',
      image: m.tileImage || m.image || '',
      date: creative?.date ?? '',
    }));

  return [...brItems, ...stwItems, ...creativeItems];
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

export async function fetchCompetitivePlaylists(): Promise<CompetitivePlaylist[]> {
  const response = await fetch(`${BASE_URL}/v1/playlists`, { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  const json = await response.json();
  const all: any[] = json.data ?? [];

  // isTournament=true のみ対象。重複name+subNameを排除
  const tournamentOnly = all.filter((p: any) => p.isTournament);
  const seen = new Set<string>();
  const unique: any[] = [];
  for (const p of tournamentOnly) {
    const key = `${p.name}__${p.subName ?? ''}__${p.maxTeamSize}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(p);
    }
  }

  // 明らかに旧シーズンのみのモードを除外（名前にシーズン固有の文字列が含まれる場合）
  const filtered = unique.filter((p: any) => {
    const name = (p.name ?? '').toLowerCase();
    // テスト・開発用を除外
    return !name.includes('test') && !name.includes('debug') && !name.includes('dev');
  });

  return filtered.slice(0, 16).map((p: any) => ({
    id: p.id ?? '',
    name: p.name ?? '',
    subName: p.subName ?? '',
    mode: modeFromTeamSize[p.maxTeamSize] ?? `${p.maxTeamSize}人チーム`,
    maxTeamSize: p.maxTeamSize ?? 1,
    maxPlayers: p.maxPlayers ?? 0,
    isTournament: true,
  }));
}
