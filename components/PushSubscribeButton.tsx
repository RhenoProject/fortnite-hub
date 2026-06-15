"use client";
import { useEffect, useState } from "react";
import { registerAndSubscribe, getSubscriptionStatus, unsubscribePush } from "@/lib/pushUtils";

export function PushSubscribeButton() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "subscribed" | "unsubscribed">("loading");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    getSubscriptionStatus().then((s) => setStatus(s));
  }, []);

  async function subscribe() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    await registerAndSubscribe();
    setStatus("subscribed");
  }

  async function unsubscribe() {
    await unsubscribePush();
    setStatus("unsubscribed");
  }

  if (status === "loading" || status === "unsupported") return null;

  if (status === "subscribed") {
    return (
      <button
        onClick={unsubscribe}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          backgroundColor: "#00c8ff18", border: "1px solid #00c8ff44",
          borderRadius: "8px", padding: "8px 14px",
          color: "var(--primary)", fontSize: "13px", fontWeight: "700",
          cursor: "pointer",
        }}
      >
        🔔 通知ON
      </button>
    );
  }

  return (
    <button
      onClick={subscribe}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        backgroundColor: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "8px", padding: "8px 14px",
        color: "var(--text-muted)", fontSize: "13px", fontWeight: "700",
        cursor: "pointer",
      }}
    >
      🔕 通知OFF
    </button>
  );
}
