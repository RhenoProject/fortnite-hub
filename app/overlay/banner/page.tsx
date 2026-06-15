export default function BannerOverlayPage() {
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

        /* 3分サイクル: 3秒後に出て6秒表示、残りは非表示 */
        @keyframes banner-cycle {
          0%     { opacity: 0; }
          1.6%   { opacity: 0; }
          2%     { opacity: 1; }
          5%     { opacity: 1; }
          5.5%   { opacity: 0; }
          100%   { opacity: 0; }
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
          animation: banner-cycle 180s linear infinite;
          font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif;
        }
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

      <div className="banner">
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
