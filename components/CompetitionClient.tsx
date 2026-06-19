"use client";

type EventKind = "fncs" | "cashcup" | "open" | "none";

const kindStyle: Record<EventKind, { border: string; text: string; badgeBg: string }> = {
  fncs:    { border: "#ffd700", text: "#ffd700", badgeBg: "#ffd70020" },
  cashcup: { border: "#00e676", text: "#00e676", badgeBg: "#00e67620" },
  open:    { border: "#00c8ff", text: "#00c8ff", badgeBg: "#00c8ff20" },
  none:    { border: "var(--border)", text: "var(--text-muted)", badgeBg: "transparent" },
};


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
    desc: "定期的に開催される賞金制大会。一定のランクに到達したプレイヤーが参加可能。上位入賞で賞金獲得のチャンスがある。ソロ・デュオの2種類が別日程で実施される。",
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

  return (
    <>
      <style>{`
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
        }
      `}</style>

      {/* 公式ページ誘導リンク */}
      <a
        href="https://www.fortnite.com/competitive"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "14px 18px",
          marginBottom: "24px",
          background: "var(--card)",
          border: "1px solid #ffd70044",
          borderRadius: "12px",
          textDecoration: "none",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--text)", marginBottom: "2px" }}>
            Epic Games 公式競技ページ
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            最新の開催日程・賞金・参加条件はこちらで確認
          </div>
        </div>
        <span style={{ fontSize: "20px", color: "#ffd700", flexShrink: 0 }}>→</span>
      </a>


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
