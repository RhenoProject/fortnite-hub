export type SnsLinks = {
  x?: string;
  youtube?: string;
  twitch?: string;
  tiktok?: string;
};

export interface Player {
  id: string;
  name: string;
  image: string;
  team: string;
  description: string;
  primaryUrl: string;
  sns: SnsLinks;
}

export interface Team {
  id: string;
  name: string;
  image: string;
  description: string;
  primaryUrl: string;
  sns: SnsLinks;
}

export const PLAYERS: Player[] = [
  {
    id: "rainy",
    name: "Rainy",
    image: "https://unavatar.io/x/R4InyFN",
    team: "DFM",
    description: "DFM所属。日本トップクラスの競技プレイヤー。",
    primaryUrl: "https://x.com/R4InyFN",
    sns: {
      x: "https://x.com/R4InyFN",
      youtube: "https://www.youtube.com/channel/UCOK3b_q7lYy2k1TCR2U2_kw",
    },
  },
];

export const TEAMS: Team[] = [
  {
    id: "dfm",
    name: "DetonatioN FocusMe",
    image: "/teams/dfm.png",
    description: "2012年設立の日本老舗eスポーツ組織。複数タイトルで国内トップ。",
    primaryUrl: "https://x.com/team_detonation",
    sns: {
      x: "https://x.com/team_detonation",
      youtube: "https://www.youtube.com/@DetonatioNFocusMe",
    },
  },
  {
    id: "edge",
    name: "EDGE",
    image: "https://unavatar.io/x/EDGE_CPT",
    description: "日本のフォートナイトプロチーム。競技シーンで活躍中。",
    primaryUrl: "https://x.com/EDGE_CPT",
    sns: {
      x: "https://x.com/EDGE_CPT",
    },
  },
];
