import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "おすすめゲーミングデバイス | フォトナHub",
  description: "フォートナイトをもっと楽しむためのおすすめゲーミングデバイスを紹介。ヘッドセット・イヤホン・コントローラー・モニターなど厳選アイテム。",
};

const devices = [
  {
    category: "🎧 ヘッドセット",
    description: "音で敵の位置を把握。フォートナイトで最も重要なデバイス。",
    items: [
      { name: "HyperX Cloud II", price: "約9,000円〜", tag: "コスパ最強", tagColor: "#4CAF50", note: "7.1サラウンド対応。PC・PS・Switch全対応。初めてのゲーミングヘッドセットに最適。", amazon: "#", rakuten: "#" },
      { name: "SteelSeries Arctis Nova 1", price: "約8,000円〜", tag: "軽量・快適", tagColor: "#2196F3", note: "重さわずか155g。長時間プレイでも疲れにくい設計。全プラットフォーム対応。", amazon: "#", rakuten: "#" },
      { name: "Razer BlackShark V2", price: "約12,000円〜", tag: "音質重視", tagColor: "#9C27B0", note: "THX Spatial Audio搭載。足音・銃声の方向感知が圧倒的に上がる。", amazon: "#", rakuten: "#" },
      { name: "Logicool G535", price: "約11,000円〜", tag: "ワイヤレス", tagColor: "#FF9800", note: "165gの超軽量ワイヤレス。バッテリー33時間。コードのストレスゼロ。", amazon: "#", rakuten: "#" },
      { name: "SteelSeries Arctis Nova 7", price: "約20,000円〜", tag: "ハイコスパ無線", tagColor: "#2196F3", note: "ワイヤレス＋ノイキャン搭載でこの価格。マルチプラットフォーム対応で万能。", amazon: "#", rakuten: "#" },
      { name: "ASTRO A50 X", price: "約46,000円〜", tag: "ハイエンド", tagColor: "#FF6B35", note: "ワイヤレスの最高峰。遅延ゼロ・音質最高。本気でやるならこれ。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "🎵 イヤホン",
    description: "ヘッドセットより軽く・小さく・持ち運びやすい。スマホ・Switch勢にも最適。",
    items: [
      { name: "HyperX Cloud Earbuds II", price: "約5,000円〜", tag: "ゲーミング特化", tagColor: "#4CAF50", note: "Switch・スマホ向けゲーミングイヤホン。マイク付きで通話もOK。コスパ抜群。", amazon: "#", rakuten: "#" },
      { name: "Razer Hammerhead HyperSpeed", price: "約11,000円〜", tag: "ワイヤレス", tagColor: "#9C27B0", note: "ゲーム専用ワイヤレスイヤホン。低遅延モード搭載でゲームプレイに最適。", amazon: "#", rakuten: "#" },
      { name: "Sony INZONE Buds", price: "約22,000円〜", tag: "PS5公式対応", tagColor: "#2196F3", note: "PS5と公式連携。ノイキャン搭載・ゲーム用AIサウンドが敵の位置を強調。", amazon: "#", rakuten: "#" },
      { name: "SteelSeries Arctis Nova Pro In-Ear", price: "約18,000円〜", tag: "プロ仕様", tagColor: "#FF9800", note: "プロゲーマー向けチューニング。有線・低遅延で競技シーンでも使われる本格派。", amazon: "#", rakuten: "#" },
      { name: "Sony WF-1000XM5", price: "約32,000円〜", tag: "ノイキャン最強", tagColor: "#FF6B35", note: "業界最高のノイキャン。ゲームモード搭載で遅延を最小化。音質も最高峰。", amazon: "#", rakuten: "#" },
      { name: "Apple AirPods Pro 2", price: "約39,000円〜", tag: "iPhone勢", tagColor: "#607D8B", note: "iPhone・iPad・Macユーザーならエコシステムが最強。ゲームモードで遅延大幅低下。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "🎮 コントローラー",
    description: "パッドでフォートナイトを制する。エイムと操作性を劇的に改善。",
    items: [
      { name: "DualSense (PS5純正)", price: "約9,000円〜", tag: "定番", tagColor: "#4CAF50", note: "PC・PS5両対応。安定した操作感と入手しやすさ。まずはこれで間違いない。", amazon: "#", rakuten: "#" },
      { name: "Xbox ワイヤレスコントローラー", price: "約7,000円〜", tag: "PC向き", tagColor: "#2196F3", note: "PCフォートナイトと相性抜群。握りやすいデザインで長時間プレイでも疲れない。", amazon: "#", rakuten: "#" },
      { name: "Logicool G F310r", price: "約3,000円〜", tag: "格安入門", tagColor: "#4CAF50", note: "有線で信頼性抜群。コスパ最強の入門コントローラー。壊れにくい。", amazon: "#", rakuten: "#" },
      { name: "DualSense Edge", price: "約30,000円〜", tag: "Sony公式プロ仕様", tagColor: "#9C27B0", note: "背面ボタン・スティック交換対応のPS5公式プロコン。カスタマイズ性が高い。", amazon: "#", rakuten: "#" },
      { name: "SCUF Instinct Pro", price: "約25,000円〜", tag: "背面ボタン搭載", tagColor: "#FF9800", note: "背面ボタンでジャンプしながら建築可能。上位プレイヤー御用達の定番プロコン。", amazon: "#", rakuten: "#" },
      { name: "Xbox Elite シリーズ 2", price: "約20,000円〜", tag: "Microsoft公式プロ", tagColor: "#2196F3", note: "着脱式パドル・テンション調整対応。PC勢のプロゲーマーに最も使われているコントローラー。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "🖥️ ゲーミングモニター",
    description: "高リフレッシュレートで敵の動きがクリアに見える。144Hz以上が推奨。",
    items: [
      { name: "ASUS TUF Gaming VG249Q3A", price: "約25,000円〜", tag: "180Hz・コスパ", tagColor: "#4CAF50", note: "180Hz対応でなめらかな映像。フォートナイトに必要な性能を低価格で実現。", amazon: "#", rakuten: "#" },
      { name: "MSI Optix G244F", price: "約22,000円〜", tag: "144Hz・入門", tagColor: "#4CAF50", note: "144Hz・IPS液晶で色鮮やか。ゲーミングモニター入門に最適な一台。", amazon: "#", rakuten: "#" },
      { name: "LG UltraGear 27GP850-B", price: "約45,000円〜", tag: "165Hz・人気No.1", tagColor: "#FF9800", note: "プロゲーマーも使用。Nano IPS液晶で色鮮やか＆高速。ゲーム映えが違う。", amazon: "#", rakuten: "#" },
      { name: "ASUS ROG Swift PG259QN", price: "約80,000円〜", tag: "360Hz・最速", tagColor: "#FF6B35", note: "世界最速360Hz。目でとらえる限界を超えた滑らかさ。競技志向のフォートナイト勢向け。", amazon: "#", rakuten: "#" },
      { name: "Alienware AW2524H", price: "約90,000円〜", tag: "500Hz・超ハイエンド", tagColor: "#9C27B0", note: "なんと500Hz対応。プロトーナメント仕様。映像の滑らかさが別次元。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "⌨️ キーボード（PC勢向け）",
    description: "反応速度と指への負担が変わる。メカニカルスイッチが主流。",
    items: [
      { name: "Logicool G213r", price: "約6,000円〜", tag: "入門・メンブレン", tagColor: "#4CAF50", note: "コスパ最強のゲーミングキーボード。耐水設計で安心。初めての一台に。", amazon: "#", rakuten: "#" },
      { name: "HyperX Alloy Origins Core", price: "約9,000円〜", tag: "TKL・コスパ", tagColor: "#2196F3", note: "テンキーレスでマウスの動きを確保。HyperX製赤軸で軽い打鍵感。", amazon: "#", rakuten: "#" },
      { name: "Razer BlackWidow V3 TKL", price: "約14,000円〜", tag: "メカニカル定番", tagColor: "#9C27B0", note: "Razer緑軸のはっきりしたクリック感。耐久性1億回キー入力保証。", amazon: "#", rakuten: "#" },
      { name: "Logicool G913 TKL", price: "約23,000円〜", tag: "ワイヤレス薄型", tagColor: "#FF9800", note: "ラグゼロのワイヤレス。薄型で高速反応。デスク周りをスッキリさせたい人に。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "🖱️ ゲーミングマウス（PC勢向け）",
    description: "エイムの精度を上げる。軽さとセンサー精度が重要。",
    items: [
      { name: "Logicool G203", price: "約3,000円〜", tag: "入門・最安", tagColor: "#4CAF50", note: "軽量85g・高精度センサー。この価格でゲーミングマウスの基礎性能を全て持つ。", amazon: "#", rakuten: "#" },
      { name: "Razer DeathAdder V3", price: "約10,000円〜", tag: "人気No.1形状", tagColor: "#9C27B0", note: "世界で最も売れたゲーミングマウスの最新版。軽量63g・超高精度センサー。", amazon: "#", rakuten: "#" },
      { name: "Logicool G Pro X Superlight 2", price: "約18,000円〜", tag: "プロ御用達", tagColor: "#FF9800", note: "重さわずか60g。世界中のプロが使うマウスの頂点。エイムの精度が変わる。", amazon: "#", rakuten: "#" },
      { name: "SteelSeries Prime Wireless", price: "約12,000円〜", tag: "ワイヤレス軽量", tagColor: "#2196F3", note: "軽量80gのワイヤレス。ポーリングレート8000Hzで有線を超える反応速度。", amazon: "#", rakuten: "#" },
    ],
  },
  {
    category: "🪑 ゲーミングチェア",
    description: "長時間プレイの疲れを軽減。腰・姿勢への投資は必須。",
    items: [
      { name: "Bauhutte BM-900", price: "約15,000円〜", tag: "コスパ入門", tagColor: "#4CAF50", note: "国内人気No.1ブランド。腰サポート付きで長時間プレイの腰痛を予防。", amazon: "#", rakuten: "#" },
      { name: "AKRacing Pro-X V2", price: "約40,000円〜", tag: "定番ブランド", tagColor: "#FF9800", note: "ゲーミングチェアの定番。ヘッドレスト・ランバーサポート付き。長く使える品質。", amazon: "#", rakuten: "#" },
      { name: "Herman Miller × Logitech G Embody", price: "約220,000円〜", tag: "最高品質", tagColor: "#9C27B0", note: "オフィスチェアの最高峰とLogicool Gのコラボ。プロゲーマー御用達の至高の座り心地。", amazon: "#", rakuten: "#" },
    ],
  },
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
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
          padding: 8px 12px;
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
          padding: 8px 12px;
          background: #BF0000;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.15s;
        }
        .amazon-btn:hover, .rakuten-btn:hover {
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
          line-height: 1.8;
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
                    <div className="shop-btns">
                      <a href={item.amazon} className="amazon-btn" target="_blank" rel="noopener noreferrer">
                        🛒 Amazon
                      </a>
                      <a href={item.rakuten} className="rakuten-btn" target="_blank" rel="noopener noreferrer">
                        🛍️ 楽天
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="affiliate-note">
          ※ 掲載している価格は目安です。実際の価格はAmazon・楽天のページでご確認ください。<br />
          ※ 当サイトはAmazonアソシエイト・楽天アフィリエイトプログラムに参加しています。<br />
          ※ リンクを経由してご購入いただくと当サイトの運営費になります。
        </div>
      </div>
    </>
  );
}
