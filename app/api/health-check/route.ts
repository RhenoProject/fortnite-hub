import { NextRequest, NextResponse } from "next/server";

type CheckResult = { name: string; ok: boolean; detail: string };

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // 1. ショップAPI
  try {
    const res = await fetch("https://fortnite-api.com/v2/shop?language=ja", {
      next: { revalidate: 0 },
    });
    const json = await res.json();
    const count: number = json?.data?.entries?.length ?? 0;
    results.push({ name: "ショップAPI", ok: count > 0, detail: `${count}件取得` });
  } catch (e) {
    results.push({ name: "ショップAPI", ok: false, detail: String(e) });
  }

  // 2. ニュースAPI
  try {
    const res = await fetch("https://fortnite-api.com/v2/news/br?language=ja", {
      next: { revalidate: 0 },
    });
    const json = await res.json();
    const count: number = json?.data?.motds?.length ?? 0;
    results.push({ name: "ニュースAPI", ok: count > 0, detail: `${count}件取得` });
  } catch (e) {
    results.push({ name: "ニュースAPI", ok: false, detail: String(e) });
  }

  // 3. 環境変数チェック（プッシュ通知）
  const vapidOk =
    !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    !!process.env.VAPID_PRIVATE_KEY &&
    !!process.env.VAPID_SUBJECT;
  results.push({
    name: "プッシュ通知設定",
    ok: vapidOk,
    detail: vapidOk ? "VAPID鍵OK" : "VAPID鍵が未設定",
  });

  // 4. Firebase設定（GOOGLE_SERVICE_ACCOUNT_KEY がJSON文字列として設定されているか）
  let firebaseOk = false;
  let firebaseDetail = "GOOGLE_SERVICE_ACCOUNT_KEYが未設定";
  try {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (raw) {
      const parsed = JSON.parse(raw);
      firebaseOk = !!parsed.project_id && !!parsed.client_email && !!parsed.private_key;
      firebaseDetail = firebaseOk ? `認証情報OK (${parsed.project_id})` : "JSONのキーが不足";
    }
  } catch {
    firebaseDetail = "GOOGLE_SERVICE_ACCOUNT_KEYのJSON解析失敗";
  }
  results.push({ name: "Firebase設定", ok: firebaseOk, detail: firebaseDetail });

  // 5. Discord Webhook設定
  const discordOk = !!process.env.DISCORD_WEBHOOK_URL;
  results.push({
    name: "Discord Webhook",
    ok: discordOk,
    detail: discordOk ? "設定OK" : "DISCORD_WEBHOOK_URLが未設定",
  });

  return results;
}

async function handleRequest(req: NextRequest) {
  if (
    process.env.CRON_SECRET &&
    req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "DISCORD_WEBHOOK_URL not set" }, { status: 503 });
  }

  const results = await runChecks();
  const allOk = results.every((r) => r.ok);
  const failedItems = results.filter((r) => !r.ok);

  const jstNow = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [];

  if (allOk) {
    lines.push(`✅ **ヘルスチェック — 異常なし**（${jstNow}）`);
    lines.push("");
    results.forEach((r) => lines.push(`・${r.name}：${r.detail}`));
    lines.push("");
    lines.push("本日のデイリーオペレーションを開始します。");
  } else {
    lines.push(`🚨 **ヘルスチェック — ${failedItems.length}件の問題を検出**（${jstNow}）`);
    lines.push("");
    lines.push("**❌ 要対応項目**");
    failedItems.forEach((r) => lines.push(`・${r.name}：${r.detail}`));
    lines.push("");
    lines.push("**✅ 正常項目**");
    results.filter((r) => r.ok).forEach((r) => lines.push(`・${r.name}：${r.detail}`));
    lines.push("");
    lines.push("⚠️ しゅうやCEOへ：上記の問題を確認してください。");
  }

  const message = { content: lines.join("\n") };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Discord webhook failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: allOk, results });
}

export const GET = handleRequest;
export const POST = handleRequest;
