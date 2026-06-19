import { NextResponse } from "next/server";

const IMG_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Referer": "https://www.amazon.co.jp/",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

async function proxyImage(url: string, ms = 4000): Promise<NextResponse> {
  const res = await withTimeout(fetch(url, { headers: IMG_HEADERS }), ms);
  const ct = res.headers.get("content-type") ?? "";
  if (!res.ok || !ct.startsWith("image/")) throw new Error("not_image");
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": ct,
      "Cache-Control": "public, max-age=604800, s-maxage=604800",
    },
  });
}

async function extractImageUrlFromHtml(html: string): Promise<string | null> {
  const match =
    // hiRes — 最高画質（最優先）
    html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
    // large
    html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
    // data-old-hires属性
    html.match(/data-old-hires="(https:\/\/[^"]+)"/) ||
    // landingImage src
    html.match(/id="landingImage"[^>]+src="(https:\/\/m\.media-amazon\.com\/[^"]+)"/) ||
    // og:image
    html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);

  if (!match?.[1]) return null;
  // _AC_SL1500_ で最高画質に統一
  return match[1].replace(/\._[A-Z0-9_,]+_\./g, "._AC_SL1500_.");
}

async function tryPageScrape(asin: string, url: string, ua: string): Promise<NextResponse> {
  const res = await withTimeout(
    fetch(url, {
      headers: {
        "User-Agent": ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja-JP,ja;q=0.9",
      },
    }),
    5000
  );
  if (!res.ok) throw new Error("page_fail");

  const html = await res.text();

  // ボット検知ページはスキップ
  if (
    html.includes("api-services-support@amazon.com") ||
    html.includes("robot check") ||
    html.includes("Type the characters") ||
    html.length < 5000
  ) {
    throw new Error("captcha");
  }

  const imageUrl = await extractImageUrlFromHtml(html);
  if (!imageUrl) throw new Error("no_match");

  return proxyImage(imageUrl);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return new NextResponse(null, { status: 400 });
  }

  const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";
  const mobileUA  = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

  // Strategy 1: PCページでhiRes取得（最高画質）
  try {
    return await tryPageScrape(asin, `https://www.amazon.co.jp/dp/${asin}`, desktopUA);
  } catch {}

  // Strategy 2: モバイルページ（ボット検知が異なる場合がある）
  try {
    return await tryPageScrape(asin, `https://www.amazon.co.jp/gp/aw/d/${asin}`, mobileUA);
  } catch {}

  // Strategy 3: 直接CDN URL（フォールバック）
  const cdnPatterns = [
    `https://m.media-amazon.com/images/P/${asin}.09._AC_SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.01._AC_SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.09._SL1500_.jpg`,
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`,
  ];

  for (const url of cdnPatterns) {
    try {
      return await proxyImage(url, 3000);
    } catch {}
  }

  return new NextResponse(null, { status: 404 });
}
