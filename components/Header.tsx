"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PushSubscribeButton } from "@/components/PushSubscribeButton";

const navItems = [
  { href: "/", label: "ショップ", emoji: "🛍️" },
  { href: "/news", label: "ニュース", emoji: "📰" },
  { href: "/updates", label: "アプデ・競技", emoji: "🏆" },
  { href: "/devices", label: "デバイス", emoji: "🖱️" },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <style>{`
        .header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .site-logo {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          text-decoration: none;
        }
        .site-logo-name {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--primary);
        }
        .site-logo-sub {
          font-size: 9px;
          color: var(--text-muted);
          letter-spacing: 1px;
          font-weight: 600;
        }
        .top-nav {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          min-height: 44px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid var(--border);
          color: var(--text-muted);
          transition: all 0.15s;
          white-space: nowrap;
          background-color: transparent;
        }
        .nav-link.active {
          background-color: var(--primary);
          color: #0a0f1a;
          border-color: transparent;
        }

        /* スマホ: ロゴ上・ナビ折り返し */
        @media (max-width: 639px) {
          .header-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 12px 0;
            gap: 8px;
          }
          .site-logo-name {
            font-size: 20px;
          }
          .top-nav {
            width: 100%;
            flex-wrap: wrap;
            gap: 6px;
            padding-bottom: 10px;
          }
          .nav-link {
            flex: 1 0 auto;
            justify-content: center;
            padding: 7px 10px;
            font-size: 12px;
            min-height: 36px;
          }
        }
      `}</style>

      <header style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div className="header-inner">
          <Link href="/" className="site-logo">
            <span className="site-logo-name">フォトナHub</span>
            <span className="site-logo-sub">日本一見やすいフォトナ情報サイト</span>
          </Link>

          <nav className="top-nav">
            {navItems.map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link${isActive(href) ? " active" : ""}`}
              >
                {emoji} {label}
              </Link>
            ))}
            <PushSubscribeButton />
          </nav>
        </div>
      </header>
    </>
  );
}
