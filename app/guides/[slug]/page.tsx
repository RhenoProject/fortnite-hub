import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, type GuideSection } from "@/lib/guideContent";

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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return { title: "ガイド | フォトナHub" };
  return {
    title: `${guide.title} | フォトナHub`,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: `${guide.title} | フォトナHub`,
      description: guide.description,
      url: `https://fortnite-hub-delta.vercel.app/guides/${slug}`,
    },
    alternates: { canonical: `https://fortnite-hub-delta.vercel.app/guides/${slug}` },
  };
}

function estimateReadTime(sections: GuideSection[]): number {
  const text = sections
    .flatMap((s) => [s.text ?? "", ...(s.items ?? [])])
    .join(" ");
  return Math.max(1, Math.ceil(text.length / 400));
}

function Section({ s, index }: { s: GuideSection; index: number }) {
  switch (s.type) {
    case "h2":
      return (
        <h2
          id={`section-${index}`}
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "var(--text)",
            margin: "36px 0 14px",
            paddingLeft: 14,
            borderLeft: "3px solid #00c8ff",
            lineHeight: 1.4,
          }}
        >
          {s.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "var(--text)",
            margin: "22px 0 8px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: "#00c8ff", fontSize: 13 }}>▸</span>
          {s.text}
        </h3>
      );
    case "p":
      return (
        <p
          style={{
            fontSize: 14,
            color: "#b0c4d8",
            lineHeight: 2,
            margin: "0 0 14px",
          }}
        >
          {s.text}
        </p>
      );
    case "ul":
      return (
        <ul
          style={{
            margin: "0 0 16px",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {(s.items ?? []).map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 14,
                color: "#b0c4d8",
                lineHeight: 1.7,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: 5,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00c8ff",
                  display: "inline-block",
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div
          style={{
            background: "rgba(0,200,255,0.06)",
            border: "1px solid rgba(0,200,255,0.2)",
            borderRadius: 10,
            padding: "14px 16px",
            margin: "0 0 16px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
          <p style={{ fontSize: 13, color: "#9ab8cc", lineHeight: 1.75, margin: 0 }}>
            {s.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

const GUIDE_LINKS = [
  { slug: "patch-notes", label: "最新パッチノート" },
  { slug: "season-guide", label: "シーズンガイド" },
  { slug: "shop-history-guide", label: "復刻スキンガイド" },
];

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const featuredImage = guide.featuredImage ?? await fetchNewsImage();
  const updatedDate = new Date(guide.updatedAt).toLocaleDateString("ja-JP");
  const readMin = estimateReadTime(guide.sections);
  const h2s = guide.sections.filter((s) => s.type === "h2");

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 0 48px" }}>

      {/* ヘッダーバナー */}
      <div
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2040 60%, #0a1628 100%)",
          borderBottom: "1px solid rgba(0,200,255,0.15)",
          padding: "28px 20px 24px",
          marginBottom: 0,
        }}
      >
        {/* パンくず */}
        <nav style={{ fontSize: 12, color: "#556677", marginBottom: 14 }}>
          <a href="/" style={{ color: "#556677", textDecoration: "none" }}>フォトナHub</a>
          {" › "}
          <a href="/guides/vbucks" style={{ color: "#556677", textDecoration: "none" }}>ガイド</a>
          {" › "}
          <span style={{ color: "#8899aa" }}>{guide.title}</span>
        </nav>

        {/* バッジ行 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
              background: "rgba(124,58,237,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            🤖 AI生成
          </span>
          <span style={{ fontSize: 12, color: "#556677" }}>更新: {updatedDate}</span>
          <span style={{ fontSize: 12, color: "#556677" }}>📖 約{readMin}分で読める</span>
        </div>

        {/* タイトル */}
        <h1
          style={{
            fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: 900,
            color: "#e8f4ff",
            lineHeight: 1.3,
            margin: "0 0 12px",
          }}
        >
          {guide.title}
        </h1>
        <p style={{ fontSize: 14, color: "#6a8899", lineHeight: 1.7, margin: 0 }}>
          {guide.description}
        </p>
      </div>

      {/* フィーチャー画像 */}
      {featuredImage && (
        <div style={{ position: "relative", width: "100%", maxHeight: 220, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredImage}
            alt={guide.title}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 30%, #070e1c 100%)",
            }}
          />
        </div>
      )}

      {/* 他のガイドへのクイックリンク */}
      <div
        style={{
          borderBottom: "1px solid #0d1f30",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <span style={{ fontSize: 11, color: "#445566", flexShrink: 0, fontWeight: 700 }}>ガイド:</span>
        {GUIDE_LINKS.filter((g) => g.slug !== slug).map((g) => (
          <a
            key={g.slug}
            href={`/guides/${g.slug}`}
            style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 20,
              background: "#0a1628",
              border: "1px solid #0d2540",
              color: "#7aa8c0",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {g.label}
          </a>
        ))}
        <a
          href="/guides/vbucks"
          style={{
            flexShrink: 0,
            fontSize: 12,
            fontWeight: 700,
            padding: "5px 12px",
            borderRadius: 20,
            background: "#0a1628",
            border: "1px solid #0d2540",
            color: "#7aa8c0",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Vバックス購入ガイド
        </a>
      </div>

      {/* 目次（h2が2個以上のとき） */}
      {h2s.length >= 2 && (
        <div
          style={{
            background: "#070f1c",
            borderBottom: "1px solid #0d1f30",
            padding: "16px 20px",
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 800, color: "#445566", letterSpacing: "0.08em", margin: "0 0 10px", textTransform: "uppercase" }}>
            目次
          </p>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {h2s.map((s, i) => (
              <li key={i}>
                <a
                  href={`#section-${guide.sections.indexOf(s)}`}
                  style={{
                    fontSize: 13,
                    color: "#4a9bb0",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#1e3a4a", fontWeight: 700, minWidth: 18, fontSize: 11 }}>{i + 1}.</span>
                  {s.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 本文 */}
      <div style={{ padding: "8px 20px 0" }}>
        {guide.sections.map((s, i) => (
          <Section key={i} s={s} index={i} />
        ))}
      </div>

      {/* Xシェアボタン */}
      {(() => {
        const url = `https://fortnite-hub-delta.vercel.app/guides/${slug}`;
        const text = `${guide.title} #フォートナイト #Fortnite`;
        return (
          <div style={{ padding: "24px 20px 0" }}>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 10,
                background: "#000",
                border: "1px solid #333",
                color: "#fff",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              Xでシェア
            </a>
          </div>
        );
      })()}

      {/* 免責 */}
      <div
        style={{
          margin: "28px 20px 0",
          padding: "14px 16px",
          background: "#060e1a",
          border: "1px solid #0d1f2e",
          borderRadius: 10,
          fontSize: 12,
          color: "#445566",
          lineHeight: 1.7,
        }}
      >
        このページの内容はAIが公式ニュースをもとに自動生成しています。最新・正確な情報は
        <a href="https://www.epicgames.com/fortnite/ja/" target="_blank" rel="noopener noreferrer" style={{ color: "#00c8ff" }}>
          Epic Games公式サイト
        </a>
        でご確認ください。
      </div>

      {/* 下部リンク（トップへ戻る） */}
      <div style={{ padding: "28px 20px 0", textAlign: "center" }}>
        <a
          href="/"
          style={{
            fontSize: 13,
            color: "#445566",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← フォトナHub トップへ
        </a>
      </div>
    </div>
  );
}
