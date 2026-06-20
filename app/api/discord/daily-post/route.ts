import { NextRequest, NextResponse } from "next/server";
import { fetchShop, ShopItem } from "@/lib/shopApi";
import { getDb } from "@/lib/firestore";

function jstDateStr(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function hasSentToday(): Promise<boolean> {
  try {
    const db = getDb();
    const doc = await db.collection("discord_daily_log").doc(jstDateStr()).get();
    return doc.exists;
  } catch {
    return false;
  }
}

async function markSentToday(): Promise<void> {
  try {
    const db = getDb();
    await db.collection("discord_daily_log").doc(jstDateStr()).set({ sentAt: new Date().toISOString() });
  } catch {}
}

async function fetchShopWithRetry(maxAttempts = 3): Promise<Awaited<ReturnType<typeof fetchShop>>> {
  let lastErr: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fetchShop();
    } catch (e) {
      lastErr = e;
      if (i < maxAttempts - 1) await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw lastErr;
}

async function sendToDiscord(webhookUrl: string, content: string, maxAttempts = 3): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) return;
      const detail = await res.text().catch(() => "");
      throw new Error(`Discord webhook ${res.status}: ${detail}`);
    } catch (e) {
      lastErr = e;
      if (i < maxAttempts - 1) await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw lastErr;
}

async function handleRequest(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const manualKey = process.env.MANUAL_TRIGGER_KEY;
  const authHeader = req.headers.get("authorization");
  const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isManual = manualKey && authHeader === `Bearer ${manualKey}`;

  if (!isCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "DISCORD_WEBHOOK_URL not set" }, { status: 503 });
  }

  // 手動トリガー以外は重複送信を防ぐ
  if (!isManual && await hasSentToday()) {
    return NextResponse.json({ skipped: "already sent today" });
  }

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  });

  let entries: Awaited<ReturnType<typeof fetchShop>>;
  try {
    entries = await fetchShopWithRetry(3);
  } catch (e) {
    const errMsg = `fetchShop失敗（3回リトライ後）: ${String(e)}`;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `🚨 daily-post エラー（${today}）: ${errMsg}` }),
    }).catch(() => {});
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  const featuredItems = entries
    .filter((e): e is ShopItem => e.kind === "item" && e.featured)
    .slice(0, 3);

  const totalCount = entries.length;

  const lines: string[] = [`🛍️ 今日のフォートナイトショップ（${today}）`, ""];

  if (featuredItems.length > 0) {
    lines.push("⭐ 注目アイテム");
    featuredItems.forEach((item) => {
      const name = item.name.length > 16 ? item.name.slice(0, 15) + "…" : item.name;
      lines.push(`・${name}（${item.price.toLocaleString()}V）`);
    });
    lines.push("");
  }

  lines.push(`他${totalCount}点のアイテムはこちら👇`);
  lines.push("https://fortnite-hub-delta.vercel.app");
  lines.push("");
  lines.push("#フォートナイト #Fortnite #アイテムショップ");

  const content = `📋 **今日のX投稿文面（コピペしてXに貼ってください）**\n\`\`\`\n${lines.join("\n")}\n\`\`\``;

  try {
    await sendToDiscord(webhookUrl, content, 3);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  await markSentToday();
  return NextResponse.json({ success: true, itemCount: totalCount });
}

export const GET = handleRequest;
export const POST = handleRequest;
