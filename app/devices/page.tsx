import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "おすすめゲーミングデバイス | フォトナHub",
  description: "フォートナイトをもっと楽しむためのおすすめゲーミングデバイスを紹介。マウス・キーボード・ヘッドセット・イヤホン・マイクなど厳選アイテム。",
};

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
  {
    category: "🖱️ マウス",
    description: "エイムの精度を上げるゲーミングマウス。フォートナイトのプロ選手も使用する厳選モデル。",
    items: [
      {
        name: "Logicool G PRO X SUPERLIGHT 2 DEX（ホワイト）",
        price: "約18,000円〜",
        tag: "プロ御用達",
        tagColor: "#4CAF50",
        note: "LIGHTFORCEハイブリッドスイッチ搭載。超軽量設計でプロプレイヤーに人気の最上位モデル。",
        amazon: "https://amzn.to/3Qwhlnp",
        rakuten: "",
        image: "",
      },
      {
        name: "Logicool G PRO X SUPERLIGHT 2（ブラック）Amazon限定",
        price: "約16,000円〜",
        tag: "Amazon限定",
        tagColor: "#FF9900",
        note: "軽量・高精度センサー搭載のワイヤレスゲーミングマウス。壁紙ダウンロード特典付き。",
        amazon: "https://amzn.to/4vg5w41",
        rakuten: "",
        image: "",
      },
      {
        name: "Logicool G PRO X SUPERLIGHT 2 DEX MG",
        price: "約18,000円〜",
        tag: "最上位モデル",
        tagColor: "#4CAF50",
        note: "DEXシリーズのメタリックグレーモデル。LIGHTFORCEスイッチとHERO 2センサーで最高精度。",
        amazon: "https://amzn.to/43KxJ74",
        rakuten: "",
        image: "",
      },
      {
        name: "Logicool G PRO X SUPERSTRIKE",
        price: "約25,000円〜",
        tag: "最新モデル",
        tagColor: "#9C27B0",
        note: "ハプティック誘導トリガーシステム搭載の次世代マウス。LIGHTSPEEDワイヤレス対応。",
        amazon: "https://amzn.to/4vjceWN",
        rakuten: "",
        image: "",
      },
      {
        name: "Logicool G PRO X2 LIGHTSPEED（ブラック）Amazon限定",
        price: "約15,000円〜",
        tag: "Amazon限定",
        tagColor: "#FF9900",
        note: "LIGHTSPEED接続で遅延ゼロのワイヤレス体験。壁紙ダウンロード特典付きAmazon限定モデル。",
        amazon: "https://amzn.to/4uMmPsn",
        rakuten: "",
        image: "",
      },
      {
        name: "Razer Viper V3 Pro",
        price: "約18,000円〜",
        tag: "人気モデル",
        tagColor: "#00BCD4",
        note: "Focus Pro光学センサー搭載。90時間バッテリーとRazer独自の光学マウススイッチで高信頼性。",
        amazon: "https://amzn.to/4ozaWo8",
        rakuten: "",
        image: "",
      },
      {
        name: "Razer Viper V4 Pro",
        price: "約20,000円〜",
        tag: "最新モデル",
        tagColor: "#9C27B0",
        note: "光学スクロールホイール採用の最新フラッグシップ。日本正規代理店保証品。",
        amazon: "https://amzn.to/3Qz0Ff3",
        rakuten: "",
        image: "",
      },
      {
        name: "Pulsar Gaming Gears CrazyLight",
        price: "約6,000円〜",
        tag: "コスパ最強",
        tagColor: "#FF5722",
        note: "圧倒的な軽さを誇るPulsar製ゲーミングマウス。フォートナイト向けの動きやすい超軽量設計。",
        amazon: "https://amzn.to/43LfoXm",
        rakuten: "",
        image: "",
      },
    ],
  },
  {
    category: "⌨️ キーボード",
    description: "ビルドや武器切り替えの速度を上げる高速キーボード。フォートナイトで差をつける厳選モデル。",
    items: [
      {
        name: "Logicool G512X 75%（ブラック）Amazon限定",
        price: "約15,000円〜",
        tag: "Amazon限定",
        tagColor: "#FF9900",
        note: "75%コンパクトレイアウトでデスクを広く使える。アクチュエーションポイント調整可能で反応速度カスタマイズ対応。",
        amazon: "https://amzn.to/3SisVTV",
        rakuten: "",
        image: "",
      },
      {
        name: "SteelSeries Apex Pro Mini",
        price: "約22,000円〜",
        tag: "OmniPoint搭載",
        tagColor: "#4CAF50",
        note: "OmniPointスイッチで0.1mmからのアクチュエーション調整が可能。コンパクトで操作しやすい60%キーボード。",
        amazon: "https://amzn.to/4ei6ff3",
        rakuten: "",
        image: "",
      },
      {
        name: "SteelSeries Apex Pro（有機ELディスプレイ）",
        price: "約28,000円〜",
        tag: "ハイエンド",
        tagColor: "#9C27B0",
        note: "OmniPointスイッチ＋有機ELディスプレイ搭載のフラッグシップモデル。スイッチごとにアクチュエーション設定可能。",
        amazon: "https://amzn.to/4ezikLC",
        rakuten: "",
        image: "",
      },
      {
        name: "AIM1 MATATAKI（8000Hzポーリング）",
        price: "約8,000円〜",
        tag: "高ポーリング",
        tagColor: "#2196F3",
        note: "8000Hzポーリングレート対応でPC入力遅延を大幅削減。バックライトLED搭載のコスパモデル。",
        amazon: "https://amzn.to/4xFg9Pr",
        rakuten: "",
        image: "",
      },
      {
        name: "Pulsar Gaming Gears キーボード（国内正規品）",
        price: "約12,000円〜",
        tag: "高ポーリング",
        tagColor: "#2196F3",
        note: "高ポーリングレート対応のPulsar製ゲーミングキーボード。国内正規品保証付き。",
        amazon: "https://amzn.to/4uJ2BQk",
        rakuten: "",
        image: "",
      },
    ],
  },
  {
    category: "🎧 ヘッドセット・ヘッドホン",
    description: "敵の足音や銃声を聞き分ける高音質ヘッドセット。フォートナイトで音の情報をフル活用。",
    items: [
      {
        name: "Logicool G PRO X 2 LIGHTSPEED ヘッドセット（Amazon限定）",
        price: "約18,000円〜",
        tag: "ワイヤレス",
        tagColor: "#4CAF50",
        note: "プロゲーマー向けワイヤレスヘッドセット。LIGHTSPEED接続で低遅延、長時間バッテリー搭載。",
        amazon: "https://amzn.to/4guJF4f",
        rakuten: "",
        image: "",
      },
      {
        name: "Audio-Technica ATH-M50x（ホワイト）",
        price: "約15,000円〜",
        tag: "モニター向け",
        tagColor: "#2196F3",
        note: "スタジオモニターヘッドホンの定番。フラットな音響特性で敵の位置を正確に把握できる。",
        amazon: "https://amzn.to/4uOjDN4",
        rakuten: "",
        image: "",
      },
      {
        name: "Audio-Technica ATH-R50x（開放型）",
        price: "約18,000円〜",
        tag: "開放型",
        tagColor: "#9C27B0",
        note: "開放型モニターヘッドホンで広い音場を実現。長時間プレイでも疲れにくい装着感。",
        amazon: "https://amzn.to/4ejOvQz",
        rakuten: "",
        image: "",
      },
      {
        name: "HyperX Cloud ゲーミングヘッドセット",
        price: "約6,000円〜",
        tag: "マルチ対応",
        tagColor: "#FF5722",
        note: "PC/PS5/PS4/Xbox/Nintendo Switch対応。コスパ最強のゲーミングヘッドセット入門モデル。",
        amazon: "https://amzn.to/3QwhAPl",
        rakuten: "",
        image: "",
      },
      {
        name: "Logicool G335 ゲーミングヘッドセット",
        price: "約6,000円〜",
        tag: "軽量設計",
        tagColor: "#4CAF50",
        note: "フリップミュート搭載で瞬時にマイクOFF可能。軽量設計で長時間プレイにも最適。",
        amazon: "https://amzn.to/3QBku5o",
        rakuten: "",
        image: "",
      },
      {
        name: "Amazonベーシック 有線ヘッドセット",
        price: "約2,500円〜",
        tag: "入門モデル",
        tagColor: "#FF9900",
        note: "調節可能マイク付きのシンプルな有線ヘッドセット。3.5mm接続でどのデバイスでも使える。",
        amazon: "https://amzn.to/43OQnuq",
        rakuten: "",
        image: "",
      },
    ],
  },
  {
    category: "🎧 ゲーミングイヤホン",
    description: "ヘッドセットより軽く、長時間でも疲れにくいゲーミングイヤホン。",
    items: [
      {
        name: "SHURE SE215 SPE-A 有線イヤホン",
        price: "約8,000円〜",
        tag: "高遮音性",
        tagColor: "#4CAF50",
        note: "VGP殿堂入り金賞受賞。高遮音性で周囲の雑音をシャットアウトしゲームに集中できる。",
        amazon: "https://amzn.to/4aWw1mM",
        rakuten: "",
        image: "",
      },
      {
        name: "final VR3000 Gray 有線ゲーミングイヤホン",
        price: "約5,000円〜",
        tag: "3Dサラウンド",
        tagColor: "#2196F3",
        note: "バイノーラル3Dサラウンドサウンド対応。360オーディオ推奨で立体的な音響体験を実現。",
        amazon: "https://amzn.to/4vXtIbc",
        rakuten: "",
        image: "",
      },
      {
        name: "RYR ゲーミングイヤホン（Bluetooth 5.3）",
        price: "約4,000円〜",
        tag: "低遅延BT",
        tagColor: "#9C27B0",
        note: "20ms未満の超低遅延Bluetooth接続。ノイズキャンセリングマイク内蔵で通話・ゲーム両対応。",
        amazon: "https://amzn.to/43KBU2I",
        rakuten: "",
        image: "",
      },
      {
        name: "Soundmaster ゲーミングイヤホン（マイク付き）",
        price: "約2,000円〜",
        tag: "コスパ",
        tagColor: "#FF5722",
        note: "マイクミュート機能搭載のゲーミングイヤホン。Nintendo Switch含むマルチデバイス対応。",
        amazon: "https://amzn.to/4fW4XaL",
        rakuten: "",
        image: "",
      },
      {
        name: "Erssimo ゲーミングイヤホン（マイク付き）",
        price: "約2,000円〜",
        tag: "入門モデル",
        tagColor: "#FF9900",
        note: "マイクミュート機能付きゲーミングイヤホン。軽量で長時間プレイでも疲れにくい設計。",
        amazon: "https://amzn.to/4wjoZRF",
        rakuten: "",
        image: "",
      },
    ],
  },
  {
    category: "🎤 マイク",
    description: "ボイスチャットの音質を上げるゲーミングマイク。チームプレイで声が鮮明に届く。",
    items: [
      {
        name: "MAONO PD100XS ゲーミングマイク（ダイナミック）",
        price: "約6,000円〜",
        tag: "ノイキャン",
        tagColor: "#4CAF50",
        note: "ノイズキャンセリング機能搭載のダイナミックマイク。周囲の雑音を拾わず声だけを届ける。",
        amazon: "https://amzn.to/4a9arLJ",
        rakuten: "",
        image: "",
      },
      {
        name: "HyperX コンデンサーマイク（AR0A0AA）",
        price: "約8,000円〜",
        tag: "コンテンツ向け",
        tagColor: "#9C27B0",
        note: "内蔵ショックマウント採用でノイズを軽減。コンテンツクリエーターにも人気のUSBマイク。",
        amazon: "https://amzn.to/4vjcDsh",
        rakuten: "",
        image: "",
      },
      {
        name: "HyperX DuoCast USBマイク",
        price: "約9,000円〜",
        tag: "配信向け",
        tagColor: "#9C27B0",
        note: "USB接続のスタンドアロンマイク。カーディオイド・全指向性の2パターン対応で配信に最適。",
        amazon: "https://amzn.to/4vqR1uq",
        rakuten: "",
        image: "",
      },
      {
        name: "FIFINE ダイナミックマイク（オーディオミキサー付き）",
        price: "約7,000円〜",
        tag: "ミキサー付き",
        tagColor: "#2196F3",
        note: "オーディオインターフェース・ミキサー機能一体型。音声モニタリング機能で自分の声をリアルタイム確認。",
        amazon: "https://amzn.to/4a4Dikk",
        rakuten: "",
        image: "",
      },
      {
        name: "UGREEN コンデンサーマイク（RGB）",
        price: "約5,000円〜",
        tag: "RGB",
        tagColor: "#FF5722",
        note: "7種類のRGBライティングモード搭載。ゲーミングデスクに映えるおしゃれなコンデンサーマイク。",
        amazon: "https://amzn.to/4vklHNB",
        rakuten: "",
        image: "",
      },
      {
        name: "USBコンデンサーマイク（RGBライティング）",
        price: "約3,000円〜",
        tag: "コスパ",
        tagColor: "#FF9900",
        note: "ワンタッチミュート搭載のRGBゲーミングマイク。コンテンツクリエーター向けのエントリーモデル。",
        amazon: "https://amzn.to/4vYTkEP",
        rakuten: "",
        image: "",
      },
      {
        name: "ZealSound PC用録音マイク（卓上スタンド付属）",
        price: "約3,000円〜",
        tag: "スタンド付き",
        tagColor: "#4CAF50",
        note: "卓上スタンド付属でセットアップが簡単。YouTube・ゲーム・生配信など幅広い用途に対応。",
        amazon: "https://amzn.to/4vofWP8",
        rakuten: "",
        image: "",
      },
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
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }
        .device-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .device-img-placeholder {
          width: 100%;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, var(--card) 0%, var(--surface) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 44px;
        }
        .device-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .device-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .device-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.4;
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
          font-size: 11px;
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
          font-size: 14px;
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
        .amazon-btn:hover { opacity: 0.85; }
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
          .device-grid { grid-template-columns: 1fr 1fr; }
          .device-body { padding: 10px; }
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
                  <div className="device-img-placeholder">
                    {category.category.split(" ")[0]}
                  </div>
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
                        <a href={item.amazon} className="amazon-btn" target="_blank" rel="noopener noreferrer">
                          🛒 Amazonで見る
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="affiliate-note">
          ※ 掲載している価格は目安です。実際の価格はAmazonのページでご確認ください。<br />
          ※ 当サイトはAmazonアソシエイトプログラムに参加しています。<br />
          ※ リンクを経由してご購入いただくと当サイトの運営費になります。
        </div>
      </div>
    </>
  );
}
