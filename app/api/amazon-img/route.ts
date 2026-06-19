import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asin = searchParams.get("asin");

  if (!asin || !/^[A-Z0-9]{10}$/.test(asin)) {
    return new NextResponse(null, { status: 400 });
  }

  // Amazonの商品ページからog:image / hiRes画像URLを取得（サーバー側）
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
        html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
        html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);

      if (match?.[1]) {
        // 最高画質に変換
        imageUrl = match[1].replace(/\._[A-Z0-9_,]+_\./g, "._AC_SL1500_.");
      }
    }
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  if (!imageUrl) return new NextResponse(null, { status: 404 });

  // 画像バイトをサーバー経由でプロキシ（ホットリンク規制を回避）
  try {
    const imgRes = await fetch(imageUrl, {
      headers: {
        "Referer": "https://www.amazon.co.jp/",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imgRes.ok) return new NextResponse(null, { status: 404 });

    return new NextResponse(imgRes.body, {
      headers: {
        "Content-Type": imgRes.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
