import Anthropic from "@anthropic-ai/sdk";
import { saveGuide, type GuideSection } from "./guideContent";

async function fetchFortniteNews(): Promise<{ text: string; imageUrl: string | null }> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/news?language=ja", { cache: "no-store" });
    if (!res.ok) return { text: "", imageUrl: null };
    const json = await res.json();
    const motds: { title?: string; body?: string; image?: string }[] = json?.data?.br?.motds ?? [];
    const text = motds
      .slice(0, 8)
      .map((m) => `■ ${m.title ?? ""}\n${m.body ?? ""}`)
      .join("\n\n");
    const imageUrl = motds[0]?.image ?? null;
    return { text, imageUrl };
  } catch {
    return { text: "", imageUrl: null };
  }
}

export async function fetchCurrentBuild(): Promise<string | null> {
  try {
    const res = await fetch("https://fortnite-api.com/v2/aes", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.build ?? null;
  } catch {
    return null;
  }
}

export function extractVersion(build: string): string {
  const m = build.match(/Release-(\d+\.\d+)/);
  return m ? m[1] : build;
}

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

  return `${base}

以下のフォートナイト公式ニュースをもとに、「${slug}」をテーマにしたガイド記事を書いてください。
見出し3〜5個・合計600〜1000字を目安に。

ニュース原文:
${context.newsText}`;
}

export interface GenerateResult {
  slug: string;
  title: string;
  success: boolean;
  error?: string;
  imageUrl?: string;
}

export async function runGenerateGuide(slug: string): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { slug, title: "", success: false, error: "ANTHROPIC_API_KEY not set" };

  try {
    const [news, build] = await Promise.all([
      fetchFortniteNews(),
      fetchCurrentBuild(),
    ]);
    const { text: newsText, imageUrl } = news;
    const version = build ? extractVersion(build) : "不明";
    const prompt = buildPrompt(slug, { newsText, version });

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) return { slug, title: "", success: false, error: "JSON parse failed" };

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
      ...(imageUrl ? { featuredImage: imageUrl } : {}),
    });

    return { slug, title: parsed.title, success: true, imageUrl: imageUrl ?? undefined };
  } catch (e) {
    return { slug, title: "", success: false, error: String(e) };
  }
}
