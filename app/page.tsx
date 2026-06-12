import { fetchShop, rarityColors, ShopEntry, ShopItem, ShopBundle } from "@/lib/shopApi";
import Image from "next/image";

export const revalidate = 600;

function ItemCard({ item, large }: { item: ShopItem; large?: boolean }) {
  const color = rarityColors[item.rarity] ?? rarityColors.common;
  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid ${color}44`,
      display: "flex",
      flexDirection: "column",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes={large ? "(max-width: 640px) 50vw, 220px" : "(max-width: 640px) 33vw, 160px"}
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "var(--border)" }} />
      )}
      <div style={{ height: "3px", backgroundColor: color }} />
      <div style={{ padding: large ? "10px" : "8px" }}>
        <p style={{ fontSize: large ? "11px" : "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "2px" }}>
          {item.rarityDisplay || item.typeDisplay}
        </p>
        <p style={{
          fontSize: large ? "13px" : "12px",
          fontWeight: "700", color: "var(--text)", lineHeight: 1.3, marginBottom: "6px",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {item.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: large ? "13px" : "12px" }}>⟁</span>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: large ? "13px" : "12px" }}>{item.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function BundleCard({ bundle, large }: { bundle: ShopBundle; large?: boolean }) {
  const color = rarityColors[bundle.rarity] ?? rarityColors.legendary;
  return (
    <div style={{
      backgroundColor: "var(--card)",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid ${color}66`,
      display: "flex",
      flexDirection: "column",
      gridColumn: large ? "span 2" : "span 2",
    }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {bundle.image ? (
          <div style={{ position: "relative", width: "50%", aspectRatio: "1/1", flexShrink: 0 }}>
            <Image
              src={bundle.image}
              alt={bundle.name}
              fill
              sizes="(max-width: 640px) 50vw, 200px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div style={{ width: "50%", aspectRatio: "1/1", backgroundColor: "var(--border)", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "800",
              backgroundColor: `${color}22`,
              color: color,
              border: `1px solid ${color}55`,
              marginBottom: "6px",
            }}>
              セット {bundle.itemCount}点
            </span>
            <p style={{
              fontSize: "13px", fontWeight: "800", color: "var(--text)", lineHeight: 1.3,
              overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any,
            }}>
              {bundle.name}
            </p>
          </div>
          <div>
            {bundle.icons.length > 0 && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
                {bundle.icons.map((icon, i) => (
                  <div key={i} style={{ position: "relative", width: "28px", height: "28px", borderRadius: "4px", overflow: "hidden", backgroundColor: "var(--border)" }}>
                    <Image src={icon} alt="" fill sizes="28px" style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "13px" }}>⟁</span>
              <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "13px" }}>{bundle.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "3px", backgroundColor: color }} />
    </div>
  );
}

export default async function ShopPage() {
  let entries: ShopEntry[] = [];
  let error = false;

  try {
    entries = await fetchShop();
  } catch {
    error = true;
  }

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });

  const featured = entries.filter(e => e.featured);
  const regular = entries.filter(e => !e.featured);
  const bundleCount = entries.filter(e => e.kind === "bundle").length;
  const itemCount = entries.filter(e => e.kind === "item").length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px", marginBottom: "4px" }}>
          🛍️ 今日のアイテムショップ
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{today}</p>
      </div>

      {error ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>データを読み込めませんでした</p>
          <p style={{ fontSize: "13px" }}>しばらくしてからリロードしてください</p>
        </div>
      ) : (
        <>
          {/* 今日のおすすめ */}
          {featured.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
                  今日のおすすめ
                </h2>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Epic公式が注目するアイテム</span>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px",
              }}>
                {featured.map((entry) =>
                  entry.kind === "bundle"
                    ? <BundleCard key={entry.id} bundle={entry} large />
                    : <ItemCard key={entry.id} item={entry} large />
                )}
              </div>
            </section>
          )}

          {/* 全アイテム */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px" }}>
                🛒 全アイテム
              </h2>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {bundleCount > 0 && `セット ${bundleCount}件・`}アイテム {itemCount}件
              </span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "10px",
            }}>
              {regular.map((entry) =>
                entry.kind === "bundle"
                  ? <BundleCard key={entry.id} bundle={entry} />
                  : <ItemCard key={entry.id} item={entry} />
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
