"use client";
import { useEffect, useRef, useState } from "react";

export default function OverlayPage() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showBanner() {
    setBannerVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBannerVisible(false), 6000);
  }

  useEffect(() => {
    const first = setTimeout(() => {
      showBanner();
      const interval = setInterval(showBanner, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(first);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .corner {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(10, 15, 26, 0.85);
          border: 1px solid rgba(0, 200, 255, 0.35);
          border-radius: 10px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
          animation: fadeUp 0.6s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .corner-qr {
          width: 60px;
          height: 60px;
          background: #fff;
          border-radius: 6px;
          padding: 3px;
          flex-shrink: 0;
        }
        .corner-qr img { width: 100%; height: 100%; display: block; }
        .corner-text { display: flex; flex-direction: column; gap: 3px; }
        .corner-logo {
          font-size: 13px;
          font-weight: 900;
          color: #00c8ff;
          letter-spacing: 1px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .corner-desc {
          font-size: 9px;
          color: #6b8099;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .corner-url {
          font-size: 9px;
          color: rgba(0,200,255,0.55);
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(90deg, rgba(0,200,255,0.15), rgba(0,200,255,0.04));
          border-top: 1px solid rgba(0,200,255,0.4);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif;
        }
        .banner.show { transform: translateY(0); }
        .banner-left { display: flex; align-items: center; gap: 10px; }
        .banner-icon { font-size: 20px; }
        .banner-title {
          font-size: 14px;
          font-weight: 800;
          color: #f0f4f8;
          letter-spacing: 0.5px;
        }
        .banner-sub {
          font-size: 10px;
          color: #00c8ff;
          margin-top: 2px;
        }
        .banner-url {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
      `}</style>

      {/* 隅の常時オーバーレイ */}
      <div className="corner">
        <div className="corner-qr">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://fortnite-hub-delta.vercel.app&margin=2"
            alt="フォトナHub QR"
          />
        </div>
        <div className="corner-text">
          <span className="corner-logo">フォトナHub</span>
          <span className="corner-desc">今日のショップ・ニュースをチェック</span>
          <span className="corner-url">fortnite-hub-delta.vercel.app</span>
        </div>
      </div>

      {/* 自動バナー */}
      <div className={`banner${bannerVisible ? " show" : ""}`}>
        <div className="banner-left">
          <span className="banner-icon">🛍️</span>
          <div>
            <div className="banner-title">今日のアイテムショップをチェック！</div>
            <div className="banner-sub">フォトナHub で毎日更新中</div>
          </div>
        </div>
        <span className="banner-url">fortnite-hub-delta.vercel.app</span>
      </div>
    </>
  );
}
