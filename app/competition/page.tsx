import { fetchGameVersion } from "@/lib/fortniteApi";
import { CompetitionClient } from "@/components/CompetitionClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "フォートナイト 競技日程・大会スケジュール | フォトナHub",
  description: "フォートナイト競技の週間スケジュール・FNCS・キャッシュカップ・オープンリーグの開催日時を確認。競技参加方法や公式リンクも掲載。",
  openGraph: {
    title: "フォートナイト 競技日程・大会スケジュール | フォトナHub",
    description: "FNCS・キャッシュカップ・オープンリーグの日程を確認。",
  },
  twitter: {
    title: "フォートナイト 競技日程・大会スケジュール | フォトナHub",
    description: "FNCS・キャッシュカップ・オープンリーグの日程を確認。",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "FNCSとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FNCS（Fortnite Champion Series）はフォートナイトの世界最高峰の競技大会です。毎シーズン複数ラウンドが開催され、上位プレイヤーが賞金と世界大会への出場権を賭けて競います。日本ではアジア・パシフィックリージョンに参加できます。",
      },
    },
    {
      "@type": "Question",
      name: "キャッシュカップはどんな大会ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "キャッシュカップは毎週開催されるフォートナイトの公式大会です。上位入賞者にはV-Bucksや賞金が授与されます。誰でも参加でき、ゲーム内の「競技」タブから参加登録できます。",
      },
    },
    {
      "@type": "Question",
      name: "オープンリーグとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "オープンリーグはフォートナイトの誰でも参加できる競技モードです。実力に応じてオープン・コンテンダー・チャンピオンの3リーグがあり、ポイントを積み上げてランクアップを目指します。",
      },
    },
    {
      "@type": "Question",
      name: "フォートナイトの競技大会はどこで参加できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "フォートナイトの競技大会はゲーム内「競技」タブから参加できます。キャッシュカップやFNCSオープン予選など、様々な大会が定期開催されています。",
      },
    },
  ],
};

export default async function CompetitionPage() {
  const version = await fetchGameVersion().catch(() => null);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px" }}>
            🏆 競技日程・大会スケジュール
          </h1>
          {version && (
            <span style={{
              fontSize: "12px", fontWeight: "700",
              color: "var(--primary)",
              backgroundColor: "#00c8ff18",
              border: "1px solid #00c8ff33",
              borderRadius: "20px", padding: "3px 10px",
            }}>
              v{version.version}
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          FNCS・キャッシュカップ・オープンリーグの開催スケジュール
        </p>
      </div>

      <CompetitionClient />
    </div>
  );
}
