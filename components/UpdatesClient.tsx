"use client";
import { useState } from "react";
import Image from "next/image";
import { UpdateItem, CompetitivePlaylist } from "@/lib/fortniteApi";

const modeLabel: Record<number, string> = {
  1: "ソロ",
  2: "デュオ",
  3: "トリオ",
  4: "スクワッド",
};

function getModeLabel(maxPlayers: number): string {
  return modeLabel[maxPlayers] ?? `${maxPlayers}人`;
}

function UpdateCard({ item }: { item: UpdateItem }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        backgroundColor: "var(--card)",
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${expanded ? "#00c8ff66" : "var(--border)"}`,
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {item.image && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
      )}
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text)", lineHeight: 1.4 }}>
          {item.title}
        </h3>
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
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#00c8ff" }}>
          {expanded ? "▲ 閉じる" : "▼ 続きを読む"}
        </span>
      </div>
    </div>
  );
}

function PlaylistCard({ playlist }: { playlist: CompetitivePlaylist }) {
  const mode = getModeLabel(playlist.maxPlayers);
  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      padding: "14px 16px",
      border: `1px solid ${playlist.isTournament ? "#ffd70044" : "var(--border)"}`,
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    }}>
      {playlist.isTournament && (
        <span style={{
          fontSize: "10px",
          fontWeight: "800",
          color: "#ffd700",
          backgroundColor: "#ffd70018",
          border: "1px solid #ffd70033",
          borderRadius: "20px",
          padding: "2px 8px",
          alignSelf: "flex-start",
        }}>
          大会
        </span>
      )}
      <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)", lineHeight: 1.4 }}>
        {playlist.name}
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "11px", fontWeight: "600", color: "var(--primary)",
          backgroundColor: "#00c8ff18", borderRadius: "6px", padding: "2px 8px",
        }}>
          {mode}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: "600", color: "var(--text-muted)",
          backgroundColor: "var(--border)", borderRadius: "6px", padding: "2px 8px",
        }}>
          最大 {playlist.maxPlayers}人
        </span>
      </div>
    </div>
  );
}

export function UpdatesClient({
  updates,
  playlists,
}: {
  updates: UpdateItem[];
  playlists: CompetitivePlaylist[];
}) {
  return (
    <>
      {/* 競技モード */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
            🏆 現在の競技モード
          </h2>
        </div>

        {playlists.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px",
            backgroundColor: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <p style={{ marginBottom: "8px" }}>競技モード情報を取得できませんでした</p>
            <a
              href="https://www.fortnite.com/competitive"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)", fontSize: "12px", fontWeight: "700" }}
            >
              公式競技ページを確認する →
            </a>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px", marginBottom: "12px" }}>
              {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>
              ※ 大会の詳細日程は{" "}
              <a
                href="https://www.fortnite.com/competitive"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary)" }}
              >
                公式競技ページ
              </a>
              {" "}でご確認ください
            </p>
          </>
        )}
      </section>

      {/* 最新アップデート */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px" }}>
            🆕 最新アップデート情報
          </h2>
        </div>

        {updates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
            <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {updates.map(item => <UpdateCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </>
  );
}
