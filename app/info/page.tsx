import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "サイト更新情報 | フォトナHub",
  description: "フォトナHubの最新機能・更新情報をまとめてチェック。プッシュ通知・ほしいものリスト・全スキン検索など便利機能を随時追加中。",
};

const features = [
  { icon: "🛍️", title: "アイテムショップ", desc: "今日のショップを毎日自動更新。フィルター・検索で素早く確認。" },
  { icon: "📰", title: "最新ニュース", desc: "フォートナイトの公式ニュースを日本語で自動取得。" },
  { icon: "🏆", title: "アプデ・競技情報", desc: "最新バージョン・競技日程・パッチノートをまとめて確認。" },
  { icon: "🔔", title: "プッシュ通知", desc: "毎日9:05 JSTにショップ更新通知。欲しいスキンが出たら特別通知。" },
  { icon: "❤️", title: "ほしいものリスト", desc: "❤️ボタンで登録したスキンがショップに出たときだけ通知。" },
  { icon: "🔍", title: "全スキン検索", desc: "数千件の全コスメティックから名前で検索。ショップ外も登録可。" },
];

const updates = [
  {
    date: "2026年6月16日",
    version: "v1.3",
    color: "#00c8ff",
    title: "プッシュ通知・全スキン検索・ほしいものリスト",
    items: [
      "毎日9:05 JSTにアイテムショップ更新をプッシュ通知で配信",
      "欲しいスキンがショップに出たときだけ通知が届くほしいものリスト機能",
      "全コスメティック（数千件）から名前で検索可能（ショップ外スキンも対象）",
      "ほしいものリストをボトムシートでかんたん確認・削除",
    ],
  },
  {
    date: "2026年6月15日",
    version: "v1.2",
    color: "#ff9800",
    title: "SEO強化・OBSオーバーレイ",
    items: [
      "Google Search Console 登録・サイトマップ送信",
      "ショップページSEO強化（タイトル・説明文・キーワード最適化）",
      "OBS配信オーバーレイ（/overlay）— 配信中にサイトを宣伝できる",
    ],
  },
  {
    date: "2026年6月14日",
    version: "v1.0",
    color: "#4CAF50",
    title: "フォトナHub 公開",
    items: [
      "アイテムショップページ（10分ごと自動更新）",
      "フォートナイト最新ニュース（日本語のみ・5分ごと自動更新）",
      "アップデート・競技情報ページ",
      "クリエイターコード RHENO バナー設置",
    ],
  },
];

const upcoming = [
  "X（Twitter）毎日ショップ自動投稿",
  "カスタムドメイン取得",
  "クリエイター応援ページ（フォートナイト系ストリーマー・選手掲載）",
  "Google AdSense（月1万PV到達後）",
];

export default function InfoPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "8px" }}>
          📋 フォトナHub について
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
          フォートナイトのアイテムショップ・ニュースをいち早くチェックできる日本語情報サイトです。
          毎日自動更新・プッシュ通知対応。スマホでも快適に使えます。
        </p>
      </div>

      {/* 機能一覧 */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", marginBottom: "14px", letterSpacing: "1px" }}>
          ✨ 主な機能
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "10px",
        }}>
          {features.map(f => (
            <div key={f.title} style={{
              backgroundColor: "var(--card)",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              padding: "14px",
            }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{f.icon}</div>
              <p style={{ fontSize: "13px", fontWeight: "800", color: "var(--text)", marginBottom: "4px" }}>{f.title}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 通知登録CTA */}
      <div style={{
        backgroundColor: "#00c8ff12",
        border: "1px solid #00c8ff33",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "40px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "24px" }}>🔔</span>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <p style={{ fontSize: "14px", fontWeight: "800", color: "var(--text)", marginBottom: "2px" }}>
            プッシュ通知を受け取ろう
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            毎日9:05 JSTにショップ更新をお知らせ。欲しいスキンが出たときは特別通知が届きます。
          </p>
        </div>
        <Link href="/" style={{
          display: "inline-block",
          backgroundColor: "var(--primary)",
          color: "#0a0f1a",
          fontWeight: "800",
          fontSize: "12px",
          padding: "8px 14px",
          borderRadius: "8px",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>
          ショップで登録 →
        </Link>
      </div>

      {/* 更新履歴 */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", marginBottom: "20px", letterSpacing: "1px" }}>
          🕐 更新履歴
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {updates.map(u => (
            <div key={u.version} style={{
              display: "flex",
              gap: "16px",
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  backgroundColor: u.color, marginTop: "4px", flexShrink: 0,
                }} />
                <div style={{ width: "2px", flex: 1, backgroundColor: "var(--border)", marginTop: "6px" }} />
              </div>
              <div style={{ paddingBottom: "8px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: "800", color: u.color,
                    backgroundColor: `${u.color}18`, border: `1px solid ${u.color}44`,
                    borderRadius: "20px", padding: "2px 8px",
                  }}>
                    {u.version}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{u.date}</span>
                </div>
                <p style={{ fontSize: "14px", fontWeight: "800", color: "var(--text)", marginBottom: "8px" }}>
                  {u.title}
                </p>
                <ul style={{ paddingLeft: "0", margin: 0, listStyle: "none" }}>
                  {u.items.map((item, i) => (
                    <li key={i} style={{
                      fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.7,
                      paddingLeft: "14px", position: "relative",
                    }}>
                      <span style={{
                        position: "absolute", left: 0, top: "7px",
                        width: "5px", height: "5px", borderRadius: "50%",
                        backgroundColor: "var(--border)", display: "inline-block",
                      }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 今後の予定 */}
      <section>
        <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", marginBottom: "14px", letterSpacing: "1px" }}>
          🔮 今後の予定
        </h2>
        <div style={{
          backgroundColor: "var(--card)",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          padding: "16px",
        }}>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {upcoming.map((item, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "8px",
                fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6,
                paddingBottom: i < upcoming.length - 1 ? "8px" : 0,
                borderBottom: i < upcoming.length - 1 ? "1px solid var(--border)" : "none",
                marginBottom: i < upcoming.length - 1 ? "8px" : 0,
              }}>
                <span style={{ color: "var(--primary)", flexShrink: 0, fontSize: "11px", marginTop: "3px" }}>▶</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "10px" }}>
          ※ 予定は変更になる場合があります
        </p>
      </section>
    </div>
  );
}
