"use client";
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function PushSubscribeButton() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "subscribed" | "unsubscribed">("loading");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "subscribed" : "unsubscribed");
    });
  }, []);

  async function subscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    setStatus("subscribed");
  }

  async function unsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
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
