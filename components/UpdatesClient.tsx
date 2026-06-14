"use client";

export function UpdatesClient() {
  return (
    <>
      {/* 競技日程 */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px", marginBottom: "16px" }}>
          🏆 今日の競技日程
        </h2>

        <a
          href="https://www.fortnite.com/competitive"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "20px 24px",
            backgroundColor: "var(--card)",
            border: "1px solid #ffd70044",
            borderRadius: "14px",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <p style={{ fontSize: "16px", fontWeight: "800", color: "var(--text)" }}>
              公式競技ページで確認する
            </p>
            <span style={{ fontSize: "22px", color: "#ffd700", flexShrink: 0 }}>→</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            今日の開催モード・参加条件・スケジュールは Epic Games 公式競技ページで確認してください
          </p>
          <span style={{
            alignSelf: "flex-start",
            fontSize: "11px",
            fontWeight: "700",
            color: "#ffd700",
            backgroundColor: "#ffd70018",
            border: "1px solid #ffd70033",
            borderRadius: "20px",
            padding: "3px 10px",
          }}>
            fortnite.com/competitive
          </span>
        </a>
      </section>

      {/* パッチノート */}
      <section>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "16px" }}>
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
            gap: "12px",
            padding: "20px 24px",
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
        >
          <div>
            <p style={{ fontSize: "16px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>
              Epic Games 公式パッチノート
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              各バージョンの変更内容・新機能の詳細はこちら
            </p>
          </div>
          <span style={{ fontSize: "22px", color: "var(--primary)", flexShrink: 0 }}>→</span>
        </a>
      </section>
    </>
  );
}
