"use client";
import { useState } from "react";

export function DeviceImage({ asin, alt, emoji }: { asin: string; alt: string; emoji: string }) {
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
        src={`/api/amazon-img?asin=${asin}`}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
