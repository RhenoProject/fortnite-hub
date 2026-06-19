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

export default async function CompetitionPage() {
  const version = await fetchGameVersion().catch(() => null);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
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
