import { NextRequest, NextResponse } from "next/server";
import { fetchShop } from "@/lib/shopApi";
import { getDb } from "@/lib/firestore";

function jstDateStr(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function handleRequest(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const manual = process.env.MANUAL_TRIGGER_KEY;
  const isCron = secret && auth === `Bearer ${secret}`;
  const isManual = manual && auth === `Bearer ${manual}`;

  if (!isCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = jstDateStr();

  try {
    const db = getDb();

    // 重複保存を防ぐ（手動トリガー以外）
    if (!isManual) {
      const existing = await db.collection("shop_daily").doc(date).get();
      if (existing.exists) {
        return NextResponse.json({ skipped: "already saved today", date });
      }
    }

    const entries = await fetchShop();

    const items = entries.map((e) => ({
      id: e.id,
      kind: e.kind,
      name: e.name,
      rarity: e.rarity,
      price: e.price,
      image: e.image,
      featured: e.featured,
      ...(e.kind === "item"
        ? { typeValue: e.typeValue, typeDisplay: e.typeDisplay }
        : { itemCount: (e as { itemCount: number }).itemCount }),
    }));

    await db.collection("shop_daily").doc(date).set({
      date,
      items,
      totalCount: entries.length,
      savedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, date, count: entries.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
