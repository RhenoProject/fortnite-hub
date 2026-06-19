import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { PushBanner } from "@/components/PushBanner";
import { PageRefresher } from "@/components/PageRefresher";
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
    verification: {
      google: "XZaQpzZ7BJ7x9sag3JTN1PG1BI_4aAZEtQveYnF70uQ",
    },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "フォトナHub",
  url: "https://fortnite-hub-delta.vercel.app",
  description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック。日本一見やすいフォトナ情報サイト。",
  inLanguage: "ja",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fortnite-hub-delta.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
        <PushBanner />
        <PageRefresher />
        <Analytics />
        <GoogleAnalytics gaId="G-QHK3562CSH" />
      </body>
    </html>
  );
}
