import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchShop, ShopItem } from "@/lib/shopApi";

const TWEET_URL = "https://api.twitter.com/2/tweets";
const SITE_URL = "https://fortnite-hub-delta.vercel.app";

function pct(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21").replace(/'/g, "%27")
    .replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
}

function buildOAuthHeader(
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string
): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map((k) => `${pct(k)}=${pct(oauthParams[k])}`)
    .join("&");

  const sigBase = [
    "POST",
    pct(TWEET_URL),
    pct(sortedParams),
  ].join("&");

  const sigKey = `${pct(consumerSecret)}&${pct(accessTokenSecret)}`;
  const signature = crypto.createHmac("sha1", sigKey).update(sigBase).digest("base64");

  oauthParams.oauth_signature = signature;

  return (
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${pct(k)}="${pct(oauthParams[k])}"`)
      .join(", ")
  );
}

function buildTweetText(entries: Awaited<ReturnType<typeof fetchShop>>): string {
  const today = new Date().toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Tokyo",
  });

  const featuredItems = entries
    .filter((e): e is ShopItem => e.kind === "item" && e.featured)
    .slice(0, 3);

  const totalCount = entries.length;

  const lines: string[] = [
    `🛍️ 今日のフォートナイトショップ（${today}）`,
    "",
  ];

  if (featuredItems.length > 0) {
    lines.push("⭐ 注目アイテム");
    featuredItems.forEach((item) => {
      const name = item.name.length > 16 ? item.name.slice(0, 15) + "…" : item.name;
      lines.push(`・${name}（${item.price.toLocaleString()}V）`);
    });
    lines.push("");
  }

  lines.push(`他${totalCount}点のアイテムはこちら👇`);
  lines.push(SITE_URL);
  lines.push("");
  lines.push("#フォートナイト #Fortnite #アイテムショップ");

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  if (
    process.env.CRON_SECRET &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consumerKey = process.env.X_API_KEY;
  const consumerSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return NextResponse.json(
      { error: "X API credentials not configured — set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET in Vercel env vars" },
      { status: 503 }
    );
  }

  try {
    const entries = await fetchShop();
    const text = buildTweetText(entries);

    const authHeader = buildOAuthHeader(consumerKey, consumerSecret, accessToken, accessTokenSecret);

    const res = await fetch(TWEET_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Twitter API error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, tweet_id: data.data?.id, text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
