import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "おすすめゲーミングデバイス | フォトナHub",
  description: "フォートナイトをもっと楽しむためのおすすめゲーミングデバイスを紹介。ヘッドセット・イヤホン・コントローラー・モニターなど厳選アイテム。",
};

// しゅうやCEOがアフィリエイトリンクを提供した商品だけここに追加する
const devices: {
  category: string;
  description: string;
  items: {
    name: string;
    price: string;
    tag: string;
    tagColor: string;
    note: string;
    amazon: string;
    rakuten: string;
    image: string;
  }[];
}[] = [
  // 例:
  // {
  //   category: "🎧 ヘッドセット",
  //   description: "音で敵の位置を把握。フォートナイトで最も重要なデバイス。",
  //   items: [
  //     { name: "商品名", price: "約X,000円〜", tag: "タグ", tagColor: "#4CAF50", note: "説明文", amazon: "https://...", rakuten: "https://...", image: "" },
  //   ],
  // },
];

export default function DevicesPage() {
  return (
    <>
      <style>{`
        .devices-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 16px 48px;
        }
        .devices-hero {
          text-align: center;
          margin-bottom: 40px;
        }
        .devices-hero h1 {
          font-size: 26px;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 8px;
        }
        .devices-hero p {
          color: var(--text-muted);
          font-size: 14px;
        }
        .device-category {
          margin-bottom: 40px;
        }
        .category-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 6px;
        }
        .category-desc {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .device-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .device-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .device-img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: contain;
          background: #111827;
          padding: 16px;
        }
        .device-img-placeholder {
          width: 100%;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #1a2235 0%, #0d1521 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        }
        .device-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .device-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .device-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .device-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .device-note {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          flex: 1;
        }
        .device-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: auto;
        }
        .device-price {
          font-size: 15px;
          font-weight: 700;
          color: var(--primary);
        }
        .shop-btns {
          display: flex;
          gap: 8px;
        }
        .amazon-btn {
          flex: 1;
          display: inline-block;
          padding: 9px 12px;
          background: #FF9900;
          color: #000;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.15s;
        }
        .rakuten-btn {
          flex: 1;
          display: inline-block;
          padding: 9px 12px;
          background: #BF0000;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.15s;
        }
        .amazon-btn:hover, .rakuten-btn:hover { opacity: 0.85; }
        .coming-soon {
          text-align: center;
          padding: 80px 16px;
          color: var(--text-muted);
        }
        .coming-soon-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .coming-soon h2 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .affiliate-note {
          margin-top: 40px;
          padding: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.8;
        }
        @media (max-width: 480px) {
          .device-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="devices-page">
        <div className="devices-hero">
          <h1>🎮 おすすめゲーミングデバイス</h1>
          <p>フォートナイトをもっと楽しむための厳選デバイスを紹介</p>
        </div>

        {devices.length === 0 ? (
          <div className="coming-soon">
            <div className="coming-soon-icon">🔧</div>
            <h2>準備中</h2>
            <p>おすすめデバイスを順次追加中です。もうしばらくお待ちください。</p>
          </div>
        ) : (
          devices.map((category) => (
            <div key={category.category} className="device-category">
              <div className="category-title">{category.category}</div>
              <div className="category-desc">{category.description}</div>
              <div className="device-grid">
                {category.items.map((item) => (
                  <div key={item.name} className="device-card">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="device-img" />
                    ) : (
                      <div className="device-img-placeholder">
                        {category.category.split(" ")[0]}
                      </div>
                    )}
                    <div className="device-body">
                      <div className="device-card-header">
                        <div className="device-name">{item.name}</div>
                        <span
                          className="device-tag"
                          style={{ background: item.tagColor + "22", color: item.tagColor }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <div className="device-note">{item.note}</div>
                      <div className="device-footer">
                        <div className="device-price">{item.price}</div>
                        <div className="shop-btns">
                          <a href={item.amazon} className="amazon-btn" target="_blank" rel="noopener noreferrer">🛒 Amazon</a>
                          <a href={item.rakuten} className="rakuten-btn" target="_blank" rel="noopener noreferrer">🛍️ 楽天</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {devices.length > 0 && (
          <div className="affiliate-note">
            ※ 掲載している価格は目安です。実際の価格はAmazon・楽天のページでご確認ください。<br />
            ※ 当サイトはAmazonアソシエイト・楽天アフィリエイトプログラムに参加しています。<br />
            ※ リンクを経由してご購入いただくと当サイトの運営費になります。
          </div>
        )}
      </div>
    </>
  );
}
