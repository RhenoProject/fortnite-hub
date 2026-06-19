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
      <style>{`
        .device-banner {
          display: block;
          text-decoration: none;
          margin-bottom: 20px;
          border-radius: 14px;
          background: linear-gradient(135deg, #004f7a 0%, #003560 50%, #002a50 100%);
          border: 1px solid #00c8ff55;
          box-shadow: 0 0 18px rgba(0,200,255,0.10);
          padding: 16px 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .device-banner:hover {
          border-color: #00c8ffaa;
          box-shadow: 0 0 28px rgba(0,200,255,0.22);
        }
        .device-banner-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .device-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }
        .device-banner-icons {
          font-size: 28px;
          flex-shrink: 0;
          line-height: 1;
        }
        .device-banner-title {
          font-size: 15px;
          font-weight: 900;
          color: var(--text);
          letter-spacing: 0.3px;
          margin-bottom: 4px;
        }
        .device-banner-cats {
          font-size: 12px;
          color: var(--text-muted);
        }
        .device-banner-cta {
          font-size: 13px;
          font-weight: 800;
          color: #0a0f1a;
          background: var(--primary);
          border-radius: 20px;
          padding: 8px 18px;
          white-space: nowrap;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .device-banner:hover .device-banner-cta {
          opacity: 0.85;
        }
        @media (max-width: 480px) {
          .device-banner-cta { width: 100%; text-align: center; }
          .device-banner-title { font-size: 14px; }
        }
      `}</style>
      <a href="/devices" className="device-banner">
        <div className="device-banner-inner">
          <div className="device-banner-left">
            <div className="device-banner-icons">🖱️</div>
            <div>
              <div className="device-banner-title">
                フォートナイト向け おすすめゲーミングデバイス
              </div>
              <div className="device-banner-cats">
                マウス・モニター・ヘッドセット・キーボードなど 51商品を厳選
              </div>
            </div>
          </div>
          <div className="device-banner-cta">今すぐチェック →</div>
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
