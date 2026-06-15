import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const CRON_SECRET = process.env.CRON_SECRET;

async function fetchTodayShopIds(): Promise<Set<string>> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/shop?language=ja");
    if (!res.ok) return new Set();
    const json = await res.json();
    const entries: any[] = json.data?.entries ?? [];
    const ids = new Set<string>();
    for (const entry of entries) {
      const items: any[] = entry.brItems ?? entry.items ?? [];
      for (const item of items) {
        if (item.id) ids.add(item.id);
      }
    }
    return ids;
  } catch {
    return new Set();
  }
}

export async function POST(req: NextRequest) {
  if (CRON_SECRET && req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [db, shopIds] = await Promise.all([
    Promise.resolve(getDb()),
    fetchTodayShopIds(),
  ]);

  const snapshot = await db.collection("push_subscriptions").get();

  let sent = 0;
  let failed = 0;
  const removes: string[] = [];

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { subscription, wishlist } = doc.data();
      const matched = Array.isArray(wishlist)
        ? wishlist.filter((id: string) => shopIds.has(id))
        : [];

      const payload = matched.length > 0
        ? JSON.stringify({
            title: "❤️ 欲しいスキンがショップに出ました！",
            body: `今すぐチェックしよう`,
            url: "https://fortnite-hub-delta.vercel.app",
            icon: "/icon-192x192.png",
          })
        : JSON.stringify({
            title: "🛍️ 今日のフォートナイトショップが更新されました！",
            body: "新しいスキンをチェックしよう",
            url: "https://fortnite-hub-delta.vercel.app",
            icon: "/icon-192x192.png",
          });

      try {
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (e: any) {
        failed++;
        if (e.statusCode === 410 || e.statusCode === 404) removes.push(doc.id);
      }
    })
  );

  await Promise.all(removes.map((id) => db.collection("push_subscriptions").doc(id).delete()));

  return NextResponse.json({ sent, failed, removed: removes.length });
}
