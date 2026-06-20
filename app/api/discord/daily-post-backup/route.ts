import { NextRequest, NextResponse } from "next/server";

// バックアップCron（09:30 JST）- メインが失敗した日だけ送信する
// 実際の送信ロジックはメインルートに委譲してコードの重複を避ける
async function handleRequest(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // メインルートを内部呼び出し（MANUAL_TRIGGER_KEYを使って重複チェックをスキップしない）
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://fortnite-hub-delta.vercel.app";

  const res = await fetch(`${baseUrl}/api/discord/daily-post`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  const body = await res.json().catch(() => ({}));
  return NextResponse.json({ backup: true, result: body }, { status: res.ok ? 200 : 500 });
}

export const GET = handleRequest;
export const POST = handleRequest;
