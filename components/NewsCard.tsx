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
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${expanded ? color + "66" : "var(--border)"}`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {item.image ? (
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
        }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "var(--border)" }} />
      )}

      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* バッジ行 */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "700",
            backgroundColor: `${color}22`,
            color: color,
            border: `1px solid ${color}44`,
          }}>
            {label}
          </span>
          {!item.isJaLocalized && (
            <span style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "700",
              backgroundColor: "#ffffff12",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}>
              英語版
            </span>
          )}
        </div>

        {/* タイトル */}
        <h2 style={{
          fontSize: "15px",
          fontWeight: "800",
          color: "var(--text)",
          lineHeight: 1.4,
        }}>
          {item.title}
        </h2>

        {/* 本文 */}
        {item.body && (
          <p style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            overflow: expanded ? "visible" : "hidden",
            display: "-webkit-box",
            WebkitLineClamp: expanded ? "unset" : 3,
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
          marginTop: "4px",
          color: color,
          fontSize: "12px",
          fontWeight: "700",
        }}>
          <span>{expanded ? "▲ 閉じる" : "▼ 続きを読む"}</span>
        </div>
      </div>
    </div>
  );
}
