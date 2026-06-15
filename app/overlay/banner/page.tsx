"use client";
import { useEffect, useRef, useState } from "react";

export default function BannerOverlayPage() {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showBanner() {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 6000);
  }

  useEffect(() => {
    const first = setTimeout(() => {
      showBanner();
      const interval = setInterval(showBanner, 3 * 60 * 1000);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(first);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          width: 1920px;
          height: 54px;
          background: transparent;
          overflow: hidden;
        }
        .banner {
          width: 1920px;
          height: 54px;
          background: linear-gradient(90deg, rgba(0,200,255,0.15), rgba(0,200,255,0.04));
          border-top: 1px solid rgba(0,200,255,0.4);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.5s ease;
          font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif;
        }
        .banner.show { opacity: 1; }
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

      <div className={`banner${visible ? " show" : ""}`}>
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
