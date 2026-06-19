"use client";

type EventKind = "fncs" | "cashcup" | "open" | "none";

const kindStyle: Record<EventKind, { border: string; text: string; badgeBg: string }> = {
  fncs:    { border: "#ffd700", text: "#ffd700", badgeBg: "#ffd70020" },
  cashcup: { border: "#00e676", text: "#00e676", badgeBg: "#00e67620" },
  open:    { border: "#00c8ff", text: "#00c8ff", badgeBg: "#00c8ff20" },
  none:    { border: "var(--border)", text: "var(--text-muted)", badgeBg: "transparent" },
};

// その曜日（0=日〜6=土）の今週の日付を返す
function getDateThisWeek(dayOfWeek: number): Date {
  const today = new Date();
  const diff = dayOfWeek - today.getDay();
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return d;
}

function fmt(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const DAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

// 今週の主要な競技イベント（水〜日）
const weekEvents = [
  { dayIndex: 3, kind: "open"    as EventKind, label: "オープン大会",    sublabel: "ソロ / デュオ" },
  { dayIndex: 4, kind: "cashcup" as EventKind, label: "キャッシュカップ", sublabel: "デュオ部門" },
  { dayIndex: 5, kind: "cashcup" as EventKind, label: "キャッシュカップ", sublabel: "ソロ部門" },
  { dayIndex: 6, kind: "fncs"    as EventKind, label: "FNCS ヒート",      sublabel: "FNCS期間中のみ" },
  { dayIndex: 0, kind: "fncs"    as EventKind, label: "FNCS ファイナル", sublabel: "FNCS期間中のみ" },
];

const guides = [
  {
    kind: "fncs" as EventKind,
    emoji: "🥇",
    title: "FNCS",
    full: "フォートナイト チャンピオン シリーズ",
    badge: "最高峰",
    desc: "年間最大規模の公式競技。世界中のプロ・アマが参加できるオープン予選から始まり、グランドファイナルで賞金を争う。FNCSスキンなど限定報酬もある。",
  },
  {
    kind: "cashcup" as EventKind,
    emoji: "💰",
    title: "キャッシュカップ",
    full: "Cash Cup",
    badge: "毎週開催",
    desc: "毎週木・金に開催される賞金制大会。一定のランクに到達したプレイヤーが参加可能。上位入賞で賞金獲得のチャンス。",
  },
  {
    kind: "open" as EventKind,
    emoji: "🎮",
    title: "オープン大会",
    full: "Open Division",
    badge: "入門向け",
    desc: "誰でも参加できる日常大会。ランク戦と同じ競技形式で、大会に慣れるための練習に最適。賞金はないが競技経験を積める。",
  },
];

const links = [
  {
    href: "https://www.fortnite.com/competitive",
    title: "公式競技ページ",
    desc: "現在の開催スケジュール・賞金詳細・参加条件を確認",
    badge: "Epic公式",
    color: "#ffd700",
  },
  {
    href: "https://tracker.gg/fortnite",
    title: "Fortnite Tracker",
    desc: "プレイヤー名で自分の統計・ランク・KDを確認",
    badge: "無料",
    color: "#00c8ff",
  },
  {
    href: "https://www.twitch.tv/directory/game/Fortnite",
    title: "Twitch で観戦",
    desc: "大会の生配信・トッププロのプレイをリアルタイム観戦",
    badge: "観戦",
    color: "#9146ff",
  },
];

export function CompetitionClient() {
  const today = new Date();
  const todayIndex = today.getDay();

  return (
    <>
      <style>{`
        .comp-schedule-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .comp-schedule-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: var(--card);
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .comp-schedule-row.today {
          border-color: var(--primary);
          background: #00c8ff0a;
        }
        .comp-schedule-row.past {
          opacity: 0.45;
        }
        .comp-date-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 46px;
          flex-shrink: 0;
        }
        .comp-date-day {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .comp-date-num {
          font-size: 20px;
          font-weight: 900;
          line-height: 1.1;
          color: var(--text);
        }
        .comp-date-today-badge {
          font-size: 9px;
          font-weight: 700;
          color: var(--primary);
          margin-top: 2px;
        }
        .comp-event-info {
          flex: 1;
        }
        .comp-event-title {
          font-size: 14px;
          font-weight: 800;
          line-height: 1.3;
        }
        .comp-event-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .comp-event-badge {
          font-size: 10px;
          font-weight: 700;
          border-radius: 20px;
          padding: 3px 10px;
          flex-shrink: 0;
        }
        .comp-guide-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .comp-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .comp-link-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px 20px;
          background: var(--card);
          border-radius: 14px;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .comp-link-card:hover { opacity: 0.85; }
        @media (max-width: 639px) {
          .comp-guide-grid { grid-template-columns: 1fr; }
          .comp-links-grid { grid-template-columns: 1fr; }
          .comp-schedule-row { padding: 12px 14px; gap: 10px; }
          .comp-date-num { font-size: 18px; }
        }
      `}</style>

      {/* 免責バナー */}
      <div style={{
        background: "#ffd70012",
        border: "1px solid #ffd70033",
        borderRadius: "12px",
        padding: "12px 16px",
        marginBottom: "24px",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
          キャッシュカップの日程は毎週固定です。FNCS・オープン大会の詳細は
          <a href="https://www.fortnite.com/competitive" target="_blank" rel="noopener noreferrer"
            style={{ color: "#ffd700", textDecoration: "underline" }}>公式競技ページ</a>でご確認ください。
        </p>
      </div>

      {/* 今週の競技日程 */}
      <section style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
            📅 今週の競技日程
          </h2>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {today.getFullYear()}年{today.getMonth() + 1}月
          </span>
        </div>

        <div className="comp-schedule-list">
          {weekEvents.map(({ dayIndex, kind, label, sublabel }) => {
            const s = kindStyle[kind];
            const date = getDateThisWeek(dayIndex);
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday = dayIndex === todayIndex;
            const isFncs = kind === "fncs";

            return (
              <div
                key={dayIndex}
                className={`comp-schedule-row${isToday ? " today" : ""}${isPast ? " past" : ""}`}
                style={{ borderColor: !isPast && kind !== "none" ? s.border + "55" : undefined }}
              >
                {/* 日付ブロック */}
                <div className="comp-date-block">
                  <div className="comp-date-day" style={{ color: isToday ? "var(--primary)" : undefined }}>
                    {DAYS_JP[dayIndex]}曜
                  </div>
                  <div className="comp-date-num" style={{ color: isToday ? "var(--primary)" : undefined }}>
                    {fmt(date)}
                  </div>
                  {isToday && <div className="comp-date-today-badge">今日</div>}
                </div>

                {/* 仕切り */}
                <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />

                {/* イベント情報 */}
                <div className="comp-event-info">
                  <div className="comp-event-title" style={{ color: s.text }}>
                    {label}
                  </div>
                  <div className="comp-event-sub">
                    {sublabel}
                    {isFncs && (
                      <span style={{
                        marginLeft: "8px",
                        fontSize: "10px",
                        color: "#ffd700",
                        backgroundColor: "#ffd70015",
                        border: "1px solid #ffd70033",
                        borderRadius: "10px",
                        padding: "1px 6px",
                      }}>
                        FNCS期間中のみ
                      </span>
                    )}
                  </div>
                </div>

                {/* バッジ */}
                <span
                  className="comp-event-badge"
                  style={{
                    color: s.border,
                    backgroundColor: s.badgeBg,
                    border: `1px solid ${s.border}44`,
                  }}
                >
                  {kind === "cashcup" ? "毎週固定" : kind === "open" ? "毎週" : "期間限定"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 大会種別ガイド */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "16px" }}>
          🎮 大会種別ガイド
        </h2>
        <div className="comp-guide-grid">
          {guides.map(({ kind, emoji, title, full, badge, desc }) => {
            const s = kindStyle[kind];
            return (
              <div key={kind} style={{
                background: "var(--card)",
                borderRadius: "14px",
                padding: "20px",
                border: `1px solid ${s.border}44`,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px", gap: "8px" }}>
                  <div>
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>{emoji}</div>
                    <div style={{ fontSize: "16px", fontWeight: "900", color: s.text }}>{title}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{full}</div>
                  </div>
                  <span style={{
                    fontSize: "10px", fontWeight: "700", flexShrink: 0,
                    color: s.border, backgroundColor: s.badgeBg,
                    border: `1px solid ${s.border}44`, borderRadius: "20px", padding: "2px 8px",
                  }}>
                    {badge}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 参加方法 */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "16px" }}>
          📋 競技に参加するには
        </h2>
        <div style={{ background: "var(--card)", borderRadius: "14px", padding: "20px 24px", border: "1px solid var(--border)" }}>
          <ol style={{ paddingLeft: "22px", margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { step: "ランク戦でランクを上げる", note: "キャッシュカップは一定ランク以上のプレイヤーが参加可能。FNCSのオープン予選は誰でも参加できる" },
              { step: "ゲーム内「競技」タブを開く", note: "エントリーはゲーム内で完結。外部サイトへの登録は不要" },
              { step: "開催中の大会を選んで参加", note: "開始時間になったらエントリーして試合を続けてポイントを稼ぐ" },
              { step: "上位入賞で賞金・限定報酬を獲得", note: "FNCSは限定コスメティック報酬あり。キャッシュカップは賞金獲得のチャンス" },
            ].map(({ step, note }, i) => (
              <li key={i} style={{ fontSize: "14px", fontWeight: "700", color: "var(--text)" }}>
                {step}
                <div style={{ fontSize: "12px", fontWeight: "400", color: "var(--text-muted)", marginTop: "2px" }}>{note}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* リンク集 */}
      <section>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "16px" }}>
          🔗 競技勢向けリンク集
        </h2>
        <div className="comp-links-grid">
          {links.map(({ href, title, desc, badge, color }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="comp-link-card"
              style={{ border: `1px solid ${color}33` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800", color: "var(--text)" }}>{title}</span>
                <span style={{
                  fontSize: "10px", fontWeight: "700", flexShrink: 0,
                  color, backgroundColor: color + "18", border: `1px solid ${color}33`,
                  borderRadius: "20px", padding: "2px 8px",
                }}>
                  {badge}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              <span style={{ fontSize: "11px", color, marginTop: "auto" }}>開く →</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
