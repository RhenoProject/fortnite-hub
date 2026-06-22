"use client";

import { useMemo, useState } from "react";
import type { SlimCosmetic } from "./page";

const TYPE_TABS = [
  { value: "all", label: "すべて" },
  { value: "outfit", label: "👕 コスチューム" },
  { value: "backpack", label: "🎒 バックアクセサリー" },
  { value: "pickaxe", label: "⛏️ 収穫ツール" },
  { value: "glider", label: "🪂 グライダー" },
  { value: "emote", label: "💃 エモート" },
  { value: "wrap", label: "🎨 ラップ" },
  { value: "spray", label: "🖌️ スプレー" },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "#FFD700",
  epic: "#A855F7",
  rare: "#3B82F6",
  uncommon: "#22C55E",
  common: "#888888",
  mythic: "#EC4899",
  transcendent: "#F97316",
  exotic: "#22D3EE",
  slurp: "#06B6D4",
};

const RARITY_ORDER: Record<string, number> = {
  mythic: 0,
  transcendent: 1,
  exotic: 2,
  legendary: 3,
  epic: 4,
  rare: 5,
  uncommon: 6,
  common: 7,
  slurp: 8,
};

const PAGE_SIZE = 80;

export function SkinsClient({ cosmetics }: { cosmetics: SlimCosmetic[] }) {
  const [activeType, setActiveType] = useState("outfit");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cosmetics
      .filter((c) => {
        if (activeType !== "all" && c.type !== activeType) return false;
        if (q && !c.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        const ra = RARITY_ORDER[a.rarity] ?? 9;
        const rb = RARITY_ORDER[b.rarity] ?? 9;
        return ra - rb;
      });
  }, [cosmetics, activeType, search]);

  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      {/* ページタイトル */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginBottom: 4 }}>
          スキン・コスメティック一覧
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          全 {cosmetics.length.toLocaleString()} 件 ｜ 6時間ごと自動更新
        </p>
      </div>

      {/* 検索 */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 スキン名で検索..."
          enterKeyHint="search"
          inputMode="search"
          autoCapitalize="off"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* タイプフィルター */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTypeChange(tab.value)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeType === tab.value ? "var(--primary)" : "var(--border)",
              background: activeType === tab.value ? "var(--primary)" : "transparent",
              color: activeType === tab.value ? "#0a0f1a" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 件数表示 */}
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        {filtered.length.toLocaleString()} 件中 {Math.min(displayed.length, filtered.length).toLocaleString()} 件表示
      </p>

      {/* グリッド */}
      {filtered.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
          該当するスキンが見つかりませんでした
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 10,
            }}
          >
            {displayed.map((c) => {
              const color = RARITY_COLORS[c.rarity] ?? "#888";
              return (
                <div
                  key={c.id}
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${color}44`,
                    borderRadius: 10,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "8px 6px 10px",
                    gap: 6,
                    position: "relative",
                  }}
                >
                  {/* レアリティアクセント */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: color,
                      borderRadius: "10px 10px 0 0",
                    }}
                  />
                  <img
                    src={c.image}
                    alt={c.name}
                    width={100}
                    height={100}
                    loading="lazy"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: 6,
                    }}
                  />
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      margin: 0,
                      wordBreak: "break-word",
                    }}
                  >
                    {c.name}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: color,
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {c.rarityDisplay}
                  </p>
                </div>
              );
            })}
          </div>

          {/* もっと見るボタン */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "12px 32px",
                  background: "var(--primary)",
                  color: "#0a0f1a",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                さらに {Math.min(PAGE_SIZE, filtered.length - displayed.length).toLocaleString()} 件表示
              </button>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
                残り {(filtered.length - displayed.length).toLocaleString()} 件
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
