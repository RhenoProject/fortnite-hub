"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navStyle = (href: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    minHeight: "44px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    backgroundColor: pathname === href ? "var(--primary)" : "transparent",
    color: pathname === href ? "#0a0f1a" : "var(--text-muted)",
    border: pathname === href ? "none" : "1px solid var(--border)",
    transition: "all 0.15s",
  });

  const tabStyle = (href: string): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    textDecoration: "none",
    color: pathname === href ? "var(--primary)" : "var(--text-muted)",
    fontSize: "10px",
    fontWeight: "700",
    paddingBottom: "4px",
    borderTop: pathname === href ? "2px solid var(--primary)" : "2px solid transparent",
    transition: "all 0.15s",
  });

  return (
    <>
      <header style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "2px", color: "var(--primary)" }}>
              フォトナHub
            </span>
            <span style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "1px", fontWeight: "600" }}>
              日本一見やすいフォトナ情報サイト
            </span>
          </Link>

          {/* PC用ナビ */}
          <nav className="header-nav" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/" style={navStyle("/")}>🛍️ ショップ</Link>
            <Link href="/news" style={navStyle("/news")}>📰 ニュース</Link>
            <Link href="/cosmetics" style={navStyle("/cosmetics")}>✨ 新着</Link>
          </nav>
        </div>
      </header>

      {/* スマホ用 下部タブバー */}
      <nav className="bottom-nav">
        <Link href="/" style={tabStyle("/")}>
          <span style={{ fontSize: "22px", lineHeight: 1 }}>🛍️</span>
          <span>ショップ</span>
        </Link>
        <Link href="/news" style={tabStyle("/news")}>
          <span style={{ fontSize: "22px", lineHeight: 1 }}>📰</span>
          <span>ニュース</span>
        </Link>
        <Link href="/cosmetics" style={tabStyle("/cosmetics")}>
          <span style={{ fontSize: "22px", lineHeight: 1 }}>✨</span>
          <span>新着</span>
        </Link>
      </nav>
    </>
  );
}
