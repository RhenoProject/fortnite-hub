import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCosmeticById } from "@/lib/fortniteApi";
import { BackButton } from "@/components/BackButton";
import { rarityColors } from "@/lib/shopApi";

export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchCosmeticById(id);
  if (!item) return { title: "スキン情報 | フォトナHub" };

  const title = `${item.name} | フォートナイト スキン情報 | フォトナHub`;
  const description = item.description
    ? `${item.description} レアリティ: ${item.rarity.displayValue}。フォートナイト ${item.name} の詳細情報。`
    : `フォートナイト ${item.name} のスキン詳細情報。レアリティ・セット・登場シーズンを確認。`;
  const image = item.images.featured ?? item.images.icon ?? item.images.smallIcon ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 512, height: 512 }] : [],
      url: `https://fortnite-hub-delta.vercel.app/cosmetics/${id}`,
    },
    alternates: { canonical: `https://fortnite-hub-delta.vercel.app/cosmetics/${id}` },
  };
}

const RARITY_LABEL: Record<string, string> = {
  common: "コモン",
  uncommon: "アンコモン",
  rare: "レア",
  epic: "エピック",
  legendary: "レジェンダリー",
  mythic: "ミシック",
  exotic: "エキゾチック",
  transcendent: "トランセンデント",
};

export default async function CosmeticDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await fetchCosmeticById(id);
  if (!item) notFound();

  const heroImage = item.images.featured ?? item.images.icon ?? item.images.smallIcon ?? "";
  const color = rarityColors[item.rarity?.value] ?? rarityColors.common;
  const rarityLabel = RARITY_LABEL[item.rarity?.value] ?? item.rarity?.displayValue ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: heroImage,
    brand: { "@type": "Brand", name: "Epic Games" },
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BackButton />

      {/* ヒーロー画像 */}
      {heroImage && (
        <div style={{
          width: "100%", aspectRatio: "1/1", maxHeight: 400,
          borderRadius: 16, overflow: "hidden",
          border: `2px solid ${color}66`,
          background: `linear-gradient(135deg, ${color}18, #000)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* レアリティ・タイプ バッジ */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{
          fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 20,
          background: `${color}22`, color, border: `1px solid ${color}55`,
        }}>
          {rarityLabel}
        </span>
        {item.type?.displayValue && (
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: "var(--surface)", color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}>
            {item.type.displayValue}
          </span>
        )}
      </div>

      {/* 名前 */}
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text)", marginBottom: 10, lineHeight: 1.2 }}>
        {item.name}
      </h1>

      {/* 説明 */}
      {item.description && (
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 20 }}>
          {item.description}
        </p>
      )}

      {/* 詳細情報 */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "16px", marginBottom: 20,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {item.set && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 80 }}>セット</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{item.set.value}</span>
          </div>
        )}
        {item.series && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 80 }}>シリーズ</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{item.series.value}</span>
          </div>
        )}
        {item.introduction && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 80 }}>登場</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{item.introduction.text}</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 80 }}>追加日</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {new Date(item.added).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>

      {/* バリアント（スタイル） */}
      {item.variants && item.variants.length > 0 && (
        <section style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: "var(--text)", marginBottom: 12 }}>
            スタイル
          </h2>
          {item.variants.map((v, vi) => (
            <div key={vi} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{v.type}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {v.options.map((opt) => (
                  <div key={opt.tag} style={{ textAlign: "center", width: 80 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={opt.image}
                      alt={opt.name}
                      style={{
                        width: 80, height: 80, objectFit: "cover",
                        borderRadius: 8, border: "1px solid var(--border)",
                        display: "block",
                      }}
                    />
                    <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.3 }}>
                      {opt.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
