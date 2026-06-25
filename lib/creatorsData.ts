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
  primaryUrl: string;
  sns: SnsLinks;
}

export interface Team {
  id: string;
  name: string;
  image: string;
  primaryUrl: string;
  sns: SnsLinks;
}

export const PLAYERS: Player[] = [
  {
    id: "rainy",
    name: "Rainy",
    image: "https://unavatar.io/x/R4InyFN",
    team: "DFM",
    primaryUrl: "https://x.com/R4InyFN",
    sns: {
      x: "https://x.com/R4InyFN",
      youtube: "https://www.youtube.com/channel/UCOK3b_q7lYy2k1TCR2U2_kw",
      twitch: "https://www.twitch.tv/rainy",
    },
  },
];

export const TEAMS: Team[] = [
  {
    id: "dfm",
    name: "DetonatioN FocusMe",
    image: "https://unavatar.io/x/team_detonation",
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
    primaryUrl: "https://x.com/EDGE_CPT",
    sns: {
      x: "https://x.com/EDGE_CPT",
    },
  },
];
