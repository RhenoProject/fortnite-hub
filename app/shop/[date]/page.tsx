import type { Metadata } from "next";
import { getDb } from "@/lib/firestore";
import { fetchShop, rarityColors } from "@/lib/shopApi";

interface Props {
  params: Promise<{ date: string }>;
}

function jstToday(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function formatDateJa(dateStr: string): string {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateStr;
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  return `${m[1]}年${parseInt(m[2])}月${parseInt(m[3])}日（${weekdays[d.getDay()]}）`;
}

function offsetDate(dateStr: string, days: number): string {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateStr;
  const d = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

type RawItem = {
  id: string;
  kind: string;
  name: string;
  rarity: string;
  price: number;
  image: string;
  featured: boolean;
  typeDisplay?: string;
};

async function getItemsForDate(date: string): Promise<RawItem[] | null> {
  const today = jstToday();
  if (date === today) {
    try {
      const entries = await fetchShop();
      return entries.map((e) => ({
        id: e.id,
        kind: e.kind,
        name: e.name,
        rarity: e.rarity,
        price: e.price,
        image: e.image,
        featured: e.featured,
        typeDisplay: e.kind === "item" ? e.typeDisplay : undefined,
      }));
    } catch {
      return null;
    }
  }
  try {
    const db = getDb();
    const doc = await db.collection("shop_daily").doc(date).get();
    if (!doc.exists) return null;
    return (doc.data()?.items ?? null) as RawItem[] | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const dateJa = formatDateJa(date);
  const title = `フォートナイト ${dateJa}のアイテムショップ | フォトナHub`;
  const description = `${dateJa}のフォートナイト アイテムショップ一覧。当日のスキン・バンドル・エモートの価格をまとめて確認。`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function ShopDatePage({ params }: Props) {
  const { date } = await params;
  const today = jstToday();
  const isToday = date === today;
  const isFuture = date > today;
  const dateJa = formatDateJa(date);
  const prevDate = offsetDate(date, -1);
  const nextDate = offsetDate(date, 1);

  const items = await getItemsForDate(date);

  const jsonLd = items
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `フォートナイト ${dateJa}のアイテムショップ`,
        description: `${dateJa}のフォートナイト アイテムショップ一覧`,
        numberOfItems: items.length,
        itemListElement: items.slice(0, 20).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
        })),
      }
    : null;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* タイトル */}
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "clamp(18px, 4vw, 26px)",
            fontWeight: "bold",
            margin: "0 0 10px 0",
          }}
        >
          フォートナイト {dateJa} のショップ
        </h1>
        {isToday && (
          <span
            style={{
              background: "#00c8ff",
              color: "#000",
              fontSize: "12px",
              padding: "3px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
            }}
          >
            ✓ 今日のショップ（リアルタイム）
          </span>
        )}
      </div>

      {/* 日付ナビゲーション */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          background: "#0a1628",
          borderRadius: "10px",
          padding: "10px 16px",
          border: "1px solid #1a2a40",
        }}
      >
        <a
          href={`/shop/${prevDate}`}
          style={{ color: "#00c8ff", textDecoration: "none", fontSize: "14px" }}
        >
          ← {formatDateJa(prevDate)}
        </a>
        <a
          href="/"
          style={{ color: "#667788", textDecoration: "none", fontSize: "13px" }}
        >
          今日のショップ（トップ）
        </a>
        {!isFuture && nextDate <= today ? (
          <a
            href={`/shop/${nextDate}`}
            style={{ color: "#00c8ff", textDecoration: "none", fontSize: "14px" }}
          >
            {formatDateJa(nextDate)} →
          </a>
        ) : (
          <span style={{ color: "#334", fontSize: "14px" }}>（未来）</span>
        )}
      </div>

      {/* アイテム一覧 */}
      {items === null ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#667788" }}>
          <p style={{ fontSize: "18px", marginBottom: "16px" }}>
            {isFuture
              ? "まだ公開されていません"
              : "この日のショップデータは保存されていません"}
          </p>
          <p style={{ fontSize: "14px", marginBottom: "24px", color: "#556" }}>
            {!isFuture && "（データ収集は2026年6月21日から開始しました）"}
          </p>
          <a
            href="/"
            style={{
              color: "#00c8ff",
              textDecoration: "none",
              background: "#001828",
              border: "1px solid #00c8ff44",
              padding: "10px 24px",
              borderRadius: "8px",
            }}
          >
            今日のショップを見る →
          </a>
        </div>
      ) : (
        <>
          <p style={{ color: "#556677", fontSize: "13px", marginBottom: "16px" }}>
            {items.length}件のアイテム
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
              gap: "12px",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#060f1e",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: `1.5px solid ${rarityColors[item.rarity] ?? "#334"}`,
                }}
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                  />
                )}
                <div style={{ padding: "10px" }}>
                  <div
                    style={{
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "4px",
                      lineHeight: "1.3",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      color: rarityColors[item.rarity] ?? "#aaa",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.price > 0 ? `${item.price.toLocaleString()} V` : "FREE"}
                  </div>
                  {item.typeDisplay && (
                    <div style={{ color: "#445566", fontSize: "11px", marginTop: "2px" }}>
                      {item.typeDisplay}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 今日のページへの誘導 */}
          {!isToday && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <a
                href="/"
                style={{
                  color: "#00c8ff",
                  textDecoration: "none",
                  background: "#001828",
                  border: "1px solid #00c8ff44",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontSize: "14px",
                }}
              >
                今日のショップを見る →
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
