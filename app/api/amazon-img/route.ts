import { NextResponse } from "next/server";

const IMG_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Referer": "https://www.amazon.co.jp/",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "ja-JP,ja;q=0.9",
};

async function tryFetchImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: IMG_HEADERS });
    const ct = res.headers.get("content-type") ?? "";
    if (res.ok && ct.startsWith("image/")) return res;
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return new NextResponse(null, { status: 400 });
  }

  // Strategy 1: 直接CDN URLを順番に試す（高速・ページスクレイピング不要）
  const cdnUrls = [
    `https://m.media-amazon.com/images/P/${asin}.09._AC_SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.01._AC_SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.09._SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
  ];

  for (const url of cdnUrls) {
    const imgRes = await tryFetchImage(url);
    if (imgRes) {
      return new NextResponse(imgRes.body, {
        headers: {
          "Content-Type": imgRes.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=604800, s-maxage=604800",
        },
      });
    }
  }

  // Strategy 2: Amazon商品ページをスクレイピングしてhiRes/og:imageを取得
  let imageUrl: string | null = null;
  try {
    const pageRes = await fetch(`https://www.amazon.co.jp/dp/${asin}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "ja-JP,ja;q=0.9",
      },
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      const match =
        html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
        html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
        html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
        html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);

      if (match?.[1]) {
        imageUrl = match[1].replace(/\._[A-Z0-9_,]+_\./g, "._AC_SL1500_.");
      }
    }
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!imageUrl) return new NextResponse(null, { status: 404 });

  const imgRes = await tryFetchImage(imageUrl);
  if (!imgRes) return new NextResponse(null, { status: 404 });

  return new NextResponse(imgRes.body, {
    headers: {
      "Content-Type": imgRes.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=604800, s-maxage=604800",
    },
  });
}
