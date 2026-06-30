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

export interface ShopBundleItem {
  id: string;
  name: string;
  image: string;
}

export interface ShopBundle {
  kind: 'bundle';
  id: string;
  name: string;
  rarity: string;
  price: number;
  image: string;
  icons: string[];
  brItems: ShopBundleItem[];
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
  return item.images?.featured || item.images?.icon || item.images?.smallIcon || item.images?.large || item.images?.small || '';
}


export async function fetchShop(): Promise<ShopEntry[]> {
  const res = await fetch(`${BASE_URL}/v2/shop?language=ja`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Shop API error: ${res.status}`);
  const json = await res.json();

  const entries: any[] = json.data?.entries ?? [];

  // "Terminator1.98" → "Terminator1" (同セクションの判定用)
  const getLayoutPrefix = (id: string | null | undefined): string | null => {
    if (!id) return null;
    const dot = id.lastIndexOf('.');
    return dot >= 0 ? id.slice(0, dot) : id;
  };

  const bundles: ShopBundle[] = [];
  // 名付きバンドルのアイテム名とlayoutIdプレフィックスを収集
  const bundleItemNames = new Set<string>();
  const bundlePrefixes = new Set<string>();

  for (const entry of entries) {
    if (!entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    const carItems: any[] = entry.cars ?? [];
    const allItems = brItems.length > 0 ? brItems : carItems;

    // 名付きバンドル内の全アイテム名を収集
    allItems.forEach((i: any) => { if (i.name) bundleItemNames.add(i.name); });
    // セクションプレフィックスを収集 (例: "Terminator1.99" → "Terminator1")
    const pfx = getLayoutPrefix(entry.layoutId);
    if (pfx) bundlePrefixes.add(pfx);

    if (allItems.length === 0) continue;

    const isCar = brItems.length === 0 && carItems.length > 0;
    const mainImage = isCar
      ? (carItems[0]?.images?.large || carItems[0]?.images?.featured || carItems[0]?.images?.icon || '')
      : getBestImage(brItems[0]);

    const icons = allItems
      .map((i: any) => i.images?.smallIcon || i.images?.icon || i.images?.small || '')
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
      brItems: isCar ? [] : brItems
        .filter((i: any) => i.id)
        .map((i: any) => ({
          id: i.id as string,
          name: (i.name as string) ?? '',
          image: getBestImage(i),
        })),
      itemCount: allItems.length,
      featured: isFeatured(entry),
    });
  }

  // 先に複数brItemsを持つ非バンドルエントリのアイテム名を収集
  // → APIの処理順序に関わらず、コンボ内アイテムを単品として表示しない
  const comboItemNames = new Set<string>();
  for (const entry of entries) {
    if (entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    if (brItems.length > 1) {
      brItems.forEach((i: any) => { if (i.name) comboItemNames.add(i.name); });
    }
  }

  const seenNames = new Set<string>();
  const items: ShopItem[] = [];

  for (const entry of entries) {
    if (entry.bundle) continue;
    const brItems: any[] = entry.brItems ?? entry.items ?? [];
    const carItems: any[] = entry.cars ?? [];
    const entryFeatured = isFeatured(entry);

    if (brItems.length > 1) {
      // 同セクションに名付きバンドルがある場合（例: Terminator1.98 ↔ Terminator1.99）
      // → 同セクションのサブ購入オプションなので表示する
      const entryPrefix = getLayoutPrefix(entry.layoutId);
      const inBundleSection = entryPrefix !== null && bundlePrefixes.has(entryPrefix);

      if (!inBundleSection) {
        // 別セクションかつ全アイテムが名付きバンドルに含まれる場合 → 非表示
        const allInBundle = brItems.every((i: any) => !i.name || bundleItemNames.has(i.name));
        if (allInBundle) {
          brItems.forEach((i: any) => { if (i.name) seenNames.add(i.name); });
          continue;
        }
      }
      // 表示: 同セクションのサブオプション or バンドル外アイテムを含む独立セット
      const icons = brItems
        .map((i: any) => i.images?.smallIcon || i.images?.icon || '')
        .filter(Boolean)
        .slice(0, 6);
      brItems.forEach((i: any) => { if (i.name) seenNames.add(i.name); });
      const pseudoItemNames = [...new Set(brItems.map((i: any) => i.name as string).filter(Boolean))];
      const pseudoName = pseudoItemNames.length >= 2
        ? pseudoItemNames.slice(0, 2).join(' & ')
        : (pseudoItemNames[0] ?? 'セット');
      bundles.push({
        kind: 'bundle',
        id: entry.offerId ?? brItems[0]?.id ?? '',
        name: pseudoName,
        rarity: getRarity(entry),
        price: entry.finalPrice ?? entry.regularPrice ?? 0,
        image: getBestImage(brItems[0]),
        icons,
        brItems: brItems.filter((i: any) => i.id).map((i: any) => ({
          id: i.id as string,
          name: (i.name as string) ?? '',
          image: getBestImage(i),
        })),
        itemCount: brItems.length,
        featured: entryFeatured,
      });
      continue;
    }

    const isCar = brItems.length === 0 && carItems.length > 0;
    const allEntryItems = brItems.length === 1 ? brItems : carItems;

    for (const item of allEntryItems) {
      const name: string = item.name ?? '';
      // コンボ内アイテムまたは既出アイテムは単品表示しない
      if (!name || seenNames.has(name) || comboItemNames.has(name)) continue;
      // カーアイテムが名付きバンドルに含まれる場合 → バンドル経由でのみ入手可能なので非表示
      if (isCar && bundleItemNames.has(name)) continue;
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
        image: item.images?.icon || item.images?.smallIcon || '',
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
