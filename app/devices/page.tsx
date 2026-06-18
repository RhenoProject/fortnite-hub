import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "おすすめゲーミングデバイス | フォトナHub",
  description: "フォートナイトをもっと楽しむためのおすすめゲーミングデバイスを紹介。ヘッドセット・コントローラー・モニターなど厳選アイテム。",
};

const devices = [
  {
    category: "🎧 ヘッドセット",
    description: "音で敵の位置を把握。フォートナイトで最も重要なデバイス。",
    items: [
      {
        name: "HyperX Cloud II",
        price: "約9,000円〜",
        tag: "コスパ最強",
        tagColor: "#4CAF50",
        note: "7.1サラウンド対応。PC・PS・Switch全対応。初めてのゲーミングヘッドセットに最適。",
        link: "#",
      },
      {
        name: "SteelSeries Arctis Nova 1",
        price: "約8,000円〜",
        tag: "軽量・快適",
        tagColor: "#2196F3",
        note: "重さわずか155g。長時間プレイでも疲れにくい設計。全プラットフォーム対応。",
        link: "#",
      },
      {
        name: "ASTRO A50 X",
        price: "約46,000円〜",
        tag: "ハイエンド",
        tagColor: "#FF9800",
        note: "ワイヤレスの最高峰。遅延ゼロ・音質最高。本気でやるならこれ。",
        link: "#",
      },
    ],
  },
  {
    category: "🎮 コントローラー",
    description: "パッドでフォートナイトを制する。エイムと操作性を劇的に改善。",
    items: [
      {
        name: "DualSense (PS5純正)",
        price: "約9,000円〜",
        tag: "定番",
        tagColor: "#4CAF50",
        note: "PC・PS5両対応。安定した操作感と入手しやすさ。まずはこれで間違いない。",
        link: "#",
      },
      {
        name: "Xbox ワイヤレスコントローラー",
        price: "約7,000円〜",
        tag: "PC向き",
        tagColor: "#2196F3",
        note: "PCフォートナイトと相性抜群。握りやすいデザインで長時間プレイでも疲れない。",
        link: "#",
      },
      {
        name: "SCUF Instinct Pro",
        price: "約25,000円〜",
        tag: "プロ仕様",
        tagColor: "#9C27B0",
        note: "背面ボタン搭載でジャンプしながら建築可能。上位プレイヤー御用達。",
        link: "#",
      },
    ],
  },
  {
    category: "🖥️ ゲーミングモニター",
    description: "高リフレッシュレートで敵の動きがクリアに見える。",
    items: [
      {
        name: "ASUS TUF Gaming VG249Q3A",
        price: "約25,000円〜",
        tag: "180Hz・コスパ",
        tagColor: "#4CAF50",
        note: "180Hz対応でなめらかな映像。フォートナイトに必要な性能を低価格で実現。",
        link: "#",
      },
      {
        name: "LG UltraGear 27GP850-B",
        price: "約45,000円〜",
        tag: "165Hz・人気No.1",
        tagColor: "#FF9800",
        note: "プロゲーマーも使用。Nano IPS液晶で色鮮やか＆高速。ゲーム映えが違う。",
        link: "#",
      },
    ],
  },
  {
    category: "⌨️ キーボード・マウス（PC勢向け）",
    description: "PC勢はここで差がつく。反応速度と精度を上げろ。",
    items: [
      {
        name: "Logicool G Pro X TKL",
        price: "約15,000円〜",
        tag: "プロ御用達マウス",
        tagColor: "#9C27B0",
        note: "軽量61g・高精度センサー。世界中のプロが使うマウスの代名詞。",
        link: "#",
      },
      {
        name: "Logicool G913 TKL",
        price: "約23,000円〜",
        tag: "ワイヤレスキーボード",
        tagColor: "#2196F3",
        note: "ラグゼロのワイヤレス。薄型で高速反応。デスク周りをスッキリさせたい人に。",
        link: "#",
      },
    ],
  },
];

export default function DevicesPage() {
  return (
    <>
      <style>{`
        .devices-page {
          max-width: 900px;
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
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .device-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .device-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }
        .device-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .device-note {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .device-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .device-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
        }
        .amazon-btn {
          display: inline-block;
          padding: 8px 16px;
          background: #FF9900;
          color: #000;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .amazon-btn:hover {
          opacity: 0.85;
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
        }
        @media (max-width: 480px) {
          .device-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="devices-page">
        <div className="devices-hero">
          <h1>🎮 おすすめゲーミングデバイス</h1>
          <p>フォートナイトをもっと楽しむための厳選デバイスを紹介</p>
        </div>

        {devices.map((category) => (
          <div key={category.category} className="device-category">
            <div className="category-title">{category.category}</div>
            <div className="category-desc">{category.description}</div>
            <div className="device-grid">
              {category.items.map((item) => (
                <div key={item.name} className="device-card">
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
                    <a href={item.link} className="amazon-btn" target="_blank" rel="noopener noreferrer">
                      Amazonで見る
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="affiliate-note">
          ※ 掲載している価格は目安です。実際の価格はAmazonのページでご確認ください。<br />
          ※ 当サイトはAmazonアソシエイトプログラムに参加しています。
        </div>
      </div>
    </>
  );
}
