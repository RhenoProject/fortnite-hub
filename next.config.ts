import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercelの画像最適化クォータ超過（402 Payment Required）でショップ画像が表示されない問題の回避策。
    // 元画像（fortnite-api.com）は既にCloudflareで最適化済みのため、Next.js側の最適化なしでも画質への影響は軽微。
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fortnite-api.com",
      },
      {
        protocol: "https",
        hostname: "*.fortnite-api.com",
      },
      {
        protocol: "https",
        hostname: "cdn-live.prm.ol.epicgames.com",
      },
      {
        protocol: "https",
        hostname: "*.epicgames.com",
      },
      {
        protocol: "https",
        hostname: "cdn2.unrealengine.com",
      },
      {
        protocol: "https",
        hostname: "*.unrealengine.com",
      },
    ],
  },
};

export default nextConfig;
