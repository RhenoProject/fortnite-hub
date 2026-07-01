import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";
import { fetchCurrentBuild, extractVersion, runGenerateGuide } from "@/lib/generateGuide";

export const maxDuration = 120;

const STATE_DOC = "app_state/game_version";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_UPDATE;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  return !!(secret && auth === `Bearer ${secret}`);
}

async function getLastKnownBuild(): Promise<string | null> {
  try {
    const db = getDb();
    const ref = db.doc(STATE_DOC);
    const snap = await ref.get();
    return snap.exists ? (snap.data()?.build ?? null) : null;
  } catch {
    return null;
  }
}

async function saveCurrentBuild(build: string): Promise<void> {
  const db = getDb();
  await db.doc(STATE_DOC).set({ build, updatedAt: new Date().toISOString() });
}

async function notifyDiscord(
  version: string,
  results: { slug: string; title: string; success: boolean; imageUrl?: string }[]
) {
  if (!DISCORD_WEBHOOK) return;

  const siteUrl = "https://fortnite-hub-delta.vercel.app";
  const successResults = results.filter((r) => r.success);
  const featuredImage = successResults.find((r) => r.imageUrl)?.imageUrl;

  const fields = results.map((r) => ({
    name: r.success ? "✅ 記事更新" : "❌ 生成失敗",
    value: r.success
      ? `[${r.title}](${siteUrl}/guides/${r.slug})`
      : r.slug,
    inline: false,
  }));

  const embed = {
    title: `🎮 フォートナイト v${version} アップデート！`,
    description: `フォトナHubの記事を自動更新しました。\n最新情報をチェックしよう！`,
    url: siteUrl,
    color: 0x00c8ff,
    fields,
    ...(featuredImage ? { image: { url: featuredImage } } : {}),
    footer: {
      text: "フォトナHub • 自動通知",
      icon_url: `${siteUrl}/icon.png`,
    },
    timestamp: new Date().toISOString(),
  };

  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}

async function handleRequest(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentBuild = await fetchCurrentBuild();
  if (!currentBuild) {
    return NextResponse.json({ updated: false, reason: "AES fetch failed" });
  }

  const lastBuild = await getLastKnownBuild();

  if (lastBuild === currentBuild) {
    return NextResponse.json({ updated: false, build: currentBuild });
  }

  // バージョンが変わった → 記事を生成して保存
  const version = extractVersion(currentBuild);
  await saveCurrentBuild(currentBuild);

  const [patchResult, seasonResult] = await Promise.all([
    runGenerateGuide("patch-notes"),
    runGenerateGuide("season-guide"),
  ]);

  await notifyDiscord(version, [
    { ...patchResult, imageUrl: patchResult.imageUrl },
    { ...seasonResult, imageUrl: seasonResult.imageUrl },
  ]);

  return NextResponse.json({
    updated: true,
    previousBuild: lastBuild ?? "none",
    currentBuild,
    version,
    articles: [patchResult, seasonResult],
  });
}

export const GET = handleRequest;
export const POST = handleRequest;
