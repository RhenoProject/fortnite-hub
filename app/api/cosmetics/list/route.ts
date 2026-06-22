import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 80;

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") ?? "all";
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10);

  const res = await fetch(
    "https://fortnite-api.com/v2/cosmetics/br?language=ja",
    { next: { revalidate: 21600 } }
  );

  if (!res.ok) return NextResponse.json({ items: [], total: 0, page, hasMore: false });

  const json = await res.json();
  const lower = q.trim().toLowerCase();

  const filtered = (json.data ?? []).filter((item: any) => {
    if (!item.name || !item.images?.smallIcon) return false;
    if (type !== "all" && item.type?.value !== type) return false;
    if (lower && !item.name.toLowerCase().includes(lower)) return false;
    return true;
  });

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE).map((item: any) => ({
    id: item.id,
    name: item.name ?? "",
    type: item.type?.value ?? "outfit",
    typeDisplay: item.type?.displayValue ?? "",
    rarity: item.rarity?.value ?? "common",
    rarityDisplay: item.rarity?.displayValue ?? "コモン",
    image: item.images?.smallIcon ?? item.images?.icon ?? "",
  }));

  return NextResponse.json({
    items,
    total,
    page,
    hasMore: start + PAGE_SIZE < total,
  });
}
