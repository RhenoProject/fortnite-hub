import type { Metadata } from "next";
import { listGuides } from "@/lib/guideContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "記事・ガイド | フォトナHub",
  description:
    "フォートナイトのパッチノート・シーズンガイド・Vバックス購入方法など、フォトナHubの記事一覧です。",
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/guides" },
};

const STATIC_GUIDES = [
  {
    slug: "vbucks",
    title: "フォートナイト Vバックスの値段・お得な買い方【2026年最新版】",
    description:
      "Vバックス価格一覧（1,000〜13,500）と最もお得な購入方法を徹底解説。クルーパックとの比較・ギフトカード活用法も。",
    category: "購入ガイド",
    isStatic: true,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  "patch-notes": "パッチノート",
  "season-guide": "シーズン",
  "shop-history-guide": "ショップ",
};

function categoryOf(slug: string): string {
  return CATEGORY_LABELS[slug] ?? "ガイド";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GuidesPage() {
  const aiGuides = await listGuides();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 48px" }}>

      {/* ヘッダー */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: "clamp(20px, 5vw, 26px)",
            fontWeight: 900,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          📝 記事・ガイド
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
          パッチノート・シーズン情報・Vバックス購入ガイドなど、フォートナイトに役立つ記事をまとめています。
          AI が公式情報をもとに自動更新します。
        </p>
      </div>

      {/* 記事グリッド */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {/* 静的ガイド */}
        {STATIC_GUIDES.map((g) => (
          <a
            key={g.slug}
            href={`/guides/${g.slug}`}
            style={{ textDecoration: "none" }}
          >
            <article
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#00c8ff55")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "rgba(0,200,255,0.1)",
                    color: "#00c8ff",
                    border: "1px solid rgba(0,200,255,0.25)",
                  }}
                >
                  {g.category}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "rgba(74,222,128,0.1)",
                    color: "#4ade80",
                    border: "1px solid rgba(74,222,128,0.25)",
                  }}
                >
                  固定記事
                </span>
              </div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--text)",
                  lineHeight: 1.45,
                  margin: 0,
                  flex: 1,
                }}
              >
                {g.title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {g.description}
              </p>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#00c8ff",
                  marginTop: 4,
                }}
              >
                読む →
              </div>
            </article>
          </a>
        ))}

        {/* AI生成ガイド */}
        {aiGuides.map((g) => (
          <a
            key={g.slug}
            href={`/guides/${g.slug}`}
            style={{ textDecoration: "none" }}
          >
            <article
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor = "#00c8ff55")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)")
              }
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "rgba(0,200,255,0.1)",
                    color: "#00c8ff",
                    border: "1px solid rgba(0,200,255,0.25)",
                  }}
                >
                  {categoryOf(g.slug)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "rgba(124,58,237,0.1)",
                    color: "#a78bfa",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  🤖 AI更新
                </span>
              </div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--text)",
                  lineHeight: 1.45,
                  margin: 0,
                  flex: 1,
                }}
              >
                {g.title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {g.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 11, color: "#445566" }}>
                  更新: {formatDate(g.updatedAt)}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00c8ff" }}>
                  読む →
                </span>
              </div>
            </article>
          </a>
        ))}

        {/* AI記事がまだない場合のプレースホルダー */}
        {aiGuides.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "32px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
              background: "var(--surface)",
              borderRadius: 16,
              border: "1px dashed var(--border)",
            }}
          >
            AI記事は次回のフォートナイトアップデート後に自動生成されます
          </div>
        )}
      </div>
    </div>
  );
}
