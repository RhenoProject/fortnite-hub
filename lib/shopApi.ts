const BASE_URL = 'https://fortnite-api.com';

export interface ShopItem {
  kind: 'item';
  id: string;
  name: string;
  typeValue: string;
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
  return item.images?.featured ?? item.images?.icon ?? item.images?.smallIcon ?? item.images?.large ?? item.images?.small ?? '';
}

export async function fetchShop(): Promise<ShopEntry[]> {
  const res = await fetch(`${BASE_URL}/v2/shop?language=ja`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Shop API error: ${res.status}`);
  const json = await res.json();

  const entries: any[] = json.data?.entries ?? [];

  const bundles: ShopBundle[] = [];

  for (const entry of entries) {
    if (!entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    const carItems: any[] = entry.cars ?? [];
    const allItems = brItems.length > 0 ? brItems : carItems;

    if (allItems.length === 0) continue;

    const isCar = brItems.length === 0 && carItems.length > 0;
    const mainImage = isCar
      ? (entry.newDisplayAsset?.renderImages?.image ?? carItems[0]?.images?.large ?? '')
      : getBestImage(brItems[0]);

    const icons = allItems
      .map((i: any) => i.images?.smallIcon ?? i.images?.icon ?? i.images?.small ?? '')
      .filter(Boolean)
      .slice(0, 6);

    bundles.push({
      kind: 'bundle',
      id: entry.offerId ?? entry.bundle.name,
      name: entry.bundle.name,
      rarity: isCar ? (carItems[0]?.rarity?.value ?? 'legendary') : getRarity(entry),
      price: entry.finalPrice ?? entry.regularPrice ?? 0,
      image: mainImage,
      icons,
      itemCount: allItems.length,
      featured: isFeatured(entry),
    });
  }

  // seenNames で重複を防ぐ。バンドル内アイテムであっても単品エントリがあれば表示する。
  const seenNames = new Set<string>();
  const items: ShopItem[] = [];

  for (const entry of entries) {
    if (entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    const carItems: any[] = entry.cars ?? [];
    const allEntryItems = brItems.length > 0 ? brItems : carItems;
    const entryFeatured = isFeatured(entry);

    for (const item of allEntryItems) {
      const name: string = item.name ?? '';
      if (!name || seenNames.has(name)) continue;
      seenNames.add(name);

      items.push({
        kind: 'item',
        id: item.id ?? item.vehicleId ?? entry.offerId,
        name,
        typeValue: item.type?.value ?? '',
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

export type CosmeticCategory = 'br' | 'tracks' | 'instruments' | 'cars' | 'lego' | 'legoKits';

export interface NewCosmetic {
  id: string;
  name: string;
  typeValue: string;
  typeDisplay: string;
  rarity: string;
  image: string;
  addedAt: string;
  category: CosmeticCategory;
}

export const cosmeticCategoryLabel: Record<CosmeticCategory, string> = {
  br: 'コスメティック',
  tracks: '楽曲',
  instruments: '楽器',
  cars: '車',
  lego: 'レゴ',
  legoKits: 'レゴキット',
};

export async function fetchNewCosmetics(): Promise<NewCosmetic[]> {
  const res = await fetch(`${BASE_URL}/v2/cosmetics/new?language=ja`, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Cosmetics API error: ${res.status}`);
  const json = await res.json();

  const itemsObj: Record<string, any[]> = json.data?.items ?? {};
  const all: NewCosmetic[] = [];

  for (const [cat, list] of Object.entries(itemsObj)) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      const name: string = item.name ?? '';
      if (!name) continue;

      all.push({
        id: item.id,
        name,
        typeValue: item.type?.value ?? '',
        typeDisplay: item.type?.displayValue ?? '',
        rarity: item.rarity?.value ?? 'common',
        image: item.images?.icon ?? item.images?.smallIcon ?? '',
        addedAt: item.added ?? '',
        category: cat as CosmeticCategory,
      });
    }
  }

  all.sort((a, b) => {
    const ra = rarityOrder[a.rarity] ?? 8;
    const rb = rarityOrder[b.rarity] ?? 8;
    if (ra !== rb) return ra - rb;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  return all;
}
