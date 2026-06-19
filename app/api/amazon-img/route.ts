import { NextResponse } from "next/server";

const PAGE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ja-JP,ja;q=0.9",
};

const IMG_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Referer": "https://www.amazon.co.jp/",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

// Amazon商品ページからhiRes/og:image URLを取得してプロキシ（最高画質）
async function imageFromPage(asin: string): Promise<{ body: ReadableStream; ct: string }> {
  const res = await withTimeout(
    fetch(`https://www.amazon.co.jp/dp/${asin}`, { headers: PAGE_HEADERS }),
    5000
  );
  if (!res.ok) throw new Error("page_fail");

  const html = await res.text();
  if (html.includes("api-services-support@amazon.com") || html.includes("robot check")) {
    throw new Error("captcha");
  }

  const match =
    html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
    html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/) ||
    html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
    html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);

  if (!match?.[1]) throw new Error("no_match");

  // 最高画質に置換
  const imageUrl = match[1].replace(/\._[A-Z0-9_,]+_\./g, "._AC_SL1500_.");
  const imgRes = await withTimeout(fetch(imageUrl, { headers: IMG_HEADERS }), 3000);
  const ct = imgRes.headers.get("content-type") ?? "";
  if (!imgRes.ok || !ct.startsWith("image/")) throw new Error("img_fail");

  return { body: imgRes.body as ReadableStream, ct };
}

// 直接CDN URLでフェッチ（高速・ページ取得不要）
async function imageFromCDN(url: string): Promise<{ body: ReadableStream; ct: string }> {
  const res = await withTimeout(fetch(url, { headers: IMG_HEADERS }), 2000);
  const ct = res.headers.get("content-type") ?? "";
  // content-lengthが極端に小さい場合はAmazonのno-image placeholder
  const len = Number(res.headers.get("content-length") ?? "99999");
  if (!res.ok || !ct.startsWith("image/") || len < 2000) throw new Error("cdn_fail");
  return { body: res.body as ReadableStream, ct };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return new NextResponse(null, { status: 400 });
  }

  // 3つを並列実行 — 最初に成功したものを使う
  try {
    const { body, ct } = await Promise.any([
      imageFromPage(asin),
      imageFromCDN(`https://m.media-amazon.com/images/P/${asin}.09._AC_SL1500_.jpg`),
      imageFromCDN(`https://m.media-amazon.com/images/P/${asin}.01._AC_SL1500_.jpg`),
    ]);

    return new NextResponse(body, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
