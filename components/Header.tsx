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

  return (
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

        <nav style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link href="/" style={navStyle("/")}>🛍️ ショップ</Link>
          <Link href="/news" style={navStyle("/news")}>📰 ニュース</Link>
          <Link href="/cosmetics" style={navStyle("/cosmetics")}>✨ 新着</Link>
        </nav>
      </div>
    </header>
  );
}
