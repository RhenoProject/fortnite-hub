import type { Metadata } from "next";
import { listGuides, type GuideContent } from "@/lib/guideContent";

async function fetchNewsImage(): Promise<string | null> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/news?language=ja", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const motds: { image?: string }[] = json?.data?.br?.motds ?? [];
    return motds.find((m) => m.image)?.image ?? null;
  } catch {
    return null;
  }
}

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "記事・ガイド | フォトナHub",
  description:
    "フォートナイトのパッチノート・シーズンガイド・Vバックス購入方法など、フォトナHubの記事一覧です。",
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/guides" },
};

interface ArticleCard {
  slug: string;
  title: string;
  description: string;
  updatedAt?: string;
  icon: string;
  accent: string;
  accentBg: string;
  label: string;
  readMin?: number;
  image?: string;
}

const ARTICLE_META: Record<string, { icon: string; accent: string; accentBg: string; label: string }> = {
  "patch-notes":      { icon: "⚡", accent: "#00c8ff", accentBg: "rgba(0,200,255,0.08)",    label: "パッチノート" },
  "season-guide":     { icon: "🌍", accent: "#a78bfa", accentBg: "rgba(124,58,237,0.08)",   label: "シーズンガイド" },
  "shop-history-guide":{ icon: "🔁", accent: "#4ade80", accentBg: "rgba(74,222,128,0.08)",  label: "ショップ復刻" },
  "vbucks":           { icon: "💰", accent: "#fbbf24", accentBg: "rgba(251,191,36,0.08)",   label: "購入ガイド" },
};

function estimateRead(description: string): number {
  return Math.max(1, Math.ceil(description.length / 200) + 1);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}

function isNew(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;
}

function HeroCard({ a }: { a: ArticleCard }) {
  const meta = ARTICLE_META[a.slug] ?? ARTICLE_META["vbucks"];
  return (
    <a href={`/guides/${a.slug}`} className="hero-card" style={{ ["--accent" as string]: meta.accent }}>
      {a.image && (
        <div className="hero-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image} alt={a.title} className="hero-img" />
          <div className="hero-img-overlay" />
        </div>
      )}
      <div className="hero-body">
        <div className="hero-icon">{meta.icon}</div>
        <div className="hero-label">{meta.label}</div>
        <h2 className="hero-title">{a.title}</h2>
        <p className="hero-desc">{a.description}</p>
        <div className="hero-footer">
          {a.updatedAt && (
            <span className="hero-date">
              {isNew(a.updatedAt) && <span className="new-badge">NEW</span>}
              {formatDate(a.updatedAt)} 更新
            </span>
          )}
          <span className="hero-cta">
            読む <span style={{ fontSize: 16 }}>→</span>
          </span>
        </div>
      </div>
    </a>
  );
}

function SmallCard({ a }: { a: ArticleCard }) {
  const meta = ARTICLE_META[a.slug] ?? ARTICLE_META["vbucks"];
  return (
    <a href={`/guides/${a.slug}`} className="small-card" style={{ ["--accent" as string]: meta.accent }}>
      {a.image && (
        <div className="small-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image} alt={a.title} className="small-img" />
          <div className="small-img-overlay" />
          <span className="small-img-label">{meta.label}</span>
          {a.updatedAt && isNew(a.updatedAt) && (
            <span className="new-badge small-img-new">NEW</span>
          )}
        </div>
      )}
      {!a.image && (
        <div className="small-card-top">
          <span className="small-icon">{meta.icon}</span>
          <span className="small-label">{meta.label}</span>
          {a.updatedAt && isNew(a.updatedAt) && <span className="new-badge">NEW</span>}
        </div>
      )}
      <h2 className="small-title">{a.title}</h2>
      <p className="small-desc">{a.description}</p>
      <div className="small-footer">
        <span className="small-read">約{a.readMin}分</span>
        {a.updatedAt && <span className="small-date">{formatDate(a.updatedAt)} 更新</span>}
        <span className="small-cta">読む →</span>
      </div>
    </a>
  );
}

