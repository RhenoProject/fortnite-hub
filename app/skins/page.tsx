import type { Metadata } from "next";
import { SkinsClient } from "./SkinsClient";

export const metadata: Metadata = {
  title: "フォートナイト スキン・コスメティック一覧 | フォトナHub",
  description:
    "フォートナイトの全スキン・コスメティック一覧。コスチューム、バックアクセサリー、収穫ツール、グライダー、エモートなど全種類を検索・確認できます。毎日更新。",
  openGraph: {
    title: "フォートナイト スキン一覧 | フォトナHub",
    description: "フォートナイトの全スキン・コスメティック一覧。毎日更新。",
    url: "https://fortnite-hub-delta.vercel.app/skins",
    type: "website",
  },
  alternates: {
    canonical: "https://fortnite-hub-delta.vercel.app/skins",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "フォートナイト スキン・コスメティック一覧",
  description: "フォートナイトの全スキン・コスメティック一覧",
  url: "https://fortnite-hub-delta.vercel.app/skins",
};

export default function SkinsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkinsClient />
    </>
  );
}
