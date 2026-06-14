"use client";
import { useState } from "react";
import { NewsItem, NewsCategory } from "@/lib/fortniteApi";
import { NewsCard } from "@/components/NewsCard";

const ALL = "all";

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

export function NewsClient({ items }: { items: NewsItem[] }) {
  const [filter, setFilter] = useState<NewsCategory | typeof ALL>(ALL);

  const filtered = filter === ALL ? items : items.filter(i => i.category === filter);

  const tabStyle = (key: NewsCategory | typeof ALL): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    backgroundColor: filter === key ? "var(--primary)" : "var(--card)",
    color: filter === key ? "#0a0f1a" : "var(--text-muted)",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  });

  return (
    <>
      {/* カテゴリーフィルター */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "4px" }}>
        <button style={tabStyle(ALL)} onClick={() => setFilter(ALL)}>
          すべて ({items.length})
        </button>
        {(Object.keys(categoryLabel) as NewsCategory[]).map(cat => {
          const count = items.filter(i => i.category === cat).length;
          if (count === 0) return null;
          const isActive = filter === cat;
          return (
            <button key={cat} onClick={() => setFilter(cat)} style={{
              ...tabStyle(cat),
              backgroundColor: isActive ? categoryColor[cat] : "var(--card)",
              color: isActive ? "#0a0f1a" : categoryColor[cat],
              border: isActive ? "none" : `1px solid ${categoryColor[cat]}44`,
            }}>
              {categoryLabel[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* ニュース一覧 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {filtered.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
