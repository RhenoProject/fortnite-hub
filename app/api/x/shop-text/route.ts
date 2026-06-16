import { NextResponse } from "next/server";
import { fetchShop, ShopItem } from "@/lib/shopApi";

const SITE_URL = "https://fortnite-hub-delta.vercel.app";

export async function GET() {
  const entries = await fetchShop();

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
  lines.push(SITE_URL);
  lines.push("");
  lines.push("#フォートナイト #Fortnite #アイテムショップ");

  return NextResponse.json({ text: lines.join("\n") });
}
