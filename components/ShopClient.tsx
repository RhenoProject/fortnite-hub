"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
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
      backgroundColor: "var(--card)", borderRadius: "10px", overflow: "hidden",
      border: `1px solid ${color}44`, display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      {item.image ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
          <Image src={item.image} alt={item.name} fill
            sizes={large ? "(max-width: 640px) 50vw, 220px" : "(max-width: 640px) 33vw, 160px"}
            style={{ objectFit: "cover" }} />
          <button
            onClick={() => onToggleWish(item)}
            aria-label={wished ? "ほしいものリストから削除" : "ほしいものリストに追加"}
            style={{
              position: "absolute", top: "6px", right: "6px",
              background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
              width: "28px", height: "28px", fontSize: "15px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
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
        <p style={{ fontSize: large ? "11px" : "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "2px" }}>
          {item.rarityDisplay || item.typeDisplay}
        </p>
        <p style={{
          fontSize: large ? "13px" : "12px", fontWeight: "700", color: "var(--text)", lineHeight: 1.3, marginBottom: "6px",
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
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "10px", overflow: "hidden",
      border: `1px solid ${color}44`, display: "flex", flexDirection: "column",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 33vw, 160px" style={{ objectFit: "cover" }} />
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
          onClick={() => onToggleWish({ id: item.id, name: item.name, image: item.image, rarity: item.rarity, price: shopPrice ?? 0 })}
          aria-label={wished ? "ほしいものリストから削除" : "ほしいものリストに追加"}
          style={{
            position: "absolute", top: "6px", right: "6px",
            background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
            width: "28px", height: "28px", fontSize: "15px",
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
    </div>
  );
}

function BundleCard({ bundle }: { bundle: ShopBundle; large?: boolean }) {
  const color = rarityColors[bundle.rarity] ?? rarityColors.legendary;
  return (
    <div style={{
      backgroundColor: "var(--card)", borderRadius: "10px", overflow: "hidden",
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
        <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
      if (migrated.length > 0) {
        saveWishlistItems(migrated);
        setWishlistItems(migrated);
      }
    } else {
      setWishlistItems(items);
    }
  }, [featured, regular]);

  // デバウンス付き全スキン検索
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) {
      setApiResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cosmetics/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setApiResults(json.items ?? []);
      } catch {
        setApiResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const toggleWish = useCallback((item: WishableItem) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      syncWishlistToServer(Array.from(next));
      return next;
    });
    setWishlistItems((prev) => {
      const exists = prev.find(i => i.id === item.id);
      let newItems: WishlistItem[];
      if (exists) {
        newItems = prev.filter(i => i.id !== item.id);
      } else {
        newItems = [...prev, { id: item.id, name: item.name, image: item.image, rarity: item.rarity, price: item.price }];
      }
      saveWishlistItems(newItems);
      return newItems;
    });
  }, []);

  const availableTypes = Array.from(
    new Set(regular.filter(e => e.kind === "item").map(e => (e as ShopItem).typeValue).filter(Boolean))
  );
  const bundleCount = regular.filter(e => e.kind === "bundle").length;

  const filteredRegular = filter === ALL
    ? regular
    : filter === BUNDLE
      ? regular.filter(e => e.kind === "bundle")
      : regular.filter(e => e.kind === "item" && (e as ShopItem).typeValue === filter);

  const tabStyle = (key: string): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
    cursor: "pointer", border: "none",
    backgroundColor: filter === key ? "var(--primary)" : "var(--card)",
    color: filter === key ? "#0a0f1a" : "var(--text-muted)",
    transition: "all 0.15s", whiteSpace: "nowrap" as const, flexShrink: 0,
  });

  const wishCount = wishlistItems.length;
  const showSearch = searchQuery.trim().length >= 1;

  return (
    <>
      {wishCount > 0 && (
        <button
          onClick={() => setShowWishlist(true)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            backgroundColor: "#ff006615", border: "1px solid #ff006633",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
            fontSize: "13px", color: "var(--text-muted)",
            width: "100%", cursor: "pointer", textAlign: "left",
          }}
        >
          <span>❤️</span>
          <span><b style={{ color: "var(--text)" }}>{wishCount}件</b> ほしいものリストに登録中。ショップに出たら通知でお知らせします。</span>
          <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--primary)", whiteSpace: "nowrap" }}>確認する →</span>
        </button>
      )}

      {/* 検索ボックス */}
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <span style={{
          position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
          fontSize: "16px", pointerEvents: "none", userSelect: "none",
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
            padding: "10px 36px 10px 40px",
            backgroundColor: "var(--card)", border: "1px solid var(--border)",
            borderRadius: "10px", color: "var(--text)", fontSize: "14px",
            outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
            style={{
              position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: "18px", lineHeight: 1, padding: "2px 4px",
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
            {apiResults.map(item => {
              const shopItem = shopItemMap.get(item.id);
              return (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  inShop={!!shopItem}
                  shopPrice={shopItem?.price}
                  wished={wishlist.has(item.id)}
                  onToggleWish={toggleWish}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>⭐</span>
                <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--primary)", letterSpacing: "1px" }}>
                  今日のおすすめ
                </h2>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Epic公式が注目するアイテム</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {featured.map(e => e.kind === "bundle"
                  ? <BundleCard key={e.id} bundle={e} large />
                  : <ItemCard key={e.id} item={e} large wished={wishlist.has(e.id)} onToggleWish={toggleWish} />
                )}
              </div>
            </section>
          )}

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)", letterSpacing: "1px" }}>
                🛒 全アイテム
              </h2>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", paddingBottom: "4px" }}>
              <button style={tabStyle(ALL)} onClick={() => setFilter(ALL)}>すべて ({regular.length})</button>
              {bundleCount > 0 && (
                <button style={tabStyle(BUNDLE)} onClick={() => setFilter(BUNDLE)}>セット ({bundleCount})</button>
              )}
              {availableTypes.map(type => {
                const count = regular.filter(e => e.kind === "item" && (e as ShopItem).typeValue === type).length;
                return (
                  <button key={type} style={tabStyle(type)} onClick={() => setFilter(type)}>
                    {typeLabels[type] ?? type} ({count})
                  </button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
              {filteredRegular.map(e => e.kind === "bundle"
                ? <BundleCard key={e.id} bundle={e} />
                : <ItemCard key={e.id} item={e} wished={wishlist.has(e.id)} onToggleWish={toggleWish} />
              )}
            </div>
          </section>
        </>
      )}

      {showWishlist && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "flex-end",
          }}
          onClick={() => setShowWishlist(false)}
        >
          <div
            style={{
              width: "100%", maxHeight: "82vh",
              backgroundColor: "var(--bg)",
              borderRadius: "20px 20px 0 0",
              padding: "12px 16px 0",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ドラッグハンドル */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "var(--border)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "900", color: "var(--text)" }}>
                ❤️ ほしいものリスト ({wishCount}件)
              </h2>
              <button
                onClick={() => setShowWishlist(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: "22px", lineHeight: 1, padding: "4px 8px",
                }}
              >✕</button>
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
              ショップに登場した日に通知でお知らせします。
            </p>

            {wishlistItems.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px 0" }}>
                まだ何も登録されていません
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", paddingBottom: "max(env(safe-area-inset-bottom), 24px)" }}>
                {wishlistItems.map(wItem => {
                  const inShop = shopItemMap.has(wItem.id);
                  const color = rarityColors[wItem.rarity] ?? rarityColors.common;
                  return (
                    <div key={wItem.id} style={{
                      backgroundColor: "var(--card)", borderRadius: "10px", overflow: "hidden",
                      border: `1px solid ${color}44`, position: "relative",
                    }}>
                      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                        {wItem.image ? (
                          <Image src={wItem.image} alt={wItem.name} fill sizes="150px" style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", backgroundColor: "var(--border)" }} />
                        )}
                        <div style={{
                          position: "absolute", top: 0, left: 0, right: 0,
                          backgroundColor: inShop ? "rgba(0,180,80,0.88)" : "rgba(0,0,0,0.55)",
                          fontSize: "9px", fontWeight: "800",
                          color: inShop ? "white" : "#bbb",
                          textAlign: "center", padding: "3px 4px", lineHeight: 1.4,
                        }}>
                          {inShop ? "🛍️ 今日のショップにあります！" : "⏳ 入荷待ち"}
                        </div>
                        <button
                          onClick={() => toggleWish(wItem)}
                          aria-label="ほしいものリストから削除"
                          style={{
                            position: "absolute", top: "6px", right: "6px",
                            background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
                            width: "28px", height: "28px", fontSize: "15px",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          ❤️
                        </button>
                      </div>
                      <div style={{ height: "3px", backgroundColor: color }} />
                      <div style={{ padding: "8px" }}>
                        <p style={{
                          fontSize: "12px", fontWeight: "700", color: "var(--text)",
                          lineHeight: 1.3, marginBottom: "4px",
                          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any,
                        }}>
                          {wItem.name}
                        </p>
                        {wItem.price > 0 && (
                          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                            <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>⟁</span>
                            <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "12px" }}>{wItem.price.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
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
