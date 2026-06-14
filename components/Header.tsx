"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ショップ", emoji: "🛍️" },
  { href: "/news", label: "ニュース", emoji: "📰" },
  { href: "/updates", label: "アプデ・競技", emoji: "🏆" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        .bottom-tab-bar { display: none; }
        @media (max-width: 639px) {
          .top-nav { display: none; }
          .bottom-tab-bar { display: flex; }
          body { padding-bottom: 64px; }
        }
      `}</style>

      {/* デスクトップ・タブレット用ヘッダー */}
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

          <nav className="top-nav" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {navItems.map(({ href, label, emoji }) => (
              <Link key={href} href={href} style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                minHeight: "44px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                backgroundColor: isActive(href) ? "var(--primary)" : "transparent",
                color: isActive(href) ? "#0a0f1a" : "var(--text-muted)",
                border: isActive(href) ? "none" : "1px solid var(--border)",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
                {emoji} {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* スマホ用下部タブバー */}
      <nav className="bottom-tab-bar" style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        justifyContent: "space-around",
        alignItems: "center",
        height: "64px",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {navItems.map(({ href, label, emoji }) => (
          <Link key={href} href={href} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            flex: 1,
            padding: "8px 4px",
            textDecoration: "none",
            color: isActive(href) ? "var(--primary)" : "var(--text-muted)",
            transition: "color 0.15s",
          }}>
            <span style={{ fontSize: "22px", lineHeight: 1 }}>{emoji}</span>
            <span style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              color: isActive(href) ? "var(--primary)" : "var(--text-muted)",
            }}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
