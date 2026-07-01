import type { MetadataRoute } from "next";
import { fetchRecentOutfits } from "@/lib/fortniteApi";
import { listGuides } from "@/lib/guideContent";

function recentShopDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shopDates = recentShopDates(30);
  const [outfits, guides] = await Promise.all([
    fetchRecentOutfits(200).catch(() => []),
    listGuides().catch(() => []),
  ]);

  return [
    {
      url: "https://fortnite-hub-delta.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/news",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/devices",
      lastModified: new Date("2026-06-29"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/competition",
      lastModified: new Date("2026-06-29"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/info",
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // V-Bucks ガイド（静的）
    {
      url: "https://fortnite-hub-delta.vercel.app/guides/vbucks",
      lastModified: new Date("2026-07-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // AI生成ガイド記事
    ...guides.map(({ slug, updatedAt }) => ({
      url: `https://fortnite-hub-delta.vercel.app/guides/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // 過去30日分の日別ショップページ
    ...shopDates.map((date, i) => ({
      url: `https://fortnite-hub-delta.vercel.app/shop/${date}`,
      lastModified: new Date(date),
      changeFrequency: (i === 0 ? "daily" : "never") as "daily" | "never",
      priority: i === 0 ? 0.9 : 0.6,
    })),
    // 最新コスチューム200件
    ...outfits.map(({ id, added }) => ({
      url: `https://fortnite-hub-delta.vercel.app/cosmetics/${id}`,
      lastModified: new Date(added),
      changeFrequency: "never" as const,
      priority: 0.6,
    })),
  ];
}
