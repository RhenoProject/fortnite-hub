import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "フォートナイト Vバックスの値段・お得な買い方【2026年最新版】| フォトナHub",
  description:
    "フォートナイトのVバックス価格一覧（1,000・2,800・5,000・13,500）と最もお得な購入方法を徹底解説。クルーパックとの比較・ギフトカード活用法も紹介。",
  keywords: [
    "Vバックス 値段",
    "Vバックス 購入 お得",
    "フォートナイト Vバックス 買い方",
    "Vバックス 1000 値段",
    "Vバックス クルーパック",
    "フォートナイト 課金",
  ],
  openGraph: {
    title: "フォートナイト Vバックスの値段・お得な買い方【2026年最新版】| フォトナHub",
    description:
      "Vバックスの価格一覧と最もお得な購入方法を解説。クルーパックとの比較・ギフトカード活用法も。",
    url: "https://fortnite-hub-delta.vercel.app/guides/vbucks",
  },
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/guides/vbucks" },
};

const PRICE_TABLE = [
  { amount: "1,000", price: "¥1,100", unit: "¥1.10/V", note: "" },
  { amount: "2,800", price: "¥2,750", unit: "¥0.98/V", note: "ボーナス300V込み" },
  { amount: "5,000", price: "¥4,950", unit: "¥0.99/V", note: "ボーナス500V込み" },
  { amount: "13,500", price: "¥13,200", unit: "¥0.98/V", note: "ボーナス3,500V込み" },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "フォートナイトのVバックスはいくらですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "日本では1,000 V-Bucksが¥1,100から購入できます。2,800・5,000・13,500のパックはボーナスV-Bucksがつき単価がお得になります。",
        },
      },
      {
        "@type": "Question",
        name: "Vバックスを最もお得に買う方法は？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "月額¥1,980のFortnite Crewが最もコスパが良いです。毎月1,000 V-Bucks＋バトルパス＋限定スキンが付いてきます。バトルパスは単体で¥950相当なので実質V-Bucksと限定スキンが¥1,030で手に入る計算です。",
        },
      },
      {
        "@type": "Question",
        name: "Vバックスはどこで購入できますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Epic Gamesの公式サイト・Epicランチャー・PlayStation Store・Microsoft Store・Nintendo eShop・Fortniteアプリ内から購入できます。",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "フォトナHub", item: "https://fortnite-hub-delta.vercel.app" },
      { "@type": "ListItem", position: 2, name: "ガイド", item: "https://fortnite-hub-delta.vercel.app/guides/vbucks" },
      { "@type": "ListItem", position: 3, name: "Vバックス購入ガイド", item: "https://fortnite-hub-delta.vercel.app/guides/vbucks" },
    ],
  },
];

