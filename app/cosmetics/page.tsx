import { fetchNewCosmetics } from "@/lib/shopApi";
import { CosmeticsClient } from "@/components/CosmeticsClient";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "新着コスメティック | フォトナHub",
  description: "フォートナイトに新しく追加されたコスメティック・楽曲・車・レゴを一覧でチェック。",
};

export default async function CosmeticsPage() {
  let items = await fetchNewCosmetics().catch(() => []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{
          fontSize: "22px", fontWeight: "900", color: "var(--text)",
          letterSpacing: "1px", marginBottom: "4px",
        }}>
          ✨ 新着コスメティック
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          最近フォートナイトに追加されたアイテム一覧
        </p>
        <p style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "var(--text-muted)",
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "6px 12px",
          display: "inline-block",
        }}>
          ※ APIの仕様により、一部のアイテムは表示されない場合があります
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <CosmeticsClient items={items} />
      )}
    </div>
  );
}
