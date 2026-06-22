import type { MetadataRoute } from "next";

function recentShopDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const shopDates = recentShopDates(30);

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
      lastModified: new Date("2026-06-19"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/skins",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/competition",
      lastModified: new Date("2026-06-20"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://fortnite-hub-delta.vercel.app/info",
      lastModified: new Date("2026-06-16"),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // 過去30日分の日別ショップページ（SEO蓄積）
    ...shopDates.map((date, i) => ({
      url: `https://fortnite-hub-delta.vercel.app/shop/${date}`,
      lastModified: new Date(date),
      changeFrequency: (i === 0 ? "daily" : "never") as "daily" | "never",
      priority: i === 0 ? 0.9 : 0.6,
    })),
  ];
}
