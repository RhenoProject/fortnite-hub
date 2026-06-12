const BASE_URL = 'https://fortnite-api.com';

export interface ShopItem {
  kind: 'item';
  id: string;
  name: string;
  typeDisplay: string;
  rarity: string;
  rarityDisplay: string;
  price: number;
  image: string;
  featured: boolean;
}

export interface ShopBundle {
  kind: 'bundle';
  id: string;
  name: string;
  rarity: string;
  price: number;
  image: string;
  icons: string[];
  itemCount: number;
  featured: boolean;
}

export type ShopEntry = ShopItem | ShopBundle;

export const rarityColors: Record<string, string> = {
  common: '#b0b0b0',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
  mythic: '#FFD700',
  exotic: '#00E5FF',
  transcendent: '#FF1744',
};

const rarityOrder: Record<string, number> = {
  transcendent: 0,
  mythic: 1,
  exotic: 2,
  legendary: 3,
  epic: 4,
  rare: 5,
  uncommon: 6,
  common: 7,
};

const featuredSizes = new Set(['Size_2_x_1', 'Size_3_x_1', 'Size_4_x_1']);

function isFeatured(entry: any): boolean {
  return featuredSizes.has(entry.tileSize);
}

function getRarity(entry: any): string {
  const brItems: any[] = entry.brItems ?? entry.items ?? [];
  return brItems[0]?.rarity?.value ?? 'legendary';
}

function getBestImage(item: any): string {
  return item.images?.featured ?? item.images?.icon ?? item.images?.smallIcon ?? '';
}

export async function fetchShop(): Promise<ShopEntry[]> {
  const res = await fetch(`${BASE_URL}/v2/shop?language=ja`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Shop API error: ${res.status}`);
  const json = await res.json();

  const entries: any[] = json.data?.entries ?? [];

  const bundleItemNames = new Set<string>();
  const bundles: ShopBundle[] = [];

  for (const entry of entries) {
    if (!entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    if (brItems.length < 2) continue;

    const mainItem = brItems[0];
    const icons = brItems
      .map((i: any) => i.images?.smallIcon ?? i.images?.icon ?? '')
      .filter(Boolean)
      .slice(0, 6);

    brItems.forEach((i: any) => { if (i.name) bundleItemNames.add(i.name); });

    bundles.push({
      kind: 'bundle',
      id: entry.offerId ?? entry.bundle.name,
      name: entry.bundle.name,
      rarity: getRarity(entry),
      price: entry.finalPrice ?? entry.regularPrice ?? 0,
      image: getBestImage(mainItem),
      icons,
      itemCount: brItems.length,
      featured: isFeatured(entry),
    });
  }

  const seenNames = new Set<string>();
  const items: ShopItem[] = [];

  for (const entry of entries) {
    if (entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    const entryFeatured = isFeatured(entry);

    for (const item of brItems) {
      const name: string = item.name ?? '';
      if (!name || seenNames.has(name) || bundleItemNames.has(name)) continue;
      seenNames.add(name);

      items.push({
        kind: 'item',
        id: item.id ?? entry.offerId,
        name,
        typeDisplay: item.type?.displayValue ?? '',
        rarity: item.rarity?.value ?? 'common',
        rarityDisplay: item.rarity?.displayValue ?? '',
        price: entry.finalPrice ?? entry.regularPrice ?? 0,
        image: getBestImage(item),
        featured: entryFeatured,
      });
    }
  }

  const all: ShopEntry[] = [...bundles, ...items];

  all.sort((a, b) => {
    const ra = rarityOrder[a.rarity] ?? 8;
    const rb = rarityOrder[b.rarity] ?? 8;
    return ra - rb;
  });

  return all;
}
