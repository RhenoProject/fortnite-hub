"use client";

import { useState, useMemo } from "react";
import type { Weapon } from "@/lib/mockWeapons";

const RARITY_COLOR_MAP: Record<string, string> = {
  common: "#aaaaaa", uncommon: "#60c060", rare: "#4a9ef5",
  epic: "#b04be8", legendary: "#f0ac00", mythic: "#e8d84a", exotic: "#3de8e8",
};

const TYPE_TABS = [
  { value: "all", label: "すべて" },
  { value: "assault", label: "🔫 AR" },
  { value: "smg", label: "🔫 SMG" },
  { value: "shotgun", label: "🔫 SG" },
  { value: "sniper", label: "🎯 SR" },
  { value: "pistol", label: "🔫 ピストル" },
  { value: "explosive", label: "🚀 爆発物" },
];

const SORT_OPTIONS = [
  { value: "dps", label: "DPS順" },
  { value: "damage", label: "ダメージ順" },
  { value: "rarity", label: "レアリティ順" },
];

const RARITY_ORDER: Record<string, number> = {
  mythic: 0, exotic: 1, legendary: 2, epic: 3, rare: 4, uncommon: 5, common: 6,
};

interface PatchChange { category: string; items: string[]; }
interface PatchNote { version: string; date: string; changes: PatchChange[]; }
interface Props { weapons: Weapon[]; patchNotes: PatchNote[]; }

export function WeaponsClient({ weapons, patchNotes }: Props) {
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("dps");
  const [view, setView] = useState<"weapons" | "patches">("weapons");
  const [openPatch, setOpenPatch] = useState<string | null>(patchNotes[0]?.version ?? null);

  const filtered = useMemo(() => {
    return weapons
      .filter((w) => tab === "all" || w.type === tab)
      .sort((a, b) => {
        if (sort === "dps") return b.dps - a.dps;
        if (sort === "damage") return b.damage - a.damage;
        return (RARITY_ORDER[a.rarity] ?? 9) - (RARITY_ORDER[b.rarity] ?? 9);
      });
  }, [weapons, tab, sort]);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", margin: 0 }}>
            武器データベース
          </h1>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            background: "#ff880022", color: "#ff8800", border: "1px solid #ff880044",
          }}>
            🔧 デモ（APIキー設定後に実データに切替）
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          全武器のダメージ・DPS・マガジン数を比較。最新パッチノートの変更点も確認できます。
        </p>
      </div>

      {/* ビュー切替 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[{ v: "weapons", label: "⚔️ 武器一覧" }, { v: "patches", label: "📋 パッチノート" }].map(({ v, label }) => (
          <button key={v} onClick={() => setView(v as any)} style={{
            padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
            border: "1px solid", borderColor: view === v ? "var(--primary)" : "var(--border)",
            background: view === v ? "var(--primary)" : "transparent",
            color: view === v ? "#0a0f1a" : "var(--text-muted)",
          }}>{label}</button>
        ))}
      </div>

      {view === "weapons" && (
        <>
          {/* タイプフィルター */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {TYPE_TABS.map(({ value, label }) => (
              <button key={value} onClick={() => setTab(value)} style={{
                padding: "6px 14px", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer",
                border: "1px solid", borderColor: tab === value ? "var(--primary)" : "var(--border)",
                background: tab === value ? "var(--primary)" : "transparent",
                color: tab === value ? "#0a0f1a" : "var(--text-muted)", whiteSpace: "nowrap",
              }}>{label}</button>
            ))}
          </div>

          {/* ソート */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>並び替え:</span>
            {SORT_OPTIONS.map(({ value, label }) => (
              <button key={value} onClick={() => setSort(value)} style={{
                padding: "4px 12px", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer",
                border: "1px solid", borderColor: sort === value ? "var(--primary)" : "var(--border)",
                background: sort === value ? "var(--primary)" : "transparent",
                color: sort === value ? "#0a0f1a" : "var(--text-muted)",
              }}>{label}</button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>
              {filtered.length} 件
            </span>
          </div>

          {/* 武器テーブル（PC）・カード（スマホ） */}
          <div style={{ display: "none" }} className="pc-table" />

          {/* カードグリッド */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((w) => {
              const color = RARITY_COLOR_MAP[w.rarity] ?? "#888";
              return (
                <div key={w.id} style={{
                  background: "var(--surface)",
                  border: `1px solid ${color}33`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: 10,
                  padding: "12px 16px",
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}>
                  {/* アイコン */}
                  <span style={{ fontSize: 24, textAlign: "center" }}>{w.emoji}</span>

                  {/* 武器名・レアリティ */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{w.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                        background: `${color}22`, color, border: `1px solid ${color}55`,
                      }}>{w.rarityDisplay}</span>
                    </div>
                    {/* スタット行 */}
                    <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                      {[
                        { label: "ダメージ", value: w.damage, highlight: true },
                        { label: "DPS", value: w.dps },
                        { label: "連射速度", value: w.fireRate },
                        { label: "マガジン", value: w.magSize },
                        { label: "リロード", value: `${w.reloadTime}s` },
                        { label: "頭倍率", value: `×${w.headMultiplier}` },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 }}>
                          <span style={{
                            fontSize: 13, fontWeight: 900,
                            color: highlight ? color : "var(--text)",
                          }}>{value}</span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ヘッドダメージ計算 */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ヘッドショット</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#ff4444" }}>
                      {Math.floor(w.damage * w.headMultiplier)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === "patches" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {patchNotes.map((patch) => {
            const isOpen = openPatch === patch.version;
            return (
              <div key={patch.version} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
              }}>
                <button onClick={() => setOpenPatch(isOpen ? null : patch.version)} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", background: "none", border: "none", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      fontSize: 13, fontWeight: 900, color: "var(--primary)",
                      background: "#00c8ff18", border: "1px solid #00c8ff33",
                      borderRadius: 8, padding: "3px 10px",
                    }}>v{patch.version}</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{patch.date}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                      background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e33",
                    }}>{patch.changes.length} カテゴリの変更</span>
                  </div>
                  <span style={{
                    fontSize: 16, color: "var(--primary)",
                    transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
                  }}>▼</span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                    {patch.changes.map((change, i) => (
                      <div key={i}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
                          {change.category}
                        </p>
                        <ul style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 4 }}>
                          {change.items.map((item, j) => (
                            <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
