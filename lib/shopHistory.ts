import { getDb } from './firestore';

export interface ShopAppearance {
  date: string;
  price: number;
}

// Firestore shop_daily から指定コスメの登場履歴を取得（最大90日分）
export async function getCosmeticShopHistory(
  cosmeticId: string
): Promise<ShopAppearance[]> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('shop_daily')
      .orderBy('date', 'desc')
      .limit(90)
      .get();

    const appearances: ShopAppearance[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const items: { id: string; price: number }[] = data.items ?? [];
      const found = items.find((item) => item.id === cosmeticId);
      if (found) {
        appearances.push({ date: data.date, price: found.price ?? 0 });
      }
    });

    return appearances;
  } catch {
    return [];
  }
}
