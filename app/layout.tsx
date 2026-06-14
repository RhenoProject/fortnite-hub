import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

export async function generateMetadata(): Promise<Metadata> {
  let ogImage = "/og-image.jpg";

  try {
    const res = await fetch("https://fortnite-api.com/v2/news?language=ja", {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const first = (json.data?.br?.motds ?? []).find(
        (m: any) => !m.hidden && (m.tileImage || m.image)
      );
      if (first) ogImage = first.tileImage || first.image;
    }
  } catch {}

  return {
    metadataBase: new URL("https://fortnite-hub-delta.vercel.app"),
    icons: {
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      title: "フォトナHub",
      statusBarStyle: "black-translucent",
    },
    title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
    description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック。日本一見やすいフォトナ情報サイト「フォトナHub」",
    openGraph: {
      title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
      description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック！",
      type: "website",
      locale: "ja_JP",
      images: [{ url: ogImage, width: 1920, height: 1080, alt: "フォトナHub" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "フォトナHub | 日本一見やすいフォトナ情報サイト",
      description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック！",
      images: [ogImage],
    },
  };
}

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
          © 2026 フォトナHub — This site is not affiliated with or endorsed by Epic Games. Fortnite and related marks are trademarks of Epic Games, Inc.
        </footer>
        <Analytics />
        <GoogleAnalytics gaId="G-QHK3562CSH" />
      </body>
    </html>
  );
}
