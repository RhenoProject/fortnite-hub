"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FortniteMap, MapPOI } from "@/lib/fortniteApi";

type Difficulty = "hot" | "medium" | "safe";

const DROP_DATA: Record<string, { difficulty: Difficulty; tip: string }> = {
  "ヒートウェーブ・ハーバー": { difficulty: "hot", tip: "港エリア。建物が密集して早期に激しい戦闘が起きやすい。" },
  "シニスター・ストリップ": { difficulty: "hot", tip: "市街地エリア。複数の建物で近距離戦が多発する。" },
  "ウォンキーランド": { difficulty: "hot", tip: "テーマパークエリア。人が集まりやすい人気スポット。" },
  "ザ・バトルウッズ": { difficulty: "hot", tip: "名前の通り激戦区。中央寄りで戦闘が早い。" },
  "クラスター・コースト": { difficulty: "medium", tip: "海岸エリア。戦闘とルートのバランスが取りやすい。" },
  "ラテ・ランディング": { difficulty: "medium", tip: "中規模エリア。アイテムが集めやすい。" },
  "カラマリ・キャニオン": { difficulty: "medium", tip: "渓谷エリア。地形を活かした立ち回りができる。" },
  "チョップド・ショップ": { difficulty: "medium", tip: "工場・倉庫エリア。建物が多くアイテムが集めやすい。" },
  "リフティ・ロッジ": { difficulty: "medium", tip: "ロッジエリア。安定した選択肢。" },
  "シェイクン・サンクチュアリー": { difficulty: "medium", tip: "比較的静かめ。安定したゲームプランに向く。" },
  "サンクン・ショア": { difficulty: "safe", tip: "海岸の端。人が来にくく序盤を安全に進めやすい。" },
  "ゴールデン・グローブ": { difficulty: "safe", tip: "マップ端のエリア。バス経路次第で独占チャンスあり。" },
  "フロステッド・フラッツ": { difficulty: "safe", tip: "雪エリア。人が少なく初心者・ソロに向いている。" },
};

const DIFF = {
  hot:    { label: "激戦地",   color: "#ff4444", bg: "#ff444420", emoji: "🔴" },
  medium: { label: "バランス", color: "#f0ac00", bg: "#f0ac0020", emoji: "🟡" },
  safe:   { label: "安全地帯", color: "#22c55e", bg: "#22c55e20", emoji: "🟢" },
} as const;

// Fortnite world coords → image % (approximate bounds from API)
const B = { minX: -130000, maxX: 100000, minY: -115000, maxY: 130000 };
function toPct(poi: MapPOI) {
  const x = (poi.location.x - B.minX) / (B.maxX - B.minX) * 100;
  const y = (1 - (poi.location.y - B.minY) / (B.maxY - B.minY)) * 100;
  return { x, y };
}

interface Props { mapData: FortniteMap | null; }

