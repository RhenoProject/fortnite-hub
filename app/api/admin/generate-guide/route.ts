import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveGuide, type GuideSection } from "@/lib/guideContent";

// 認証チェック
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  return !!(secret && auth === `Bearer ${secret}`);
}

// fortnite-api.com からニュース取得
async function fetchFortniteNewsRaw(): Promise<string> {
  const res = await fetch("https://fortnite-api.com/v2/news?language=ja", { cache: "no-store" });
  if (!res.ok) return "";
  const json = await res.json();
  const motds = json?.data?.br?.motds ?? [];
  return motds
    .slice(0, 8)
    .map((m: { title?: string; body?: string }) => `■ ${m.title ?? ""}\n${m.body ?? ""}`)
    .join("\n\n");
}

// AES（バージョン）取得
async function fetchVersion(): Promise<string> {
  const res = await fetch("https://fortnite-api.com/v2/aes", { cache: "no-store" });
  if (!res.ok) return "不明";
  const json = await res.json();
  const build: string = json?.data?.build ?? "";
  const m = build.match(/Release-(\d+\.\d+)/);
  return m ? m[1] : build;
}

// スラッグ別プロンプト設定
function buildPrompt(slug: string, context: { newsText: string; version: string }): string {
  const base = `あなたはフォートナイト情報サイト「フォトナHub」のコンテンツライターです。
日本語のゲーマー向けに、簡潔でわかりやすい記事を書いてください。
必ずJSON形式で出力してください。出力はJSON以外のテキストを含めないこと。

出力フォーマット:
{
  "title": "記事タイトル（SEO最適化・キーワードを含む・30〜45文字）",
  "description": "メタdescription（120〜140文字）",
  "keywords": ["キーワード1", "キーワード2", ...],
  "sections": [
    { "type": "h2", "text": "見出し" },
    { "type": "p", "text": "段落テキスト" },
    { "type": "ul", "items": ["箇条書き1", "箇条書き2"] },
    { "type": "note", "text": "注釈・補足" }
  ]
}`;

  if (slug === "patch-notes") {
    return `${base}

現在のゲームバージョン: ${context.version}

以下のフォートナイト公式ニュースをもとに、最新パッチ・アップデートの変更点まとめ記事を書いてください。
見出し3〜5個・各セクション100〜200字・合計800〜1200字を目安に。
キーワード例: フォートナイト パッチノート、フォートナイト アップデート、フォートナイト 変更点

ニュース原文:
${context.newsText}`;
  }

  if (slug === "shop-history-guide") {
    return `${base}

以下のフォートナイト公式ニュースを参考に、「フォートナイト ショップ復刻スキン いつ来る？」をテーマにした検索需要対応記事を書いてください。
「前回いつショップに来たか」「次にいつ来るか予測」「レアスキンとは何か」などをわかりやすく解説。
見出し4〜6個・合計600〜900字を目安に。

ニュース原文（参考）:
${context.newsText}`;
  }

  if (slug === "season-guide") {
    return `${base}

現在のゲームバージョン: ${context.version}

以下のフォートナイト公式ニュースをもとに、現在のシーズンの概要・新要素・注目コンテンツをまとめたシーズンガイド記事を書いてください。
見出し4〜6個・合計800〜1200字を目安に。

ニュース原文:
${context.newsText}`;
  }

  // デフォルト: 汎用ガイド
  return `${base}

以下のフォートナイト公式ニュースをもとに、「${slug}」をテーマにしたガイド記事を書いてください。
見出し3〜5個・合計600〜1000字を目安に。

ニュース原文:
${context.newsText}`;
}

async function handleRequest(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "patch-notes";
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not set" },
      { status: 503 }
    );
  }

  try {
    const [newsText, version] = await Promise.all([
      fetchFortniteNewsRaw(),
      fetchVersion(),
    ]);

    const prompt = buildPrompt(slug, { newsText, version });

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;

    // JSON抽出（```json ... ``` ブロックにも対応）
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "JSON parse failed", raw }, { status: 500 });
    }
    const parsed = JSON.parse(jsonMatch[1]) as {
      title: string;
      description: string;
      keywords: string[];
      sections: GuideSection[];
    };

    await saveGuide({
      slug,
      title: parsed.title,
      description: parsed.description,
      keywords: parsed.keywords ?? [],
      sections: parsed.sections ?? [],
    });

    return NextResponse.json({ success: true, slug, title: parsed.title });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
