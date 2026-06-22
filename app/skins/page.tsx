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

export interface SlimCosmetic {
  id: string;
  name: string;
  type: string;
  typeDisplay: string;
  rarity: string;
  rarityDisplay: string;
  image: string;
}

export const revalidate = 21600; // 6 hours

async function fetchAllCosmetics(): Promise<SlimCosmetic[]> {
  try {
    const res = await fetch(
      "https://fortnite-api.com/v2/cosmetics/br?language=ja",
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? [])
      .map((item: any) => ({
        id: item.id,
        name: item.name ?? "",
        type: item.type?.value ?? "outfit",
        typeDisplay: item.type?.displayValue ?? "コスチューム",
        rarity: item.rarity?.value ?? "common",
        rarityDisplay: item.rarity?.displayValue ?? "コモン",
        image:
          item.images?.smallIcon ??
          item.images?.icon ??
          "",
      }))
      .filter((c: SlimCosmetic) => c.name && c.image);
  } catch {
    return [];
  }
}

export default async function SkinsPage() {
  const cosmetics = await fetchAllCosmetics();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "フォートナイト スキン・コスメティック一覧",
    description: "フォートナイトの全スキン・コスメティック一覧",
    url: "https://fortnite-hub-delta.vercel.app/skins",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkinsClient cosmetics={cosmetics} />
    </>
  );
}
