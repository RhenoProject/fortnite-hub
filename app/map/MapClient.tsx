"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { FortniteMap } from "@/lib/fortniteApi";

interface Props {
  mapData: FortniteMap | null;
}

export function MapClient({ mapData }: Props) {
  const [query, setQuery] = useState("");
  const [showPois, setShowPois] = useState(false);

  const { namedPois, landmarks } = useMemo(() => {
    const pois = mapData?.pois ?? [];
    return {
      namedPois: pois.filter((p) => !p.id.includes("UnNamedPOI")),
      landmarks: pois.filter((p) => p.id.includes("UnNamedPOI")),
    };
  }, [mapData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { namedPois, landmarks };
    return {
      namedPois: namedPois.filter((p) => p.name.toLowerCase().includes(q)),
      landmarks: landmarks.filter((p) => p.name.toLowerCase().includes(q)),
    };
  }, [query, namedPois, landmarks]);

  return (
    <>
      {/* ヘッダー */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--primary)", marginBottom: 6 }}>
          🗺️ マップ
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          現シーズンのフォートナイトマップ。全30か所のPOI・ランドマーク一覧。
        </p>
      </div>

      {/* マップ画像 */}
      {mapData ? (
        <div style={{ position: "relative", width: "100%", marginBottom: 24 }}>
          <div style={{
            position: "relative",
            width: "100%",
            paddingBottom: "100%",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "var(--surface)",
          }}>
            <Image
              src={mapData.images.pois}
              alt="フォートナイト最新マップ"
              fill
              style={{ objectFit: "contain" }}
              priority
              unoptimized
            />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textAlign: "right" }}>
            ※ 1時間ごとに最新データを反映
          </p>
        </div>
      ) : (
        <div style={{
          width: "100%", paddingBottom: "100%", position: "relative",
          background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
          marginBottom: 24,
        }}>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", fontSize: 14,
          }}>
            マップデータを取得できませんでした
          </div>
        </div>
      )}

      {/* POI一覧トグル */}
      <button
        onClick={() => setShowPois((v) => !v)}
        style={{
          width: "100%", padding: "12px 16px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: showPois ? "12px 12px 0 0" : 12,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: showPois ? 0 : 0,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>
          📍 POI・ランドマーク一覧（{mapData?.pois.length ?? 0}か所）
        </span>
        <span style={{
          fontSize: 16, color: "var(--primary)",
          transform: showPois ? "rotate(180deg)" : "none", transition: "transform 0.2s",
        }}>▼</span>
      </button>

      {showPois && (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderTop: "none", borderRadius: "0 0 12px 12px",
          padding: "16px",
        }}>
          {/* 検索 */}
          <input
            type="search"
            placeholder="場所を検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", marginBottom: 16,
              background: "var(--bg)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text)", fontSize: 14,
              boxSizing: "border-box",
            }}
          />

          {/* 主要POI */}
          {filtered.namedPois.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontSize: 11, fontWeight: 800, color: "var(--primary)",
                letterSpacing: 1, marginBottom: 8,
                textTransform: "uppercase",
              }}>
                主要ロケーション ({filtered.namedPois.length})
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 6,
              }}>
                {filtered.namedPois.map((poi) => (
                  <div key={poi.id} style={{
                    padding: "8px 12px",
                    background: "#00c8ff0a",
                    border: "1px solid #00c8ff22",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                  }}>
                    📍 {poi.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ランドマーク */}
          {filtered.landmarks.length > 0 && (
            <div>
              <p style={{
                fontSize: 11, fontWeight: 800, color: "var(--text-muted)",
                letterSpacing: 1, marginBottom: 8,
                textTransform: "uppercase",
              }}>
                ランドマーク ({filtered.landmarks.length})
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 6,
              }}>
                {filtered.landmarks.map((poi) => (
                  <div key={poi.id} style={{
                    padding: "8px 12px",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--text-muted)",
                  }}>
                    🏷️ {poi.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {filtered.namedPois.length === 0 && filtered.landmarks.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
              「{query}」に一致する場所が見つかりません
            </p>
          )}
        </div>
      )}
    </>
  );
}
