"use client";

import type { Player, Team, SnsLinks } from "@/lib/creatorsData";

const X_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const YT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const TWITCH_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
);

const TIKTOK_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const SNS_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  x:       { icon: X_ICON,      label: "X",       color: "#fff", bg: "#000" },
  youtube: { icon: YT_ICON,     label: "YouTube", color: "#fff", bg: "#ff0000" },
  twitch:  { icon: TWITCH_ICON, label: "Twitch",  color: "#fff", bg: "#9146ff" },
  tiktok:  { icon: TIKTOK_ICON, label: "TikTok",  color: "#fff", bg: "#010101" },
};

const scrollRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  paddingBottom: 8,
  scrollSnapType: "x mandatory",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
} as React.CSSProperties;

function SnsButtons({ sns }: { sns: SnsLinks }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      {(Object.entries(sns) as [string, string][]).map(([platform, url]) => {
        const cfg = SNS_CONFIG[platform];
        if (!cfg || !url) return null;
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={cfg.label}
            onClick={(e) => e.stopPropagation()}
            className="sns-btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, background: cfg.bg, color: cfg.color,
              textDecoration: "none", flexShrink: 0,
            }}
          >
            {cfg.icon}
          </a>
        );
      })}
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="creator-card player-card" style={{
      flexShrink: 0,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14, overflow: "hidden",
      scrollSnapAlign: "start",
    }}>
      <a href={player.primaryUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={player.image}
          alt={player.name}
          style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", background: "var(--card)" }}
        />
      </a>
      <div className="card-body">
        <p className="card-name">{player.name}</p>
        <p className="card-label">{player.team}</p>
        <p className="card-desc">{player.description}</p>
        <SnsButtons sns={player.sns} />
      </div>
    </div>
  );
}

function TeamCard({ team }: { team: Team }) {
  return (
    <div className="creator-card team-card" style={{
      flexShrink: 0,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14, overflow: "hidden",
      scrollSnapAlign: "start",
    }}>
      <a href={team.primaryUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={team.image}
          alt={team.name}
          style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", background: "var(--card)" }}
        />
      </a>
      <div className="card-body">
        <p className="card-name" style={{ lineHeight: 1.3 }}>{team.name}</p>
        <p className="card-desc">{team.description}</p>
        <SnsButtons sns={team.sns} />
      </div>
    </div>
  );
}

interface Props {
  players: Player[];
  teams: Team[];
}

export function CreatorsClient({ players, teams }: Props) {
  return (
    <>
      <style>{`
        .creators-row::-webkit-scrollbar { display: none; }

        /* モバイル */
        .player-card { min-width: 150px; width: 150px; }
        .team-card   { min-width: 180px; width: 180px; }
        .card-body   { padding: 10px 10px 12px; }
        .card-name   { font-size: 14px; font-weight: 900; color: var(--text); text-align: center; margin-bottom: 4px; }
        .card-label  { font-size: 11px; color: var(--primary); font-weight: 700; text-align: center; margin-bottom: 6px; }
        .card-desc   { font-size: 10px; color: var(--text-muted); text-align: center; margin-bottom: 10px; line-height: 1.4; }
        .sns-btn     { width: 30px; height: 30px; }
        .creators-page-title { font-size: 22px; }
        .creators-page-sub   { font-size: 13px; }
        .creators-section-h  { font-size: 15px; }

        /* PC */
        @media (min-width: 768px) {
          .player-card { min-width: 220px; width: 220px; }
          .team-card   { min-width: 260px; width: 260px; }
          .card-body   { padding: 18px 18px 20px; }
          .card-name   { font-size: 20px; margin-bottom: 6px; }
          .card-label  { font-size: 14px; margin-bottom: 8px; }
          .card-desc   { font-size: 13px; margin-bottom: 14px; }
          .sns-btn     { width: 40px; height: 40px; border-radius: 10px !important; }
          .creators-row { gap: 20px !important; }
          .creators-page-title { font-size: 30px; }
          .creators-page-sub   { font-size: 15px; }
          .creators-section-h  { font-size: 18px; }
        }
      `}</style>

      <div style={{ marginBottom: 28 }}>
        <h1 className="creators-page-title" style={{ fontWeight: 900, color: "var(--text)", marginBottom: 4 }}>
          🎮 選手・チーム
        </h1>
        <p className="creators-page-sub" style={{ color: "var(--text-muted)" }}>
          日本のフォートナイトプロ選手・チームを紹介。画像をタップでSNSへ。
        </p>
      </div>

      <section style={{ marginBottom: 40 }}>
        <h2 className="creators-section-h" style={{
          fontWeight: 900, color: "var(--primary)",
          marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--border)",
        }}>
          🏅 プレイヤー
        </h2>
        <div className="creators-row" style={scrollRowStyle}>
          {players.map((p) => <PlayerCard key={p.id} player={p} />)}
        </div>
      </section>

      <section>
        <h2 className="creators-section-h" style={{
          fontWeight: 900, color: "var(--primary)",
          marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid var(--border)",
        }}>
          🏆 チーム
        </h2>
        <div className="creators-row" style={scrollRowStyle}>
          {teams.map((t) => <TeamCard key={t.id} team={t} />)}
        </div>
      </section>
    </>
  );
}
