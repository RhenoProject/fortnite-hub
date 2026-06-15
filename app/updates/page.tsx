import { fetchGameVersion } from "@/lib/fortniteApi";
import { UpdatesClient } from "@/components/UpdatesClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "フォートナイト アップデート・パッチノート | フォトナHub",
  description: "フォートナイトの最新アップデート情報・パッチノート・バージョン・競技日程をまとめてチェック。新シーズン・新武器・バランス調整もここで確認。",
  openGraph: {
    title: "フォートナイト アップデート・パッチノート | フォトナHub",
    description: "フォートナイトの最新アップデート・パッチノート・競技日程を確認。",
  },
  twitter: {
    title: "フォートナイト アップデート・パッチノート | フォトナHub",
    description: "フォートナイトの最新アップデート・パッチノート・競技日程を確認。",
  },
};

export default async function UpdatesPage() {
  const version = await fetchGameVersion().catch(() => null);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px" }}>
            🏆 アップデート・競技情報
          </h1>
          {version && (
            <span style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--primary)",
              backgroundColor: "#00c8ff18",
              border: "1px solid #00c8ff33",
              borderRadius: "20px",
              padding: "3px 10px",
            }}>
              v{version.version}
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          競技日程とパッチノートを確認
        </p>
      </div>

      <UpdatesClient />
    </div>
  );
}
