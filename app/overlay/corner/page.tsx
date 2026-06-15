export default function CornerOverlayPage() {
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
      `}</style>

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
    </>
  );
}
