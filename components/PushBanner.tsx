"use client";
import { useEffect, useState } from "react";
import { registerAndSubscribe, getSubscriptionStatus } from "@/lib/pushUtils";

const DISMISS_KEY = "push_banner_dismissed_until";
const DISMISS_COUNT_KEY = "push_banner_dismiss_count";
const DISMISS_DAYS = 3;
const MAX_DISMISSALS = 3;

export function PushBanner() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const dismissCount = Number(localStorage.getItem(DISMISS_COUNT_KEY) ?? 0);
    if (dismissCount >= MAX_DISMISSALS) return;

    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    async function tryShow() {
      const status = await getSubscriptionStatus();
      if (status !== "unsubscribed") return;
      setVisible(true);
    }

    // スクロール30%で表示（ユーザーが関心を持ったと判断）
    let shown = false;
    const onScroll = () => {
      if (shown) return;
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct >= 0.3) {
        shown = true;
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
        tryShow();
      }
    };

    // スクロールしなくても10秒後に表示
    const timer = setTimeout(() => {
      if (shown) return;
      shown = true;
      window.removeEventListener("scroll", onScroll);
      tryShow();
    }, 10000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
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
    const count = Number(localStorage.getItem(DISMISS_COUNT_KEY) ?? 0) + 1;
    localStorage.setItem(DISMISS_COUNT_KEY, String(count));
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
      border: "1px solid #00c8ff44",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(0,200,255,0.1)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      animation: "pushSlideUp 0.3s ease",
    }}>
      <style>{`
        @keyframes pushSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>🔔</span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "800", color: "var(--text)", margin: 0, marginBottom: "4px" }}>
            ショップ更新をプッシュ通知で受け取る
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
            毎朝9時すぎに今日のショップをお知らせ。
            ほしいスキンが入荷したときも通知します。
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleAllow}
          disabled={loading}
          style={{
            flex: 2,
            background: "linear-gradient(135deg, #00c8ff, #0099cc)",
            color: "#0a0f1a",
            border: "none",
            borderRadius: "10px",
            padding: "11px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "設定中..." : "通知を受け取る"}
        </button>
        <button
          onClick={handleDismiss}
          style={{
            flex: 1,
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "11px",
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
