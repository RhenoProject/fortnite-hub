import { NextResponse } from "next/server";

const cache = new Map<string, { url: string; ts: number }>();
const TTL = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return NextResponse.json({ url: null }, { status: 400 });
  }

  const cached = cache.get(asin);
  if (cached && Date.now() - cached.ts < TTL) {
    return NextResponse.json({ url: cached.url });
  }

  try {
    const res = await fetch(`https://www.amazon.co.jp/dp/${asin}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9",
        "Accept": "text/html,application/xhtml+xml",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return NextResponse.json({ url: null });

    const html = await res.text();

    const match =
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i) ||
      html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);

    const rawUrl = match?.[1] ?? null;
    if (!rawUrl) return NextResponse.json({ url: null });

    // 最高画質に変換
    const url = rawUrl.replace(/\._[A-Z0-9_,]+_\./, "._AC_SL1500_.");

    cache.set(asin, { url, ts: Date.now() });
    return NextResponse.json({ url }, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ url: null });
  }
}
