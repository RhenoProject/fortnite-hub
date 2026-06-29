import { NextRequest, NextResponse } from "next/server";
import { fetchShop, ShopItem, ShopEntry } from "@/lib/shopApi";
import { getDb } from "@/lib/firestore";
import { sendBotMessage, sendWebhookMessage, MessageOptions } from "@/lib/discordBot";

const SITE_URL = "https://fortnite-hub-delta.vercel.app";

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

async function fetchShopWithRetry(maxAttempts = 3): Promise<ShopEntry[]> {
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

async function postToDiscord(options: MessageOptions): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (botToken && channelId) {
    await sendBotMessage(botToken, channelId, options, 3);
  } else if (webhookUrl) {
    await sendWebhookMessage(webhookUrl, options, 3);
  } else {
    throw new Error("Discord credentials not set");
  }
}

function buildShopPayload(entries: ShopEntry[], today: string): MessageOptions {
  const featuredItems = entries
    .filter((e): e is ShopItem => e.kind === "item" && e.featured)
    .slice(0, 5);
  const totalCount = entries.length;

  const descParts = [`今日は **${totalCount}点** のアイテムがラインナップ！`, ""];
  if (featuredItems.length > 0) {
    descParts.push("⭐ **注目アイテム**");
    featuredItems.forEach(item => {
      descParts.push(`・${item.name}（${item.price.toLocaleString()} V-Bucks）`);
    });
    descParts.push("");
  }
  descParts.push(`[🔗 ショップ全体を見る](${SITE_URL})`);

  return {
    embeds: [
      {
        title: `🛍️ 今日のフォートナイトショップ（${today}）`,
        description: descParts.join("\n"),
        color: 0x00c8ff,
        image: { url: `${SITE_URL}/api/og/shop` },
        footer: { text: "フォトナHub | #フォートナイト #Fortnite" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
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

  const hasBot = !!(process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CHANNEL_ID);
  const hasWebhook = !!process.env.DISCORD_WEBHOOK_URL;
  if (!hasBot && !hasWebhook) {
    return NextResponse.json({ error: "Discord credentials not set" }, { status: 503 });
  }

  if (!isManual && await hasSentToday()) {
    return NextResponse.json({ skipped: "already sent today" });
  }

  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  });

  let entries: ShopEntry[];
  try {
    entries = await fetchShopWithRetry(3);
  } catch (e) {
    const errMsg = `fetchShop失敗（3回リトライ後）: ${String(e)}`;
    await postToDiscord({
      embeds: [{ title: `🚨 daily-post エラー（${today}）`, description: errMsg, color: 0xff0000 }],
    }).catch(() => {});
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  try {
    await postToDiscord(buildShopPayload(entries, today));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  await markSentToday();
  return NextResponse.json({ success: true, itemCount: entries.length });
}

export const GET = handleRequest;
export const POST = handleRequest;
