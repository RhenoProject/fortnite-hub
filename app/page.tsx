import type { Metadata } from "next";
import { fetchShop } from "@/lib/shopApi";
import { ShopClient } from "@/components/ShopClient";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "フォートナイト アイテムショップ 今日 | フォトナHub",
  description: "フォートナイトの今日のアイテムショップを毎日更新。注目スキン・バンドル・エモートをいち早くチェック。クリエイターコード RHENO を使って応援してね！",
  openGraph: {
    title: "フォートナイト アイテムショップ 今日 | フォトナHub",
    description: "今日のフォートナイト アイテムショップをチェック。毎日更新。",
  },
  twitter: {
    title: "フォートナイト アイテムショップ 今日 | フォトナHub",
    description: "今日のフォートナイト アイテムショップをチェック。毎日更新。",
  },
};

export default async function ShopPage() {
  let entries = await fetchShop().catch(() => []);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  const featured = entries.filter(e => e.featured);
  const regular = entries.filter(e => !e.featured);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      {/* クリエイターコードバナー */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "#ffd70015",
        border: "1px solid #ffd70055",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "20px" }}>⭐</span>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "2px" }}>
            アイテムを買うときはコードを使って応援してくれると嬉しいです！
          </p>
          <p style={{ fontSize: "22px", fontWeight: "900", color: "#ffd700", letterSpacing: "3px" }}>
            RHENO
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "4px" }}>
          <span aria-hidden="true">🛍️ </span>今日のフォートナイト アイテムショップ
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{today}</p>
      </div>

      {entries.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <ShopClient featured={featured} regular={regular} />
      )}
    </div>
  );
}
