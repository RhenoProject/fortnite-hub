import type { Metadata } from "next";
import { MOCK_WEAPONS, MOCK_PATCH_NOTES } from "@/lib/mockWeapons";
import { WeaponsClient } from "./WeaponsClient";

export const metadata: Metadata = {
  title: "フォートナイト 武器一覧・ダメージ表 | フォトナHub",
  description: "フォートナイトの全武器のダメージ・DPS・マガジン数・リロード時間を一覧で確認。アサルトライフル・SMG・ショットガン・スナイパーなど種類別に比較できます。",
  openGraph: {
    title: "フォートナイト 武器一覧・ダメージ表 | フォトナHub",
    description: "全武器のダメージ・DPS・マガジン数を種類別に比較。",
    url: "https://fortnite-hub-delta.vercel.app/weapons",
  },
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/weapons" },
};

export default function WeaponsPage() {
  return <WeaponsClient weapons={MOCK_WEAPONS} patchNotes={MOCK_PATCH_NOTES} />;
}
