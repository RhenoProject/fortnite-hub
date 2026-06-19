"use client";
import { useState } from "react";

export function DeviceImage({ asin, alt, emoji }: { asin: string; alt: string; emoji: string }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  if (status === "error") {
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
      position: "relative",
    }}>
      {status === "loading" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, var(--card) 0%, var(--surface) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", opacity: 0.6,
        }}>
          {emoji}
        </div>
      )}
      <img
        src={`/api/amazon-img?asin=${asin}`}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%", height: "100%", objectFit: "contain",
          opacity: status === "ok" ? 1 : 0,
          transition: "opacity 0.3s",
        }}
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
