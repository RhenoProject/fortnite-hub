import type { Metadata } from "next";
import { fetchShop } from "@/lib/shopApi";
import { ShopClient } from "@/components/ShopClient";

export const revalidate = 30;

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
      <a href="/devices" style={{
        display: "block", textDecoration: "none", marginBottom: "20px",
        borderRadius: "14px",
        background: "linear-gradient(135deg, #004f7a 0%, #003560 50%, #002a50 100%)",
        border: "1.5px solid #00c8ff66",
        boxShadow: "0 0 20px rgba(0,200,255,0.15)",
        padding: "16px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: "30px", flexShrink: 0, lineHeight: 1 }}>{"\u{1F525}"}</span>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 900, color: "#dff6ff", marginBottom: "4px", letterSpacing: "0.3px" }}>
                フォートナイト向け おすすめゲーミングデバイス
              </div>
              <div style={{ fontSize: "12px", color: "#5aa8c8" }}>
                マウス・モニター・ヘッドセット・キーボードなど 51商品を厳選
              </div>
            </div>
          </div>
          <div style={{
            fontSize: "13px", fontWeight: 800,
            color: "#0a0f1a", background: "#00ccf0",
            borderRadius: "20px", padding: "9px 20px",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>
            今すぐチェック →
          </div>
        </div>
      </a>

      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "4px" }}>
          <span aria-hidden="true">🛍️ </span>今日のフォートナイト アイテムショップ
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: 0 }}>{today}</p>
          <a
            href={`/shop/${new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)}`}
            style={{ color: "#00c8ff", fontSize: "12px", textDecoration: "none", background: "#001828", border: "1px solid #00c8ff33", padding: "3px 10px", borderRadius: "20px" }}
          >
            📅 今日のアーカイブ
          </a>
        </div>
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
