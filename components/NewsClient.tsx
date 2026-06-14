"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [router]);

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
      <style>{`
        .news-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        @media (min-width: 640px) {
          .news-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
      `}</style>

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
      <div className="news-grid">
        {filtered.map((item, i) => (
          <NewsCard key={item.id} item={item} priority={i < 2} />
        ))}
      </div>
    </>
  );
}
