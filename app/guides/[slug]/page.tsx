import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, type GuideSection } from "@/lib/guideContent";

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

function Section({ s }: { s: GuideSection }) {
  switch (s.type) {
    case 'h2':
      return (
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", margin: "28px 0 12px" }}>
          {s.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", margin: "20px 0 8px" }}>
          {s.text}
        </h3>
      );
    case 'p':
      return (
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, margin: "0 0 12px" }}>
          {s.text}
        </p>
      );
    case 'ul':
      return (
        <ul style={{ paddingLeft: 20, margin: "0 0 12px", color: "var(--text-muted)", lineHeight: 2, fontSize: 14 }}>
          {(s.items ?? []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'note':
      return (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "12px 16px",
          fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: "0 0 12px",
        }}>
          {s.text}
        </div>
      );
    default:
      return null;
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const updatedDate = new Date(guide.updatedAt).toLocaleDateString("ja-JP");

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      {/* パンくず */}
      <nav style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
        <a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>フォトナHub</a>
        {" › "}
        <span>{guide.title}</span>
      </nav>

      {/* AIバッジ */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
          background: "#7c3aed22", color: "#a78bfa", border: "1px solid #7c3aed44",
        }}>
          🤖 AI生成コンテンツ
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>最終更新: {updatedDate}</span>
      </div>

      <h1 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 900, color: "var(--text)", lineHeight: 1.3, marginBottom: 8 }}>
        {guide.title}
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.7 }}>
        {guide.description}
      </p>

      {guide.sections.map((s, i) => (
        <Section key={i} s={s} />
      ))}

      <div style={{ marginTop: 40, padding: "16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
        このページの内容はAIが自動生成しています。情報は最善を尽くして正確に維持していますが、
        最新情報は<a href="https://www.epicgames.com/fortnite/ja/" target="_blank" rel="noopener noreferrer" style={{ color: "#00c8ff" }}>Epic Games公式サイト</a>でご確認ください。
      </div>
    </div>
  );
}
