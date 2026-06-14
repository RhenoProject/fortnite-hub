"use client";
import { useState } from "react";
import Image from "next/image";
import { UpdateItem, CompetitivePlaylist } from "@/lib/fortniteApi";

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
  const displayName = playlist.subName
    ? `${playlist.name} — ${playlist.subName}`
    : playlist.name;

  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      padding: "14px 16px",
      border: "1px solid #ffd70033",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)", lineHeight: 1.4 }}>
        {displayName}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "11px", fontWeight: "700", color: "var(--primary)",
          backgroundColor: "#00c8ff18", borderRadius: "6px", padding: "2px 8px",
          border: "1px solid #00c8ff33",
        }}>
          {playlist.mode}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: "600", color: "var(--text-muted)",
          backgroundColor: "var(--border)", borderRadius: "6px", padding: "2px 8px",
        }}>
          最大 {playlist.maxPlayers}人
        </span>
        <span style={{
          fontSize: "11px", fontWeight: "800", color: "#ffd700",
          backgroundColor: "#ffd70018", borderRadius: "6px", padding: "2px 8px",
          border: "1px solid #ffd70033",
        }}>
          大会
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
            🏆 競技モード一覧
          </h2>
          <a
            href="https://www.fortnite.com/competitive"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--primary)",
              textDecoration: "none",
              border: "1px solid #00c8ff44",
              borderRadius: "20px",
              padding: "4px 12px",
            }}
          >
            公式日程を確認 →
          </a>
        </div>

        <div style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: "14px",
          lineHeight: 1.6,
        }}>
          ⚠️ 大会の具体的な日時・参加条件は<strong>公式競技ページ</strong>でご確認ください。以下は現在登録されている競技モードの一覧です。
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
            {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
          </div>
        )}
      </section>

      {/* パッチノートリンク */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "12px" }}>
          📋 パッチノート
        </h2>
        <a
          href="https://www.fortnite.com/en-US/news/patch-notes"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
        >
          <div>
            <p style={{ fontSize: "15px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>
              Epic Games 公式パッチノート
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              各バージョンの変更内容・新機能の詳細はこちら
            </p>
          </div>
          <span style={{ fontSize: "20px", color: "var(--primary)", flexShrink: 0, marginLeft: "12px" }}>→</span>
        </a>
      </section>

      {/* 最新アップデート情報 */}
      <section>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "16px" }}>
          🆕 ゲーム内最新情報
        </h2>

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
