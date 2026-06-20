import { NextRequest, NextResponse } from "next/server";
import { fetchShop, ShopItem } from "@/lib/shopApi";

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

  let entries: Awaited<ReturnType<typeof fetchShop>>;
  try {
    entries = await fetchShop();
  } catch (e) {
    const errMsg = `fetchShop失敗: ${String(e)}`;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `🚨 daily-post エラー: ${errMsg}` }),
    }).catch(() => {});
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  });

  const featuredItems = entries
    .filter((e): e is ShopItem => e.kind === "item" && e.featured)
    .slice(0, 3);

  const totalCount = entries.length;

  const lines: string[] = [
    `🛍️ 今日のフォートナイトショップ（${today}）`,
    "",
  ];

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

  const tweetText = lines.join("\n");

  const message = {
    content: `📋 **今日のX投稿文面（コピペしてXに貼ってください）**\n\`\`\`\n${tweetText}\n\`\`\``,
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json({ error: "Discord webhook failed", status: res.status, detail }, { status: 500 });
  }

  return NextResponse.json({ success: true, itemCount: totalCount });
}

export const GET = handleRequest;
export const POST = handleRequest;
