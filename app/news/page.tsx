import { fetchFortniteNews } from "@/lib/fortniteApi";
import { NewsClient } from "@/components/NewsClient";
import type { Metadata } from "next";

export const revalidate = 300;

async function getOgImage(): Promise<string> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/news?language=ja", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const first = (json.data?.br?.motds ?? []).find(
        (m: any) => !m.hidden && (m.tileImage || m.image)
      );
      if (first) return first.tileImage || first.image;
    }
  } catch {}
  return "/og-image.jpg";
}

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = await getOgImage();
  return {
    title: "フォートナイト 最新ニュース | フォトナHub",
    description: "フォートナイトの最新ニュース・イベント・シーズン情報をいち早くチェック。バトルロイヤル・クリエイティブ・コラボ情報を日本語でまとめて確認。",
    openGraph: {
      title: "フォートナイト 最新ニュース | フォトナHub",
      description: "フォートナイトの最新ニュース・イベント・シーズン情報を日本語でチェック。",
      images: [{ url: ogImage, width: 1920, height: 1080, alt: "フォートナイト最新ニュース" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "フォートナイト 最新ニュース | フォトナHub",
      description: "フォートナイトの最新ニュース・イベント・シーズン情報を日本語でチェック。",
      images: [ogImage],
    },
  };
}

export default async function NewsPage() {
  let items = await fetchFortniteNews().catch(() => []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "4px" }}>
          📰 フォートナイト最新ニュース
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          タップで詳細を読めます
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <NewsClient items={items} />
      )}
    </div>
  );
}
