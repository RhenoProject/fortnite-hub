import { fetchGameVersion, fetchFortniteNews } from "@/lib/fortniteApi";
import { UpdatesClient } from "@/components/UpdatesClient";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "フォートナイト 最新アップデート・パッチノート情報 | フォトナHub",
  description: "フォートナイトの最新アップデート情報・パッチノート・新機能・武器変更・イベント情報をまとめてチェック。新シーズン・バランス調整もここで確認。",
  openGraph: {
    title: "フォートナイト 最新アップデート・パッチノート | フォトナHub",
    description: "フォートナイトの最新アップデート情報・パッチノート・新機能・武器変更をまとめてチェック。",
    url: "https://fortnite-hub-delta.vercel.app/updates",
  },
  alternates: {
    canonical: "https://fortnite-hub-delta.vercel.app/updates",
  },
};

export default async function UpdatesPage() {
  const [version, allNews] = await Promise.all([
    fetchGameVersion().catch(() => null),
    fetchFortniteNews().catch(() => []),
  ]);

  const brNews = allNews.filter((n) => n.category === "br");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "フォートナイト 最新アップデート・パッチノート情報",
    description: "フォートナイトの最新アップデート・パッチノート情報",
    url: "https://fortnite-hub-delta.vercel.app/updates",
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UpdatesClient version={version} brNews={brNews} />
    </div>
  );
}
