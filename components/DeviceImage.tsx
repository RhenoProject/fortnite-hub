"use client";
import { useState } from "react";

const FALLBACKS = [
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.09._SL500_.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.01._SL500_.jpg`,
  (asin: string) => `https://images-fe.amazon.com/images/P/${asin}.09.jpg`,
];

export function DeviceImage({ asin, alt, emoji }: { asin: string; alt: string; emoji: string }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div style={{
        width: "100%", aspectRatio: "1/1",
        background: "linear-gradient(135deg, var(--card) 0%, var(--surface) 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "44px",
      }}>
        {emoji}
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", aspectRatio: "1/1", background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <img
        src={FALLBACKS[idx](asin)}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={() => {
          if (idx + 1 < FALLBACKS.length) {
            setIdx(idx + 1);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
