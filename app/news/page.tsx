import { fetchFortniteNews } from "@/lib/fortniteApi";
import { NewsClient } from "@/components/NewsClient";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "フォートナイト最新ニュース | フォトナHub",
  description: "フォートナイトの最新ニュース・アップデート情報をいち早くチェック。バトルロイヤル・STW・クリエイティブの情報をまとめて確認できます。",
};

export default async function NewsPage() {
  let items = await fetchFortniteNews().catch(() => []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "4px" }}>
          📰 フォートナイト最新ニュース
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          タップで詳細を読めます
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <NewsClient items={items} />
      )}
    </div>
  );
}
