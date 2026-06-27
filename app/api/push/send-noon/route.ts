import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firestore";
import webpush from "web-push";

const CRON_SECRET = process.env.CRON_SECRET;
const EXPIRY_DATE = "2026-06-01"; // 永続停止

async function fetchTodayShop(): Promise<Map<string, string>> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/shop?language=ja");
    if (!res.ok) return new Map();
    const json = await res.json();
    const entries: any[] = json.data?.entries ?? [];
    const map = new Map<string, string>();
    for (const entry of entries) {
      const items: any[] = entry.brItems ?? entry.items ?? [];
      for (const item of items) {
        if (item.id && item.name) map.set(item.id, item.name);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

async function handleRequest(req: NextRequest) {
  if (CRON_SECRET && req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // 6/21以降は自動停止
  const jstDateStr = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (jstDateStr >= EXPIRY_DATE) {
    return NextResponse.json({ skipped: `expired after ${EXPIRY_DATE}` });
  }

  const [db, shopMap] = await Promise.all([
    Promise.resolve(getDb()),
    fetchTodayShop(),
  ]);

  const snapshot = await db.collection("push_subscriptions").get();

  let sent = 0;
  let failed = 0;
  const removes: string[] = [];

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { subscription, wishlist } = doc.data() as { subscription: any; wishlist?: string[] };

      const matchedNames = Array.isArray(wishlist)
        ? wishlist.filter((id) => shopMap.has(id)).map((id) => shopMap.get(id)!)
        : [];

      const payload = matchedNames.length > 0
        ? JSON.stringify({
            title: "❤️ 欲しいスキンがショップに出ています！",
            body: matchedNames.join("、"),
            url: "https://fortnite-hub-delta.vercel.app",
            icon: "/icon-192x192.png",
          })
        : JSON.stringify({
            title: "🌞 お昼のフォートナイトショップ",
            body: "今日のショップをチェックしよう",
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

  revalidatePath("/");

  return NextResponse.json({ sent, failed, removed: removes.length });
}

export const GET = handleRequest;
export const POST = handleRequest;
