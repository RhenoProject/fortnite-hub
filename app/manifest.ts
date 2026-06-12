import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "フォトナHub",
    short_name: "フォトナHub",
    description: "フォートナイトのアイテムショップ・最新ニュースを毎日チェック",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f1a",
    theme_color: "#0a0f1a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
