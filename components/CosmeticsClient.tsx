"use client";
import { useState } from "react";
import Image from "next/image";
import { NewCosmetic, CosmeticCategory, cosmeticCategoryLabel, rarityColors } from "@/lib/shopApi";

const ALL = "all";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) + " 追加";
}

function CosmeticCard({ item }: { item: NewCosmetic }) {
  const color = rarityColors[item.rarity] ?? rarityColors.common;
  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid ${color}44`,
      display: "flex",
      flexDirection: "column",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 160px"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "var(--border)" }} />
      )}
      <div style={{ height: "3px", backgroundColor: color }} />
      <div style={{ padding: "8px" }}>
        <p style={{ fontSize: "9px", color: color, fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>
          {item.typeDisplay}
        </p>
        <p style={{
          fontSize: "12px", fontWeight: "700", color: "var(--text)", lineHeight: 1.3, marginBottom: "4px",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {item.name}
        </p>
        <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>
          {formatDate(item.addedAt)}
        </p>
      </div>
    </div>
  );
}

export function CosmeticsClient({ items }: { items: NewCosmetic[] }) {
  const [filter, setFilter] = useState<CosmeticCategory | typeof ALL>(ALL);

  const categories = [ALL, ...Object.keys(cosmeticCategoryLabel)] as (CosmeticCategory | typeof ALL)[];
  const filtered = filter === ALL ? items : items.filter(i => i.category === filter);

  const tabStyle = (cat: CosmeticCategory | typeof ALL): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    backgroundColor: filter === cat ? "var(--primary)" : "var(--card)",
    color: filter === cat ? "#0a0f1a" : "var(--text-muted)",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <>
      {/* カテゴリーフィルター */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        overflowX: "auto",
        paddingBottom: "4px",
      }}>
        <button style={tabStyle(ALL)} onClick={() => setFilter(ALL)}>
          すべて ({items.length})
        </button>
        {(Object.entries(cosmeticCategoryLabel) as [CosmeticCategory, string][]).map(([cat, label]) => {
          const count = items.filter(i => i.category === cat).length;
          if (count === 0) return null;
          return (
            <button key={cat} style={tabStyle(cat)} onClick={() => setFilter(cat)}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* グリッド */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "10px",
      }}>
        {filtered.map(item => (
          <CosmeticCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
