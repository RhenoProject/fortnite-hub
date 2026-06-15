import { NextRequest, NextResponse } from "next/server";

// 全コスメ一覧を6時間キャッシュして取得し、サーバー側でフィルタリング
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ items: [] });

  const res = await fetch(
    "https://fortnite-api.com/v2/cosmetics/br?language=ja",
    { next: { revalidate: 21600 } }
  );

  if (!res.ok) return NextResponse.json({ items: [] });

  const json = await res.json();
  const lower = q.toLowerCase();

  const items = (json.data ?? [])
    .filter((item: any) => item.name?.toLowerCase().startsWith(lower))
    .slice(0, 40)
    .map((item: any) => ({
      id: item.id,
      name: item.name ?? "",
      image: item.images?.featured ?? item.images?.icon ?? item.images?.smallIcon ?? "",
      rarity: item.rarity?.value ?? "common",
      typeDisplay: item.type?.displayValue ?? "",
    }));

  return NextResponse.json({ items });
}
