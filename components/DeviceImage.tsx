"use client";
import { useState } from "react";

const FALLBACKS = [
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.09._SL1500_.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.09._AC_SL1500_.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.09._AC_SL1000_.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.01._AC_SL1500_.jpg`,
  (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.09._SL1500_.jpg`,
  (asin: string) => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
  (asin: string) => `https://images-fe.amazon.com/images/P/${asin}.09._SL1500_.jpg`,
  (asin: string) => `https://images-fe.amazon.com/images/P/${asin}.09.jpg`,
  (asin: string) => `https://m.media-amazon.com/images/P/${asin}.09.jpg`,
];

export function DeviceImage({ asin, alt, emoji }: { asin: string; alt: string; emoji: string }) {
  const [idx, setIdx] = useState(0);
  const [apiUrl, setApiUrl] = useState<string | null | false>(null);
  const [triedApi, setTriedApi] = useState(false);

  const handleError = () => {
    if (idx + 1 < FALLBACKS.length) {
      setIdx(i => i + 1);
    } else if (!triedApi) {
      setTriedApi(true);
      fetch(`/api/amazon-img?asin=${asin}`)
        .then(r => r.json())
        .then(data => setApiUrl(data.url || false))
        .catch(() => setApiUrl(false));
    } else {
      setApiUrl(false);
    }
  };

  if (apiUrl === false) {
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

  if (triedApi && apiUrl === null) {
    return (
      <div style={{
        width: "100%", aspectRatio: "1/1", background: "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
      }}>⏳</div>
    );
  }

  return (
    <div style={{
      width: "100%", aspectRatio: "1/1", background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <img
        src={apiUrl || FALLBACKS[idx](asin)}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={handleError}
      />
    </div>
  );
}
