import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  // Vercel Cronからのリクエストのみ許可
  if (CRON_SECRET && req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const snapshot = await db.collection("push_subscriptions").get();

  const payload = JSON.stringify({
    title: "🛍️ 今日のフォートナイトショップが更新されました！",
    body: "新しいスキンをチェックしよう",
    url: "https://fortnite-hub-delta.vercel.app",
    icon: "/icon-192x192.png",
  });

  let sent = 0;
  let failed = 0;
  const removes: string[] = [];

  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { subscription } = doc.data();
      try {
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (e: any) {
        failed++;
        // 410 Gone = 購読が無効。削除する
        if (e.statusCode === 410 || e.statusCode === 404) {
          removes.push(doc.id);
        }
      }
    })
  );

  // 無効な購読を削除
  await Promise.all(removes.map((id) => db.collection("push_subscriptions").doc(id).delete()));

  return NextResponse.json({ sent, failed, removed: removes.length });
}
