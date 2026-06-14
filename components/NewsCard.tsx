"use client";
import { useState } from "react";
import Image from "next/image";
import { NewsItem, NewsCategory } from "@/lib/fortniteApi";

const categoryLabel: Record<NewsCategory, string> = {
  br: "バトルロイヤル",
  stw: "STW",
  creative: "クリエイティブ",
};

const categoryColor: Record<NewsCategory, string> = {
  br: "#00c8ff",
  stw: "#ff8c00",
  creative: "#a855f7",
};

export function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColor[item.category];
  const label = categoryLabel[item.category];

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        backgroundColor: "var(--card)",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${expanded ? color + "66" : "var(--border)"}`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/7" }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 1100px"
            style={{ objectFit: "cover" }}
            priority
          />
          {/* カテゴリーバッジを画像上に重ねる */}
          <span style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: `${color}dd`,
            color: "#0a0f1a",
          }}>
            {label}
          </span>
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/7", backgroundColor: "var(--border)", position: "relative" }}>
          <span style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "700",
            backgroundColor: `${color}dd`,
            color: "#0a0f1a",
          }}>
            {label}
          </span>
        </div>
      )}

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* タイトル */}
        <h2 style={{
          fontSize: "20px",
          fontWeight: "900",
          color: "var(--text)",
          lineHeight: 1.4,
          letterSpacing: "0.5px",
        }}>
          {item.title}
        </h2>

        {/* 本文 */}
        {item.body && (
          <p style={{
            fontSize: "15px",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            overflow: expanded ? "visible" : "hidden",
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 5,
            WebkitBoxOrient: "vertical" as any,
            whiteSpace: "pre-wrap",
          }}>
            {item.body}
          </p>
        )}

        {/* 展開ボタン */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: color,
          fontSize: "13px",
          fontWeight: "700",
        }}>
          <span>{expanded ? "▲ 閉じる" : "▼ 続きを読む"}</span>
        </div>
      </div>
    </div>
  );
}
