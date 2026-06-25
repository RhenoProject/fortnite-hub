import type { Metadata } from "next";
import { PLAYERS, TEAMS } from "@/lib/creatorsData";
import { CreatorsClient } from "./CreatorsClient";

export const metadata: Metadata = {
  title: "フォートナイト 選手・チーム | フォトナHub",
  description: "日本のフォートナイトプロ選手・チームを紹介。DFMのRainyをはじめ、注目プレイヤーとチームの情報をまとめてチェック。",
  openGraph: {
    title: "フォートナイト 選手・チーム | フォトナHub",
    description: "日本のフォートナイトプロ選手・チームを紹介。",
    url: "https://fortnite-hub-delta.vercel.app/creators",
  },
  alternates: { canonical: "https://fortnite-hub-delta.vercel.app/creators" },
};

export default function CreatorsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      <CreatorsClient players={PLAYERS} teams={TEAMS} />
    </div>
  );
}
