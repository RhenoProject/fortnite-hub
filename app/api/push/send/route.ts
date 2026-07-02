import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";
import webpush from "web-push";

const CRON_SECRET = process.env.CRON_SECRET;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

async function fetchTodayShop(): Promise<Map<string, string>> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/shop?language=ja", {
      cache: "no-store",
    });
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

  const db = getDb();
  const today = todayUTC();

  // 冪等チェック — 当日すでに送信済みならスキップ
  const logRef = db.collection("push_log").doc(today);
  const logSnap = await logRef.get();
  if (logSnap.exists) {
    return NextResponse.json({ skipped: "already sent today", date: today });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const [shopMap, snapshot] = await Promise.all([
    fetchTodayShop(),
    db.collection("push_subscriptions").get(),
  ]);

  let sent = 0;
  let failed = 0;
  const removes: string[] = [];

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { subscription, wishlist } = doc.data() as {
        subscription: any;
        wishlist?: string[];
      };

      const matchedNames = Array.isArray(wishlist)
        ? wishlist.filter((id) => shopMap.has(id)).map((id) => shopMap.get(id)!)
        : [];

      const payload =
        matchedNames.length > 0
          ? JSON.stringify({
              title: "❤️ 欲しいスキンがショップに出ました！",
              body: matchedNames.join("、"),
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
        await webpush.sendNotification(subscription, payload, {
          urgency: "high",
          TTL: 3600, // 1時間 — 遅延してもキャリーオーバーされる
        });
        sent++;
      } catch (e: any) {
        failed++;
        if (e.statusCode === 410 || e.statusCode === 404) removes.push(doc.id);
      }
    })
  );

  // 期限切れ購読を削除
  await Promise.all(
    removes.map((id) => db.collection("push_subscriptions").doc(id).delete())
  );

  // 送信済みフラグを記録（TTL: 次の日に自動削除されるよう sentAt を残す）
  await logRef.set({ sentAt: new Date().toISOString(), sent, failed });

  return NextResponse.json({ sent, failed, removed: removes.length, date: today });
}

export const GET = handleRequest;
export const POST = handleRequest;
