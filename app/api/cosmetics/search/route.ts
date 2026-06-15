import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 2) return NextResponse.json({ items: [] });

  const res = await fetch(
    `https://fortnite-api.com/v2/cosmetics/br/search/all?name=${encodeURIComponent(q)}&language=ja&matchMethod=starts`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return NextResponse.json({ items: [] });

  const json = await res.json();
  const items = (json.data ?? []).slice(0, 40).map((item: any) => ({
    id: item.id,
    name: item.name ?? "",
    image: item.images?.featured ?? item.images?.icon ?? item.images?.smallIcon ?? "",
    rarity: item.rarity?.value ?? "common",
    typeDisplay: item.type?.displayValue ?? "",
  }));

  return NextResponse.json({ items });
}