export default function VBucksGuidePage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* パンくず */}
      <nav style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
        <a href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>フォトナHub</a>
        {" › "}
        <span>Vバックス購入ガイド</span>
      </nav>

      <h1 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, color: "var(--text)", lineHeight: 1.3, marginBottom: 8 }}>
        フォートナイト Vバックスの値段・お得な買い方
        <span style={{ display: "block", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 600, color: "var(--text-muted)", marginTop: 4 }}>
          【2026年最新版】
        </span>
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.7 }}>
        フォートナイトの課金通貨「V-Bucks（Vバックス）」の価格一覧と、最もお得な購入方法を解説します。
        クルーパックとの比較・ギフトカード活用法もまとめました。
      </p>

      {/* 価格表 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 14 }}>
          Vバックス 価格一覧（日本円）
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
                {["Vバックス数", "価格（税込）", "単価", "備考"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICE_TABLE.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px", fontWeight: 800, color: "#00c8ff", fontSize: 15 }}>{row.amount} V</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "var(--text)" }}>{row.price}</td>
                  <td style={{ padding: "12px", color: "var(--text-muted)" }}>{row.unit}</td>
                  <td style={{ padding: "12px", fontSize: 12, color: "var(--text-muted)" }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
          ※ 価格は変更される場合があります。最新情報は
          <a href="https://www.epicgames.com/fortnite/ja/vbuckscard" target="_blank" rel="noopener noreferrer" style={{ color: "#00c8ff" }}> Epic Games公式サイト</a>
          でご確認ください。
        </p>
      </section>

      {/* クルーパック */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 14 }}>
          最もお得な買い方は？→ Fortnite Crew
        </h2>
        <div style={{
          background: "linear-gradient(135deg, #0a1628, #0d2040)",
          border: "1px solid #00c8ff44",
          borderRadius: 14,
          padding: "20px",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>👑</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: "#00c8ff" }}>Fortnite Crew（月額 ¥1,980）</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text)", lineHeight: 2, fontSize: 14 }}>
            <li><strong style={{ color: "#00c8ff" }}>毎月 1,000 V-Bucks</strong>（単体購入なら¥1,100相当）</li>
            <li><strong style={{ color: "#00c8ff" }}>チャプターバトルパス</strong>（単体¥950相当）</li>
            <li><strong style={{ color: "#00c8ff" }}>限定スキン・バックパック・ピッケル</strong>（毎月更新）</li>
          </ul>
          <p style={{ marginTop: 14, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            合計価値は <strong style={{ color: "white" }}>¥2,050以上</strong> → ¥1,980で入手できるので <strong style={{ color: "#4ade80" }}>70円以上お得</strong>。
            バトルパスを毎シーズン買っているなら<strong style={{ color: "#4ade80" }}>迷わずCrew一択</strong>です。
          </p>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
          ただし毎月自動更新なので、プレイしない月は解約を忘れずに。
          解約はEpic Gamesアカウント管理ページから行えます。
        </p>
      </section>

      {/* 大容量パック */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 14 }}>
          Crewを使わないなら 13,500Vパックが単価最安
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 12 }}>
          1回にまとめて買うなら <strong style={{ color: "white" }}>13,500 V-Bucks（¥13,200）</strong> が単価 <strong style={{ color: "#00c8ff" }}>¥0.98/V</strong> で最安です。
          ボーナス3,500Vがついてくるため、実質10,000Vを¥13,200で買うようなお得感があります。
        </p>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
          小額パック（1,000V: ¥1.10/V）は単価が割高なので、まとめ買いを推奨します。
        </p>
      </section>

      {/* 購入方法 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 14 }}>
          Vバックスの購入方法（どこで買える？）
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "🌐", title: "Epic Games公式サイト・ランチャー", desc: "PC・Mac から直接購入。クレカ・PayPal・コンビニ支払い対応。" },
            { icon: "🎮", title: "PlayStation Store", desc: "PS4・PS5からはPS Storeで購入。PayPayなどでPSストアカードを買えばスマホ決済可能。" },
            { icon: "🪟", title: "Microsoft Store", desc: "Xbox Series X|S・Xbox OneはMicrosoft Storeから購入。" },
            { icon: "📱", title: "スマートフォン（iOS/Android）", desc: "Fortniteアプリ内課金から購入。App Store・Google Playの決済手段が使えます。" },
            { icon: "🎴", title: "Vバックスギフトカード（コンビニ・Amazon）", desc: "物理カードをコンビニやAmazonで購入→コードを入力する方法。プレゼントにも便利。" },
          ].map((item) => (
            <div key={item.title} style={{
              display: "flex", gap: 14, alignItems: "flex-start",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "14px 16px",
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 注意事項 */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "var(--text)", marginBottom: 14 }}>
          注意事項
        </h2>
        <div style={{
          background: "#1a0a00", border: "1px solid #ff6b0044",
          borderRadius: 12, padding: "16px 20px",
        }}>
          <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-muted)", lineHeight: 2, fontSize: 13 }}>
            <li><strong style={{ color: "#ff9944" }}>Vバックスは返金不可</strong>です。購入前に必要数を確認しましょう。</li>
            <li>プラットフォーム（PS/Xbox/PC）をまたいで<strong style={{ color: "#ff9944" }}>Vバックスの移動はできません</strong>。ただしアカウント統合後は共有されます。</li>
            <li>非公式サイトでの購入はアカウント停止リスクがあります。<strong style={{ color: "#ff9944" }}>必ず公式・正規販売店で購入</strong>してください。</li>
            <li>セール情報はEpic公式やフォトナHub でチェックしましょう。</li>
          </ul>
        </div>
      </section>

      {/* ショップリンク */}
      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <a href="/" style={{
          display: "inline-block", padding: "12px 28px", borderRadius: 12,
          background: "#00c8ff22", border: "1px solid #00c8ff55",
          color: "#00c8ff", textDecoration: "none", fontWeight: 800, fontSize: 14,
        }}>
          今日のショップを確認する →
        </a>
      </div>
    </div>
  );
}
