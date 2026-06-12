import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
  description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック。日本一見やすいフォトナ情報サイト「フォトナHub」",
  openGraph: {
    title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
    description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック！",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
    description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" style={{ backgroundColor: "var(--bg)" }}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "16px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "12px",
        }}>
          © 2026 フォトナHub — This site is not affiliated with Epic Games.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
