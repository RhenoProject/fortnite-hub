"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopEntry, ShopItem, ShopBundle, rarityColors } from "@/lib/shopApi";
import {
  getWishlist, getWishlistItems, saveWishlistItems,
  syncWishlistToServer, WishlistItem,
} from "@/lib/pushUtils";

const ALL = "all";
const BUNDLE = "bundle";

const typeLabels: Record<string, string> = {
  outfit: "コスチューム",
  backpack: "バックアクセサリー",
  pickaxe: "ツルハシ",
  emote: "エモート",
  glider: "グライダー",
  wrap: "ラップ",
  shoe: "シューズ",
  sidekick: "バディ",
  spray: "スプレー",
  emoji: "エモートアイコン",
};

interface WishableItem {
  id: string;
  name: string;
  image: string;
  rarity: string;
  price: number;
}

interface CosmeticSearchResult {
  id: string;
  name: string;
  image: string;
  rarity: string;
  typeDisplay: string;
}

function ItemCard({
  item, large, wished, onToggleWish,
}: {
  item: ShopItem; large?: boolean; wished: boolean; onToggleWish: (item: WishableItem) => void;
}) {
  const color = rarityColors[item.rarity] ?? rarityColors.common;
  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "12px", overflow: "hidden",
      border: `1px solid ${color}44`, display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
          <Image src={item.image} alt={item.name} fill
            sizes={large ? "(max-width: 640px) 50vw, 220px" : "(max-width: 640px) 50vw, 160px"}
            style={{ objectFit: "cover" }} />
          <button
            onClick={() => onToggleWish(item)}
            aria-label={wished ? "ほしいものリストから削除" : "ほしいものリストに追加"}
            style={{
              position: "absolute", top: "6px", right: "6px",
              background: "rgba(0,0,0,0.55)",
              border: "none", borderRadius: "50%",
              width: "34px", height: "34px", fontSize: "16px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s",
            }}
          >
            {wished ? "❤️" : "🤍"}
          </button>
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "var(--border)" }} />
      )}
      <div style={{ height: "3px", backgroundColor: color }} />
      <div style={{ padding: large ? "10px" : "8px" }}>
        <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "2px" }}>
          {item.rarityDisplay || item.typeDisplay}
        </p>
        <p style={{
          fontSize: large ? "13px" : "12px", fontWeight: "700", color: "var(--text)", lineHeight: 1.3, marginBottom: "6px",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {item.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "13px" }}>⟁</span>
          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "13px" }}>{item.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({
  item, inShop, shopPrice, wished, onToggleWish,
}: {
  item: CosmeticSearchResult;
  inShop: boolean;
  shopPrice?: number;
  wished: boolean;
  onToggleWish: (item: WishableItem) => void;
}) {
  const color = rarityColors[item.rarity] ?? rarityColors.common;
  return (
    <Link href={`/cosmetics/${item.id}`} style={{
      backgroundColor: "var(--card)", borderRadius: "12px", overflow: "hidden",
      border: `1px solid ${color}44`, display: "flex", flexDirection: "column",
      textDecoration: "none",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 50vw, 160px" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "var(--border)" }} />
        )}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          backgroundColor: inShop ? "rgba(0,180,80,0.88)" : "rgba(0,0,0,0.55)",
          fontSize: "9px", fontWeight: "800",
          color: inShop ? "white" : "#999",
          textAlign: "center", padding: "3px 4px", lineHeight: 1.4,
        }}>
          {inShop ? "🛍️ 今日のショップにあります！" : "ショップ外"}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWish({ id: item.id, name: item.name, image: item.image, rarity: item.rarity, price: shopPrice ?? 0 }); }}
          aria-label={wished ? "ほしいものリストから削除" : "ほしいものリストに追加"}
          style={{
            position: "absolute", top: "6px", right: "6px",
            background: "rgba(0,0,0,0.55)",
            border: "none", borderRadius: "50%",
            width: "34px", height: "34px", fontSize: "16px",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {wished ? "❤️" : "🤍"}
        </button>
      </div>
      <div style={{ height: "3px", backgroundColor: color }} />
      <div style={{ padding: "8px" }}>
        <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "2px" }}>
          {item.typeDisplay}
        </p>
        <p style={{
          fontSize: "12px", fontWeight: "700", color: "var(--text)", lineHeight: 1.3, marginBottom: "6px",
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
        }}>
          {item.name}
        </p>
        {inShop && shopPrice != null && (
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>⟁</span>
            <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>{shopPrice.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function BundleCard({ bundle }: { bundle: ShopBundle }) {
  const color = rarityColors[bundle.rarity] ?? rarityColors.legendary;
  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "12px", overflow: "hidden",
      border: `1px solid ${color}66`, display: "flex", flexDirection: "column",
      gridColumn: "span 2",
    }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {bundle.image ? (
          <div style={{ position: "relative", width: "50%", aspectRatio: "1/1", flexShrink: 0 }}>
            <Image src={bundle.image} alt={bundle.name} fill sizes="(max-width: 640px) 50vw, 200px" style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <div style={{ width: "50%", aspectRatio: "1/1", backgroundColor: "var(--border)", flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{
              display: "inline-block", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "800",
              backgroundColor: `${color}22`, color, border: `1px solid ${color}55`, marginBottom: "6px",
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

export function ShopClient({ featured, regular }: { featured: ShopEntry[]; regular: ShopEntry[] }) {
  const [filter, setFilter] = useState<string>(ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState<CosmeticSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shopItemMap = useMemo(() => {
    const map = new Map<string, ShopItem>();
    [...featured, ...regular].forEach(e => {
      if (e.kind === "item") map.set(e.id, e as ShopItem);
    });
    return map;
  }, [featured, regular]);

  useEffect(() => {
    const ids = getWishlist();
    const items = getWishlistItems();
    setWishlist(new Set(ids));
    if (ids.length > 0 && items.length === 0) {
      const allShopItems = [...featured, ...regular].filter(e => e.kind === "item") as ShopItem[];
      const migrated = allShopItems
        .filter(e => ids.includes(e.id))
        .map(e => ({ id: e.id, name: e.name, image: e.image, rarity: e.rarity, price: e.price }));
      if (migrated.length > 0) { saveWishlistItems(migrated); setWishlistItems(migrated); }
    } else {
      setWishlistItems(items);
    }
  }, [featured, regular]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) { setApiResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cosmetics/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setApiResults(json.items ?? []);
      } catch { setApiResults([]); } finally { setIsSearching(false); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const toggleWish = useCallback((item: WishableItem) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      syncWishlistToServer(Array.from(next));
      return next;
    });
    setWishlistItems((prev) => {
      const exists = prev.find(i => i.id === item.id);
      const newItems = exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
      saveWishlistItems(newItems);
      return newItems;
    });
  }, []);

  const allEntries = useMemo(() => [...featured, ...regular], [featured, regular]);

  const availableTypes = Array.from(
    new Set(allEntries.filter(e => e.kind === "item").map(e => (e as ShopItem).typeValue).filter(Boolean))
  );
  const bundleCount = allEntries.filter(e => e.kind === "bundle").length;
  const filteredRegular = filter === ALL
    ? regular
    : filter === BUNDLE
      ? allEntries.filter(e => e.kind === "bundle")
      : allEntries.filter(e => e.kind === "item" && (e as ShopItem).typeValue === filter);

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
    cursor: "pointer",
    border: filter === key ? "none" : "1px solid rgba(0, 195, 240, 0.20)",
    backgroundColor: filter === key ? "var(--primary)" : "rgba(0, 195, 240, 0.08)",
    color: filter === key ? "#0a0f1a" : "var(--text-muted)",
    transition: "all 0.15s", whiteSpace: "nowrap" as const, flexShrink: 0,
    minHeight: "36px",
  });

  const wishCount = wishlistItems.length;
  const inShopCount = wishlistItems.filter(w => shopItemMap.has(w.id)).length;
  const showSearch = searchQuery.trim().length >= 1;

  return (
    <>
      <style>{`
        /* モバイル: カードグリッド2列固定 */
        .shop-grid-featured {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }
        .shop-grid-regular {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
          gap: 10px;
        }
        @media (max-width: 480px) {
          .shop-grid-featured { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .shop-grid-regular  { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }

        /* フィルタータブ: 横スクロール＋スクロールバー非表示 */
        .filter-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 16px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .filter-tabs::-webkit-scrollbar { display: none; }

        /* ほしいものリストバナー */
        .wl-banner {
          display: flex; align-items: center; gap: 12px;
          border-radius: 14px; padding: 14px 16px;
          margin-bottom: 16px; width: 100%; cursor: pointer;
          text-align: left; border-width: 1.5px; border-style: solid;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .wl-banner.in-shop {
          background: linear-gradient(135deg, rgba(0,220,90,0.13) 0%, rgba(0,180,70,0.06) 100%);
          border-color: rgba(0,220,90,0.50);
          animation: wl-glow 2.8s ease-in-out infinite;
        }
        .wl-banner.waiting {
          background: linear-gradient(135deg, rgba(200,20,70,0.12) 0%, rgba(150,0,50,0.06) 100%);
          border-color: rgba(255,60,100,0.40);
        }
        .wl-banner:hover { box-shadow: 0 0 22px rgba(0,200,255,0.14); border-color: rgba(0,200,255,0.50); }
        .wl-banner-emoji { font-size: 26px; flex-shrink: 0; line-height: 1; }
        .wl-banner-body { flex: 1; min-width: 0; }
        .wl-banner-title { font-size: 14px; font-weight: 800; line-height: 1.4; margin-bottom: 2px; }
        .wl-banner-sub { font-size: 11px; color: var(--text-muted); }
        .wl-banner-cta {
          font-size: 12px; font-weight: 800; padding: 7px 14px;
          border-radius: 20px; white-space: nowrap; flex-shrink: 0;
        }
        .wl-banner.in-shop .wl-banner-cta {
          background: #00d860; color: #001a08;
        }
        .wl-banner.waiting .wl-banner-cta {
          background: rgba(255,60,100,0.18); color: #ff6090;
          border: 1px solid rgba(255,60,100,0.35);
        }
        @keyframes wl-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(0,220,90,0.15); }
          50%       { box-shadow: 0 0 22px rgba(0,220,90,0.32); }
        }
        @media (max-width: 480px) {
          .wl-banner { gap: 10px; padding: 12px 14px; }
          .wl-banner-title { font-size: 13px; }
          .wl-banner-cta { display: none; }
        }

        /* ほしいものリストモーダル */
        .wishlist-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.78);
          display: flex; align-items: flex-end;
        }
        .wishlist-panel {
          width: 100%;
          max-height: 86vh;
          background: var(--surface);
          border-radius: 20px 20px 0 0;
          overflow-y: auto;
          padding: 0 0 max(env(safe-area-inset-bottom), 16px);
        }
        /* PCではセンターモーダルに変える */
        @media (min-width: 640px) {
          .wishlist-overlay { align-items: center; justify-content: center; }
          .wishlist-panel {
            width: 560px;
            max-height: 80vh;
            border-radius: 20px;
          }
        }

        /* ほしいものリスト横並びアイテム */
        .wish-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border);
        }
        .wish-item:last-child { border-bottom: none; }
        .wish-item-thumb {
          width: 56px; height: 56px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          background: var(--card);
        }
        .wish-item-info { flex: 1; min-width: 0; }
        .wish-item-name {
          font-size: 13px; font-weight: 700;
          color: var(--text); line-height: 1.3;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .wish-item-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px;
        }
        .wish-item-badge.in-shop {
          background: rgba(0,200,80,0.18);
          color: #00d860;
          border: 1px solid rgba(0,200,80,0.35);
        }
        .wish-item-badge.waiting {
          background: rgba(255,255,255,0.07);
          color: var(--text-muted);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .wish-remove-btn {
          width: 32px; height: 32px;
          background: rgba(255,50,80,0.12);
          border: 1px solid rgba(255,50,80,0.25);
          border-radius: 8px;
          color: #ff4060;
          font-size: 14px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .wish-remove-btn:hover { background: rgba(255,50,80,0.25); }
      `}</style>

      {/* ほしいものリストバナー */}
      {wishCount > 0 && (
        <button
          onClick={() => setShowWishlist(true)}
          className={`wl-banner ${inShopCount > 0 ? "in-shop" : "waiting"}`}
        >
          <span className="wl-banner-emoji">{inShopCount > 0 ? "🛍️" : "❤️"}</span>
          <div className="wl-banner-body">
            {inShopCount > 0 ? (
              <>
                <div className="wl-banner-title" style={{ color: "#00d860" }}>
                  ほしいスキンが {inShopCount}件 今日のショップに出ています！
                </div>
                <div className="wl-banner-sub">
                  {wishCount - inShopCount > 0 ? `残り ${wishCount - inShopCount}件 は入荷待ち` : "リストのアイテムがすべて入荷中"}
                </div>
              </>
            ) : (
              <>
                <div className="wl-banner-title" style={{ color: "var(--text)" }}>
                  <span style={{ color: "#ff6090" }}>{wishCount}件</span> ほしいものリストに登録中
                </div>
                <div className="wl-banner-sub">今日は入荷なし — 入荷時にプッシュ通知でお知らせ</div>
              </>
            )}
          </div>
          <span className="wl-banner-cta">
            {inShopCount > 0 ? "今すぐ確認 →" : "リストを見る →"}
          </span>
        </button>
      )}

      {/* 検索ボックス */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <span style={{
          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
          fontSize: "16px", pointerEvents: "none",
        }}>🔍</span>
        <input
          ref={searchInputRef}
          type="search"
          enterKeyHint="search"
          inputMode="search"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="全スキンから名前で検索..."
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 36px 12px 42px",
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: "12px", color: "var(--text)", fontSize: "15px",
            outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
            style={{
              position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: "18px", padding: "4px",
            }}
          >✕</button>
        )}
      </div>

      {showSearch ? (
        <section>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
            {isSearching
              ? "検索中..."
              : apiResults.length > 0
                ? <><b style={{ color: "var(--text)" }}>{apiResults.length}件</b> ヒット（全スキン対象）</>
                : `「${searchQuery}」に一致するスキンはありません`
            }
          </p>
          <div className="shop-grid-regular">
            {apiResults.map(item => {
              const shopItem = shopItemMap.get(item.id);
              return (
                <SearchResultCard key={item.id} item={item}
                  inShop={!!shopItem} shopPrice={shopItem?.price}
                  wished={wishlist.has(item.id)} onToggleWish={toggleWish} />
              );
            })}
          </div>
        </section>
      ) : (
        <>
          {filter === ALL && featured.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
                  今日のおすすめ
                </h2>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Epic公式が注目するアイテム</span>
              </div>
              <div className="shop-grid-featured">
                {featured.map(e => e.kind === "bundle"
                  ? <BundleCard key={e.id} bundle={e} />
                  : <ItemCard key={e.id} item={e} large wished={wishlist.has(e.id)} onToggleWish={toggleWish} />
                )}
              </div>
            </section>
          )}

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)" }}>
                🛒 全アイテム
              </h2>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{filter === ALL ? regular.length : filteredRegular.length}件</span>
            </div>

            <div className="filter-tabs">
              <button style={tabStyle(ALL)} onClick={() => setFilter(ALL)}>すべて ({regular.length})</button>
              {bundleCount > 0 && (
                <button style={tabStyle(BUNDLE)} onClick={() => setFilter(BUNDLE)}>セット ({bundleCount})</button>
              )}
              {availableTypes.map(type => {
                const count = allEntries.filter(e => e.kind === "item" && (e as ShopItem).typeValue === type).length;
                return (
                  <button key={type} style={tabStyle(type)} onClick={() => setFilter(type)}>
                    {typeLabels[type] ?? type} ({count})
                  </button>
                );
              })}
            </div>

            <div className="shop-grid-regular">
              {filteredRegular.map(e => e.kind === "bundle"
                ? <BundleCard key={e.id} bundle={e} />
                : <ItemCard key={e.id} item={e} wished={wishlist.has(e.id)} onToggleWish={toggleWish} />
              )}
            </div>
          </section>
        </>
      )}

      {/* ほしいものリストモーダル */}
      {showWishlist && (
        <div className="wishlist-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wishlist-panel" onClick={e => e.stopPropagation()}>
            {/* ドラッグハンドル（モバイルのみ見た目上意味あり） */}
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)" }} />
            </div>

            {/* ヘッダー */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "900", color: "var(--text)", marginBottom: "2px" }}>
                  ❤️ ほしいものリスト
                </h2>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {wishCount}件登録中
                  {inShopCount > 0 && <span style={{ color: "#00d860", marginLeft: "8px" }}>● {inShopCount}件 今日のショップにあります</span>}
                </p>
              </div>
              <button
                onClick={() => setShowWishlist(false)}
                style={{
                  background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
                  color: "var(--text)", fontSize: "16px", borderRadius: "8px",
                  width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>

            <div style={{ height: "1px", background: "var(--border)", margin: "0 16px 4px" }} />

            {/* アイテムリスト */}
            {wishlistItems.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "48px 0", fontSize: "14px" }}>
                まだ何も登録されていません
              </p>
            ) : (
              <div>
                {wishlistItems.map(wItem => {
                  const inShop = shopItemMap.has(wItem.id);
                  const color = rarityColors[wItem.rarity] ?? rarityColors.common;
                  return (
                    <div key={wItem.id} className="wish-item">
                      {/* サムネイル */}
                      <div className="wish-item-thumb" style={{ border: `2px solid ${color}55` }}>
                        {wItem.image ? (
                          <Image src={wItem.image} alt={wItem.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "var(--border)" }} />
                        )}
                      </div>

                      {/* 情報 */}
                      <div className="wish-item-info">
                        <p className="wish-item-name">{wItem.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span className={`wish-item-badge ${inShop ? "in-shop" : "waiting"}`}>
                            {inShop ? "🛍️ 今日あります" : "⏳ 入荷待ち"}
                          </span>
                          {wItem.price > 0 && (
                            <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: "800" }}>
                              ⟁ {wItem.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 削除ボタン */}
                      <button
                        className="wish-remove-btn"
                        onClick={() => toggleWish(wItem)}
                        aria-label="リストから削除"
                      >✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
