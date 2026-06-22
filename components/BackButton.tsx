"use client";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, color: "var(--text-muted)", background: "none",
        border: "none", cursor: "pointer", padding: "0 0 20px",
      }}
    >
      ← 戻る
    </button>
  );
}