export function MapClient({ mapData }: Props) {
  const [view, setView] = useState<"map" | "drop">("map");
  const [diffFilter, setDiffFilter] = useState<Difficulty | "all">("all");
  const [selectedPoi, setSelectedPoi] = useState<string | null>(null);

  // Zoom / Pan
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const lastPinchDist = useRef(0);

  const clampOff = useCallback((ox: number, oy: number, s: number) => {
    const el = containerRef.current;
    if (!el) return { x: ox, y: oy };
    const { width, height } = el.getBoundingClientRect();
    const mx = (width * (s - 1)) / 2;
    const my = (height * (s - 1)) / 2;
    return {
      x: Math.max(-mx, Math.min(mx, ox)),
      y: Math.max(-my, Math.min(my, oy)),
    };
  }, []);

  // Mouse wheel zoom (centered on cursor)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.18 : 0.85;
      setScale(prev => {
        const next = Math.min(10, Math.max(1, prev * factor));
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        const r = next / prev;
        setOffset(o => clampOff(mx - r * (mx - o.x), my - r * (my - o.y), next));
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampOff]);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setOffset(clampOff(
      dragStart.current.ox + e.clientX - dragStart.current.mx,
      dragStart.current.oy + e.clientY - dragStart.current.my,
      scale,
    ));
  };
  const onMouseUp = () => { dragging.current = false; };

  // Touch pinch + drag
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    } else {
      dragging.current = true;
      dragStart.current = { mx: e.touches[0].clientX, my: e.touches[0].clientY, ox: offset.x, oy: offset.y };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (lastPinchDist.current > 0) {
        const factor = dist / lastPinchDist.current;
        setScale(prev => {
          const next = Math.min(10, Math.max(1, prev * factor));
          const el = containerRef.current;
          if (el) {
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const rect = el.getBoundingClientRect();
            const px = cx - rect.left - rect.width / 2;
            const py = cy - rect.top - rect.height / 2;
            const r = next / prev;
            setOffset(o => clampOff(px - r * (px - o.x), py - r * (py - o.y), next));
          }
          return next;
        });
      }
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && dragging.current) {
      setOffset(clampOff(
        dragStart.current.ox + e.touches[0].clientX - dragStart.current.mx,
        dragStart.current.oy + e.touches[0].clientY - dragStart.current.my,
        scale,
      ));
    }
  };
  const onTouchEnd = () => { dragging.current = false; lastPinchDist.current = 0; };

  const resetZoom = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  const namedPois = mapData?.pois.filter(p => !p.id.includes("UnNamedPOI")) ?? [];
  const visiblePins = view === "drop"
    ? namedPois.filter(p => diffFilter === "all" || DROP_DATA[p.name]?.difficulty === diffFilter)
    : [];

  const selData = selectedPoi ? DROP_DATA[selectedPoi] : null;

  return (
    <>
      {/* ヘッダー */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginBottom: 4 }}>
          🗺️ マップ
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          スクロール / ピンチでズーム、ドラッグで移動。
        </p>
      </div>

      {/* タブ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["map", "drop"] as const).map(v => (
          <button key={v} onClick={() => { setView(v); setSelectedPoi(null); }} style={{
            padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
            border: "1px solid",
            borderColor: view === v ? "var(--primary)" : "var(--border)",
            background: view === v ? "var(--primary)" : "transparent",
            color: view === v ? "#0a0f1a" : "var(--text-muted)",
          }}>
            {v === "map" ? "🗺️ マップ" : "📍 ドロップスポット"}
          </button>
        ))}
      </div>

      {/* ドロップ難易度フィルター */}
      {view === "drop" && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <button onClick={() => setDiffFilter("all")} style={{
            padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
            border: "1px solid",
            borderColor: diffFilter === "all" ? "var(--primary)" : "var(--border)",
            background: diffFilter === "all" ? "var(--primary)" : "transparent",
            color: diffFilter === "all" ? "#0a0f1a" : "var(--text-muted)",
          }}>すべて</button>
          {(["hot", "medium", "safe"] as Difficulty[]).map(d => (
            <button key={d} onClick={() => setDiffFilter(d)} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: "1px solid",
              borderColor: diffFilter === d ? DIFF[d].color : "var(--border)",
              background: diffFilter === d ? DIFF[d].bg : "transparent",
              color: diffFilter === d ? DIFF[d].color : "var(--text-muted)",
            }}>{DIFF[d].emoji} {DIFF[d].label}</button>
          ))}
        </div>
      )}

      {/* ズームリセット */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {scale > 1 && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{Math.round(scale * 100)}%</span>
        )}
        <button onClick={resetZoom} disabled={scale === 1} style={{
          padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700,
          border: "1px solid var(--border)", background: "var(--surface)",
          cursor: scale === 1 ? "default" : "pointer",
          color: "var(--text-muted)", opacity: scale === 1 ? 0.4 : 1,
        }}>🔍 リセット</button>
      </div>

      {/* マップ本体 */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%",
          overflow: "hidden",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "#000",
          cursor: scale > 1 ? "grab" : "default",
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none" as any,
        }}
      >
        {/* ズーム・パン変形レイヤー */}
        <div style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: "center center",
        }}>
          {mapData ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mapData.images.pois}
              alt="フォートナイトマップ"
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: 14,
            }}>
              マップデータを取得できませんでした
            </div>
          )}

          {/* ドロップスポット ピン */}
          {visiblePins.map(poi => {
            const data = DROP_DATA[poi.name];
            if (!data) return null;
            const { x, y } = toPct(poi);
            const cfg = DIFF[data.difficulty];
            const isSel = selectedPoi === poi.name;
            return (
              <button
                key={poi.id}
                onClick={(e) => { e.stopPropagation(); setSelectedPoi(isSel ? null : poi.name); }}
                title={poi.name}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `translate(-50%, -100%) scale(${1 / scale})`,
                  transformOrigin: "bottom center",
                  background: "none", border: "none", padding: 0,
                  cursor: "pointer", zIndex: 10,
                }}
              >
                {/* ピン形状 */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 24, height: 24,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    background: cfg.color,
                    border: isSel ? "2px solid #fff" : "2px solid rgba(0,0,0,0.4)",
                    boxShadow: isSel ? `0 0 10px ${cfg.color}, 0 2px 6px rgba(0,0,0,0.8)` : "0 2px 6px rgba(0,0,0,0.7)",
                  }} />
                  <div style={{
                    width: 4, height: 5, background: cfg.color,
                    borderRadius: "0 0 2px 2px",
                  }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択中POI 詳細パネル */}
      {view === "drop" && selectedPoi && selData && (
        <div style={{
          marginTop: 12, padding: "14px 16px",
          background: "var(--surface)",
          border: `1px solid ${DIFF[selData.difficulty].color}55`,
          borderLeft: `4px solid ${DIFF[selData.difficulty].color}`,
          borderRadius: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--text)" }}>{selectedPoi}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
              background: DIFF[selData.difficulty].bg,
              color: DIFF[selData.difficulty].color,
              border: `1px solid ${DIFF[selData.difficulty].color}44`,
            }}>{DIFF[selData.difficulty].emoji} {DIFF[selData.difficulty].label}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>{selData.tip}</p>
        </div>
      )}

      {/* 凡例 */}
      {view === "drop" && (
        <div style={{
          display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10,
          padding: "8px 12px", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 8,
        }}>
          {(["hot", "medium", "safe"] as Difficulty[]).map(d => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%",
                background: DIFF[d].color, display: "block", flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{DIFF[d].emoji} {DIFF[d].label}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto", alignSelf: "center" }}>
            ピンをタップで詳細
          </span>
        </div>
      )}

      {/* ドロップスポット 全リスト */}
      {view === "drop" && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
            全ドロップスポット一覧
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {namedPois
              .filter(p => diffFilter === "all" || DROP_DATA[p.name]?.difficulty === diffFilter)
              .map(poi => {
                const d = DROP_DATA[poi.name];
                if (!d) return null;
                const isSel = selectedPoi === poi.name;
                return (
                  <button
                    key={poi.id}
                    onClick={() => setSelectedPoi(isSel ? null : poi.name)}
                    style={{
                      background: isSel ? DIFF[d.difficulty].bg : "var(--surface)",
                      border: `1px solid ${DIFF[d.difficulty].color}33`,
                      borderLeft: `4px solid ${DIFF[d.difficulty].color}`,
                      borderRadius: 8, padding: "10px 14px",
                      display: "flex", alignItems: "flex-start", gap: 10,
                      cursor: "pointer", textAlign: "left", width: "100%",
                    }}
                  >
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                      background: DIFF[d.difficulty].bg, color: DIFF[d.difficulty].color,
                      border: `1px solid ${DIFF[d.difficulty].color}44`, whiteSpace: "nowrap", flexShrink: 0,
                    }}>{DIFF[d.difficulty].emoji} {DIFF[d.difficulty].label}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", margin: "0 0 2px" }}>
                        {poi.name}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>{d.tip}</p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
