"use client";

import type { GameVersion, NewsItem } from "@/lib/fortniteApi";
import { useState } from "react";

interface Props {
  version: GameVersion | null;
  brNews: NewsItem[];
}

export function UpdatesClient({ version, brNews }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* ページヘッダー */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", letterSpacing: 1 }}>
            📋 アップデート・パッチノート
          </h1>
          {version && (
            <span style={{
              fontSize: 12, fontWeight: 700, color: "var(--primary)",
              backgroundColor: "#00c8ff18", border: "1px solid #00c8ff33",
              borderRadius: 20, padding: "3px 10px",
            }}>
              現在のバージョン v{version.version}
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          フォートナイトの最新アップデート情報・新機能・変更点を確認
        </p>
      </div>

      {/* 最新アップデート情報 */}
      {brNews.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{
            fontSize: 15, fontWeight: 900, color: "var(--primary)",
            letterSpacing: 1, marginBottom: 16,
            paddingBottom: 8, borderBottom: "1px solid var(--border)",
          }}>
            🆕 最新アップデート情報
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {brNews.map((item) => {
              const isOpen = expanded === item.id;
              return (
                <div
                  key={item.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* カードヘッダー（クリックで開閉） */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={45}
                        loading="lazy"
                        style={{
                          width: 80, height: 45,
                          objectFit: "cover",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 800, color: "var(--text)",
                        lineHeight: 1.4, margin: 0,
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: isOpen ? "normal" : "nowrap",
                      }}>
                        {item.title}
                      </p>
                      {!isOpen && (
                        <p style={{
                          fontSize: 12, color: "var(--text-muted)",
                          margin: "4px 0 0",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.body}
                        </p>
                      )}
                    </div>
                    <span style={{
                      fontSize: 18, color: "var(--primary)", flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}>
                      ▼
                    </span>
                  </button>

                  {/* 展開時の詳細 */}
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px" }}>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          style={{
                            width: "100%", maxHeight: 240,
                            objectFit: "cover", borderRadius: 8,
                            marginBottom: 12,
                          }}
                        />
                      )}
                      <p style={{
                        fontSize: 14, color: "var(--text)", lineHeight: 1.8,
                        margin: 0,
                      }}>
                        {item.body}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 公式パッチノート */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 15, fontWeight: 900, color: "var(--text)",
          letterSpacing: 1, marginBottom: 16,
          paddingBottom: 8, borderBottom: "1px solid var(--border)",
        }}>
          📄 公式パッチノート（詳細）
        </h2>
        <a
          href="https://www.fortnite.com/news?category=patch-notes"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, padding: "16px 20px",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, textDecoration: "none",
          }}
        >
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
              Epic Games 公式パッチノートを確認する
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              武器のダメージ・マガジン数・バランス調整など詳細な数値変更はこちら
            </p>
          </div>
          <span style={{ fontSize: 20, color: "var(--primary)", flexShrink: 0 }}>→</span>
        </a>
      </section>

      {/* 競技日程 */}
      <section style={{ marginBottom: 28 }}>
        <h2 style={{
          fontSize: 15, fontWeight: 900, color: "var(--text)",
          letterSpacing: 1, marginBottom: 16,
          paddingBottom: 8, borderBottom: "1px solid var(--border)",
        }}>
          🏆 競技日程
        </h2>
        <a
          href="https://www.fortnite.com/competitive"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, padding: "16px 20px",
            background: "var(--surface)", border: "1px solid #ffd70033",
            borderRadius: 12, textDecoration: "none",
          }}
        >
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
              公式競技ページで確認する
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              今日の開催モード・参加条件・スケジュール
            </p>
          </div>
          <span style={{ fontSize: 20, color: "#ffd700", flexShrink: 0 }}>→</span>
        </a>
      </section>

      {/* プレイヤー統計 */}
      <section>
        <h2 style={{
          fontSize: 15, fontWeight: 900, color: "var(--text)",
          letterSpacing: 1, marginBottom: 16,
          paddingBottom: 8, borderBottom: "1px solid var(--border)",
        }}>
          📊 プレイヤー統計
        </h2>
        <a
          href="https://tracker.gg/fortnite"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, padding: "16px 20px",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 12, textDecoration: "none",
          }}
        >
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
              Fortnite Tracker で統計を確認
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              キル数・勝率・ランクなどをプレイヤー名で検索
            </p>
          </div>
          <span style={{ fontSize: 20, color: "var(--primary)", flexShrink: 0 }}>→</span>
        </a>
      </section>
    </>
  );
}