export default async function GuidesPage() {
  const [aiGuides, fallbackImage] = await Promise.all([
    listGuides(),
    fetchNewsImage(),
  ]);

  const staticCard: ArticleCard = {
    slug: "vbucks",
    title: "Vバックスの値段・お得な買い方完全ガイド",
    description:
      "1,000〜13,500 の価格一覧・クルーパックのコスパ比較・ギフトカード活用法まで。損しない買い方を全部まとめました。",
    icon: "💰",
    accent: "#fbbf24",
    accentBg: "rgba(251,191,36,0.08)",
    label: "購入ガイド",
    readMin: 3,
    image: fallbackImage ?? undefined,
  };

  const aiCards: ArticleCard[] = aiGuides.map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.description,
    updatedAt: g.updatedAt,
    ...(ARTICLE_META[g.slug] ?? { icon: "📄", accent: "#00c8ff", accentBg: "rgba(0,200,255,0.08)", label: "ガイド" }),
    readMin: estimateRead(g.description),
    image: g.featuredImage ?? fallbackImage ?? undefined,
  }));

  // 最新更新順に並べ、先頭をヒーロー表示
  const allCards = [...aiCards, staticCard].sort((a, b) => {
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const [hero, ...rest] = allCards.length > 0 ? allCards : [staticCard];

  return (
    <>
      <style>{`
        /* ヒーローカード */
        .hero-card {
          display: block;
          text-decoration: none;
          border-radius: 20px;
          margin-bottom: 20px;
          border: 1.5px solid color-mix(in srgb, var(--accent) 30%, transparent);
          background: linear-gradient(135deg,
            color-mix(in srgb, var(--accent) 6%, #070e1c) 0%,
            #070e1c 60%
          );
          position: relative;
          overflow: hidden;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .hero-card:hover {
          border-color: color-mix(in srgb, var(--accent) 60%, transparent);
          box-shadow: 0 0 28px color-mix(in srgb, var(--accent) 15%, transparent);
        }
        .hero-img-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, #070e1c 100%);
        }
        .hero-body {
          padding: 20px 24px 22px;
        }
        .hero-icon {
          font-size: 32px;
          line-height: 1;
          margin-bottom: 10px;
        }
        .hero-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 10px;
        }
        .hero-title {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 900;
          color: #e8f4ff;
          line-height: 1.35;
          margin: 0 0 12px;
        }
        .hero-desc {
          font-size: 13px;
          color: #6a8899;
          line-height: 1.75;
          margin: 0 0 20px;
          max-width: 560px;
        }
        .hero-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .hero-date {
          font-size: 12px;
          color: #445566;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          color: var(--accent);
          padding: 9px 22px;
          border-radius: 24px;
          border: 1.5px solid color-mix(in srgb, var(--accent) 40%, transparent);
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          transition: background 0.15s;
        }
        .hero-card:hover .hero-cta {
          background: color-mix(in srgb, var(--accent) 16%, transparent);
        }

        /* スモールカード画像 */
        .small-img-wrap {
          position: relative;
          width: 100%;
          height: 130px;
          overflow: hidden;
          border-radius: 10px;
          margin-bottom: 4px;
        }
        .small-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }
        .small-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(7,14,28,0.85) 100%);
        }
        .small-img-label {
          position: absolute;
          bottom: 8px;
          left: 10px;
          font-size: 10px;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .small-img-new {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        /* スモールカード */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .small-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          border-radius: 16px;
          padding: 18px 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .small-card:hover {
          border-color: color-mix(in srgb, var(--accent) 50%, transparent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 10%, transparent);
        }
        .small-card-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .small-icon {
          font-size: 20px;
          line-height: 1;
        }
        .small-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
        }
        .small-title {
          font-size: 14px;
          font-weight: 800;
          color: #d0e8f8;
          line-height: 1.45;
          margin: 0;
          flex: 1;
        }
        .small-desc {
          font-size: 12px;
          color: #4a6070;
          line-height: 1.7;
          margin: 0;
          flex: 1;
        }
        .small-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }
        .small-read {
          font-size: 11px;
          color: #334455;
          background: #0a1a26;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .small-date {
          font-size: 11px;
          color: #334455;
          flex: 1;
        }
        .small-cta {
          font-size: 12px;
          font-weight: 800;
          color: var(--accent);
        }

        /* NEW バッジ */
        .new-badge {
          font-size: 10px;
          font-weight: 900;
          padding: 2px 7px;
          border-radius: 10px;
          background: #ef4444;
          color: #fff;
          letter-spacing: 0.05em;
        }

        /* ページヘッダー */
        .page-header {
          margin-bottom: 24px;
        }
        .page-title {
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 900;
          color: var(--text);
          margin: 0 0 6px;
        }
        .page-sub {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0;
        }
        .section-label {
          font-size: 11px;
          font-weight: 800;
          color: #334455;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        @media (max-width: 480px) {
          .hero-card { padding: 20px 18px 18px; }
          .hero-title { font-size: 18px; }
        }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 48px" }}>

        <div className="page-header">
          <h1 className="page-title">📝 記事・ガイド</h1>
          <p className="page-sub">
            アップデート情報・シーズンガイド・お得な購入方法など、フォートナイトを楽しむための記事をまとめています。
          </p>
        </div>

        {/* 注目記事（最新順1位） */}
        <p className="section-label">注目記事</p>
        <HeroCard a={hero} />

        {/* その他の記事 */}
        {rest.length > 0 && (
          <>
            <p className="section-label" style={{ marginTop: 28 }}>その他の記事</p>
            <div className="cards-grid">
              {rest.map((a) => (
                <SmallCard key={a.slug} a={a} />
              ))}
            </div>
          </>
        )}

        {allCards.length === 0 && (
          <div style={{
            padding: 40, textAlign: "center", color: "var(--text-muted)",
            fontSize: 13, background: "var(--surface)", borderRadius: 16,
            border: "1px dashed var(--border)",
          }}>
            次回のフォートナイトアップデート後に記事が自動生成されます
          </div>
        )}
      </div>
    </>
  );
}
