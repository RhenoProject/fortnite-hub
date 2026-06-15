"use client";
import { useEffect, useState } from "react";
import { registerAndSubscribe, getSubscriptionStatus } from "@/lib/pushUtils";

const DISMISS_KEY = "push_banner_dismissed_until";
const DISMISS_DAYS = 7;

export function PushBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    const timer = setTimeout(async () => {
      const status = await getSubscriptionStatus();
      if (status === "unsubscribed") setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  async function handleAllow() {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await registerAndSubscribe();
      }
    } finally {
      setLoading(false);
      setVisible(false);
    }
  }

  function handleDismiss() {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 32px)",
      maxWidth: "480px",
      backgroundColor: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: "slideUp 0.3s ease",
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "28px", lineHeight: 1 }}>🔔</span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "800", color: "var(--text)", margin: 0, marginBottom: "4px" }}>
            ショップ更新通知を受け取る？
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            毎日9時すぎに「今日のショップ」をお知らせします
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleAllow}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: "var(--primary)",
            color: "#0a0f1a",
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "設定中..." : "今すぐ許可する"}
        </button>
        <button
          onClick={handleDismiss}
          style={{
            flex: 1,
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          あとで
        </button>
      </div>
    </div>
  );
}
