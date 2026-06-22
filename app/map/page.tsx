import type { Metadata } from "next";
import { fetchMap } from "@/lib/fortniteApi";
import { MapClient } from "./MapClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "フォートナイト マップ・POI一覧 | フォトナHub",
  description: "フォートナイト最新マップとPOI（地名・名所）一覧。現シーズンのマップをチェック。ヒートウェーブ・ハーバーなど全ロケーションを確認できます。",
  openGraph: {
    title: "フォートナイト マップ・POI一覧 | フォトナHub",
    description: "フォートナイト最新マップとPOI一覧。現シーズンの全ロケーションを確認。",
    url: "https://fortnite-hub-delta.vercel.app/map",
  },
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/map" },
};

export default async function MapPage() {
  const mapData = await fetchMap().catch(() => null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "フォートナイト マップ・POI一覧",
    description: "フォートナイト最新マップとPOI一覧",
    url: "https://fortnite-hub-delta.vercel.app/map",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MapClient mapData={mapData} />
    </div>
  );
}
