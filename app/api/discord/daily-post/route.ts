import { NextRequest, NextResponse } from "next/server";
import { fetchShop, ShopItem, ShopEntry } from "@/lib/shopApi";
import { getDb } from "@/lib/firestore";
import { sendBotMessage, sendWebhookMessage, MessageOptions } from "@/lib/discordBot";

const SITE_URL = "https://fortnite-hub-delta.vercel.app";

function jstDateStr(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function hasSentToday(collection: string): Promise<boolean> {
  try {
    const db = getDb();
    const doc = await db.collection(collection).doc(jstDateStr()).get();
    return doc.exists;
  } catch {
    return false;
  }
}

async function markSentToday(collection: string): Promise<void> {
  try {
    const db = getDb();
    await db.collection(collection).doc(jstDateStr()).set({ sentAt: new Date().toISOString() });
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

async function postToDiscord(options: MessageOptions, target: string): Promise<void> {
  if (target === "2") {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL_2;
    if (!webhookUrl) throw new Error("DISCORD_WEBHOOK_URL_2 not set");
    await sendWebhookMessage(webhookUrl, options, 3);
    return;
  }
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

const RHENO_QUOTES = [
  "毎日ショップをチェックする習慣が、最高のプレイヤーを作る。",
  "365点の選択肢。最高の一点を見つけろ。",
  "アイテムは消耗品だが、センスは永続する。",
  "プレイヤーの時間は有限だ。フォトナHubで賢く使え。",
  "今日売れるアイテムが、明日の情報になる。",
  "ゲームに勝つのはスキルだが、スタイルに勝つのは情報だ。",
  "毎日更新されるショップは、毎日訪れる理由になる。",
];

function getRhenoQuote(): string {
  const dayIndex = new Date(Date.now() + 9 * 60 * 60 * 1000).getDay();
  return RHENO_QUOTES[dayIndex];
}

function buildXStyleText(entries: ShopEntry[], today: string): string {
  const featuredItems = entries
    .filter((e): e is ShopItem => e.kind === "item" && e.featured)
    .slice(0, 3);
  const totalCount = entries.length;

  const lines: string[] = [`🛍️ 今日のフォートナイトショップ（${today}）`, ""];

  if (featuredItems.length > 0) {
    lines.push("⭐ 注目アイテム");
    featuredItems.forEach(item => {
      const name = item.name.length > 16 ? item.name.slice(0, 15) + "…" : item.name;
      lines.push(`・${name}（${item.price.toLocaleString()}V）`);
    });
    lines.push("");
  }

  lines.push(`他${totalCount}点のアイテムはこちら👇`);
  lines.push(SITE_URL);
  lines.push("");
  lines.push("#フォートナイト #Fortnite #アイテムショップ");

  return lines.join("\n");
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
  descParts.push(`🔗 ${SITE_URL}`);

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
      {
        description: `💼 **RHENOより**\n${getRhenoQuote()}`,
        color: 0x1a1a2e,
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

  const target = req.nextUrl.searchParams.get("target") ?? "1";
  const logCollection = target === "2" ? "discord_daily_log_2" : "discord_daily_log";

  if (target === "2" && !process.env.DISCORD_WEBHOOK_URL_2) {
    return NextResponse.json({ error: "DISCORD_WEBHOOK_URL_2 not set" }, { status: 503 });
  }
  if (target !== "2") {
    const hasBot = !!(process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_CHANNEL_ID);
    const hasWebhook = !!process.env.DISCORD_WEBHOOK_URL;
    if (!hasBot && !hasWebhook) {
      return NextResponse.json({ error: "Discord credentials not set" }, { status: 503 });
    }
  }

  if (!isManual && await hasSentToday(logCollection)) {
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
    }, target).catch(() => {});
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  const payload: MessageOptions = target === "1"
    ? { content: buildXStyleText(entries, today) }
    : buildShopPayload(entries, today);

  try {
    await postToDiscord(payload, target);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  await markSentToday(logCollection);
  return NextResponse.json({ success: true, itemCount: entries.length, target });
}

export const GET = handleRequest;
export const POST = handleRequest;
