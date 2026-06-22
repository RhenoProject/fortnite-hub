"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CosmeticItem {
  id: string;
  name: string;
  type: string;
  typeDisplay: string;
  rarity: string;
  rarityDisplay: string;
  image: string;
}

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

export function SkinsClient() {
  const [activeType, setActiveType] = useState("outfit");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CosmeticItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchItems = useCallback(async (type: string, q: string, p: number, append: boolean) => {
    if (append) setLoadingMore(true); else setLoading(true);
    try {
      const params = new URLSearchParams({ type, q, page: String(p) });
      const res = await fetch(`/api/cosmetics/list?${params}`);
      const data = await res.json();
      setItems((prev) => append ? [...prev, ...data.items] : data.items);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch {
      if (!append) setItems([]);
    } finally {
      if (append) setLoadingMore(false); else setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setItems([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchItems(activeType, search, 1, false);
    }, search ? 300 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [activeType, search, fetchItems]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(activeType, search, nextPage, true);
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      {/* ページタイトル */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginBottom: 4 }}>
          スキン・コスメティック一覧
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {loading ? "読み込み中..." : `${total.toLocaleString()} 件 ｜ 6時間ごと自動更新`}
        </p>
      </div>

      {/* 検索 */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveType(tab.value)}
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

      {/* グリッド */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          読み込み中...
        </div>
      ) : items.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
          該当するスキンが見つかりませんでした
        </p>
      ) : (
        <>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            {total.toLocaleString()} 件中 {items.length.toLocaleString()} 件表示
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 10,
            }}
          >
            {items.map((c) => {
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
                    padding: "10px 6px 10px",
                    gap: 6,
                    position: "relative",
                  }}
                >
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
                    width={90}
                    height={90}
                    loading="lazy"
                    style={{
                      width: 90,
                      height: 90,
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
                  <p style={{ fontSize: 10, color, margin: 0, fontWeight: 600 }}>
                    {c.rarityDisplay}
                  </p>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  padding: "12px 32px",
                  background: "var(--primary)",
                  color: "#0a0f1a",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loadingMore ? "not-allowed" : "pointer",
                  opacity: loadingMore ? 0.7 : 1,
                }}
              >
                {loadingMore ? "読み込み中..." : `さらに表示 (残 ${(total - items.length).toLocaleString()} 件)`}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
