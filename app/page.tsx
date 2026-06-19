import type { Metadata } from "next";
import { fetchShop } from "@/lib/shopApi";
import { ShopClient } from "@/components/ShopClient";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
    timeZone: "Asia/Tokyo",
  });
  const title = `フォートナイト アイテムショップ 今日 ${today} | フォトナHub`;
  const description = "フォートナイトの今日のアイテムショップを毎日更新。注目スキン・バンドル・エモートをいち早くチェック。";
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function ShopPage() {
  let entries = await fetchShop().catch(() => []);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
    timeZone: "Asia/Tokyo",
  });

  const featured = entries.filter(e => e.featured);
  const regular = entries.filter(e => !e.featured);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `フォートナイト 今日のアイテムショップ ${today}`,
    "description": `${today}のフォートナイト アイテムショップ一覧`,
    "numberOfItems": entries.length,
    "itemListElement": entries.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": e.name,
    })),
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {/* デバイスページ誘導バナー */}
      <a href="/devices" style={{ textDecoration: "none", display: "block", marginBottom: "20px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "#00c8ff10",
          border: "1px solid #00c8ff40",
          borderRadius: "12px",
          padding: "12px 16px",
          flexWrap: "wrap",
          cursor: "pointer",
          transition: "background-color 0.15s",
        }}>
          <span style={{ fontSize: "24px" }}>🎮</span>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text)", marginBottom: "2px" }}>
              フォートナイト向けおすすめゲーミングデバイス
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              マウス・モニター・マウスパッドなど51商品を厳選掲載 →
            </p>
          </div>
        </div>
      </a>

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
