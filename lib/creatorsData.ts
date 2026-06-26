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
  role: "pro" | "streamer";
  primaryUrl: string;
  sns: SnsLinks;
}

export const PLAYERS: Player[] = [
  {
    id: "koyota",
    name: "Koyota",
    image: "https://unavatar.io/x/Koyota0",
    team: "ZETA DIVISION",
    role: "pro",
    description: "FNCS 2024優勝。アジアトップの競技選手。",
    primaryUrl: "https://x.com/Koyota0",
    sns: {
      x: "https://x.com/Koyota0",
      youtube: "https://www.youtube.com/channel/UCJ5e3yAt_Wg9tJGjFO0S-xQ",
    },
  },
  {
    id: "ragis",
    name: "Ragis",
    image: "https://unavatar.io/x/rag1sfn",
    team: "Nova",
    role: "pro",
    description: "アジアソロ1位。最強の若手プロ。",
    primaryUrl: "https://x.com/rag1sfn",
    sns: {
      x: "https://x.com/rag1sfn",
      youtube: "https://www.youtube.com/@ragis6490",
    },
  },
  {
    id: "buyuriru",
    name: "ぶゅりる",
    image: "https://unavatar.io/x/Buyuriru",
    team: "DFM",
    role: "streamer",
    description: "アジア1位・世界大会出場。元DFMプロ。",
    primaryUrl: "https://x.com/Buyuriru",
    sns: {
      x: "https://x.com/Buyuriru",
      youtube: "https://www.youtube.com/@buyuriru",
    },
  },
  {
    id: "rizart",
    name: "リズアート",
    image: "https://unavatar.io/x/CRRIZARTTT",
    team: "Crazy Raccoon",
    role: "streamer",
    description: "世界1位34キル達成。元CRのレジェンド。",
    primaryUrl: "https://x.com/CRRIZARTTT",
    sns: {
      x: "https://x.com/CRRIZARTTT",
      youtube: "https://www.youtube.com/channel/UCWcS5FzBnhiKm27NJNCB9Qw",
    },
  },
  {
    id: "captainshota",
    name: "キャプテンしょーた",
    image: "https://unavatar.io/x/Captain_Shota",
    team: "Circus",
    role: "streamer",
    description: "60万人超のフォートナイトYouTuber。",
    primaryUrl: "https://x.com/Captain_Shota",
    sns: {
      x: "https://x.com/Captain_Shota",
      youtube: "https://www.youtube.com/@cptshota",
    },
  },
];
