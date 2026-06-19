import type { Metadata } from "next";
import { DeviceImage } from "@/components/DeviceImage";

export const metadata: Metadata = {
  title: "おすすめゲーミングデバイス | フォトナHub",
  description: "フォートナイトをもっと楽しむためのおすすめゲーミングデバイスを紹介。マウス・キーボード・ヘッドセット・イヤホン・マイク・モニター・マウスパッドなど厳選アイテム。",
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
    asin: string;
  }[];
}[] = [
  {
    category: "🖱️ マウス",
    description: "エイムの精度を上げるゲーミングマウス。フォートナイトのプロ選手も使用する厳選モデル。",
    items: [
      { name: "Logicool G PRO X SUPERLIGHT 2 DEX（ホワイト）", price: "約18,000円〜", tag: "プロ御用達", tagColor: "#4CAF50", note: "LIGHTFORCEハイブリッドスイッチ搭載。超軽量設計でプロプレイヤーに人気の最上位モデル。", amazon: "https://amzn.to/3Qwhlnp", asin: "B0FPRZTG3G" },
      { name: "Logicool G PRO X SUPERLIGHT 2（ブラック）Amazon限定", price: "約16,000円〜", tag: "Amazon限定", tagColor: "#FF9900", note: "軽量・高精度センサー搭載のワイヤレスゲーミングマウス。壁紙ダウンロード特典付き。", amazon: "https://amzn.to/4vg5w41", asin: "B0D21Q6QG4" },
      { name: "Logicool G PRO X SUPERLIGHT 2 DEX MG", price: "約18,000円〜", tag: "最上位モデル", tagColor: "#4CAF50", note: "DEXシリーズのメタリックグレーモデル。LIGHTFORCEスイッチとHERO 2センサーで最高精度。", amazon: "https://amzn.to/43KxJ74", asin: "B0DF2FNYZQ" },
      { name: "Logicool G PRO X SUPERSTRIKE", price: "約25,000円〜", tag: "最新モデル", tagColor: "#9C27B0", note: "ハプティック誘導トリガーシステム搭載の次世代マウス。LIGHTSPEEDワイヤレス対応。", amazon: "https://amzn.to/4vjceWN", asin: "B0GGWQ7HZ2" },
      { name: "Logicool G PRO X2 LIGHTSPEED（ブラック）Amazon限定", price: "約15,000円〜", tag: "Amazon限定", tagColor: "#FF9900", note: "LIGHTSPEED接続で遅延ゼロのワイヤレス体験。壁紙ダウンロード特典付きAmazon限定モデル。", amazon: "https://amzn.to/4uMmPsn", asin: "B0D9VVJ967" },
      { name: "Razer Viper V3 Pro", price: "約18,000円〜", tag: "人気モデル", tagColor: "#00BCD4", note: "Focus Pro光学センサー搭載。90時間バッテリーとRazer独自の光学マウススイッチで高信頼性。", amazon: "https://amzn.to/4ozaWo8", asin: "B0B8S9Q5V7" },
      { name: "Razer Viper V4 Pro", price: "約20,000円〜", tag: "最新モデル", tagColor: "#9C27B0", note: "光学スクロールホイール採用の最新フラッグシップ。日本正規代理店保証品。", amazon: "https://amzn.to/3Qz0Ff3", asin: "B0GS4YLKP7" },
      { name: "Pulsar Gaming Gears CrazyLight", price: "約6,000円〜", tag: "コスパ最強", tagColor: "#FF5722", note: "圧倒的な軽さを誇るPulsar製ゲーミングマウス。フォートナイト向けの動きやすい超軽量設計。", amazon: "https://amzn.to/43LfoXm", asin: "B0G6DHM1Z6" },
    ],
  },
  {
    category: "⌨️ キーボード",
    description: "ビルドや武器切り替えの速度を上げる高速キーボード。フォートナイトで差をつける厳選モデル。",
    items: [
      { name: "Logicool G512X 75%（ブラック）Amazon限定", price: "約15,000円〜", tag: "Amazon限定", tagColor: "#FF9900", note: "75%コンパクトレイアウトでデスクを広く使える。アクチュエーションポイント調整可能で反応速度カスタマイズ対応。", amazon: "https://amzn.to/3SisVTV", asin: "B0GJ8B24WT" },
      { name: "SteelSeries Apex Pro Mini", price: "約22,000円〜", tag: "OmniPoint搭載", tagColor: "#4CAF50", note: "OmniPointスイッチで0.1mmからのアクチュエーション調整が可能。コンパクトで操作しやすい60%キーボード。", amazon: "https://amzn.to/4ei6ff3", asin: "B0B5X1PSVP" },
      { name: "SteelSeries Apex Pro（有機ELディスプレイ）", price: "約28,000円〜", tag: "ハイエンド", tagColor: "#9C27B0", note: "OmniPointスイッチ＋有機ELディスプレイ搭載のフラッグシップモデル。スイッチごとにアクチュエーション設定可能。", amazon: "https://amzn.to/4ezikLC", asin: "B0BJ1SSV1P" },
      { name: "AIM1 MATATAKI（8000Hzポーリング）", price: "約8,000円〜", tag: "高ポーリング", tagColor: "#2196F3", note: "8000Hzポーリングレート対応でPC入力遅延を大幅削減。バックライトLED搭載のコスパモデル。", amazon: "https://amzn.to/4xFg9Pr", asin: "B0DQPMWJ7M" },
      { name: "Pulsar Gaming Gears キーボード（国内正規品）", price: "約12,000円〜", tag: "高ポーリング", tagColor: "#2196F3", note: "高ポーリングレート対応のPulsar製ゲーミングキーボード。国内正規品保証付き。", amazon: "https://amzn.to/4uJ2BQk", asin: "B0G4LTPMLY" },
    ],
  },
  {
    category: "🎧 ヘッドセット・ヘッドホン",
    description: "敵の足音や銃声を聞き分ける高音質ヘッドセット。フォートナイトで音の情報をフル活用。",
    items: [
      { name: "Logicool G PRO X 2 LIGHTSPEED ヘッドセット（Amazon限定）", price: "約18,000円〜", tag: "ワイヤレス", tagColor: "#4CAF50", note: "プロゲーマー向けワイヤレスヘッドセット。LIGHTSPEED接続で低遅延、長時間バッテリー搭載。", amazon: "https://amzn.to/4guJF4f", asin: "B0BC142H1L" },
      { name: "Audio-Technica ATH-M50x（ホワイト）", price: "約15,000円〜", tag: "モニター向け", tagColor: "#2196F3", note: "スタジオモニターヘッドホンの定番。フラットな音響特性で敵の位置を正確に把握できる。", amazon: "https://amzn.to/4uOjDN4", asin: "B00HVLURL8" },
      { name: "Audio-Technica ATH-R50x（開放型）", price: "約18,000円〜", tag: "開放型", tagColor: "#9C27B0", note: "開放型モニターヘッドホンで広い音場を実現。長時間プレイでも疲れにくい装着感。", amazon: "https://amzn.to/4ejOvQz", asin: "B0DSMG4K6K" },
      { name: "HyperX Cloud ゲーミングヘッドセット", price: "約6,000円〜", tag: "マルチ対応", tagColor: "#FF5722", note: "PC/PS5/PS4/Xbox/Nintendo Switch対応。コスパ最強のゲーミングヘッドセット入門モデル。", amazon: "https://amzn.to/3QwhAPl", asin: "B0C3BV19Q3" },
      { name: "Logicool G335 ゲーミングヘッドセット", price: "約6,000円〜", tag: "軽量設計", tagColor: "#4CAF50", note: "フリップミュート搭載で瞬時にマイクOFF可能。軽量設計で長時間プレイにも最適。", amazon: "https://amzn.to/3QBku5o", asin: "B097DBSJ1F" },
      { name: "Amazonベーシック 有線ヘッドセット", price: "約2,500円〜", tag: "入門モデル", tagColor: "#FF9900", note: "調節可能マイク付きのシンプルな有線ヘッドセット。3.5mm接続でどのデバイスでも使える。", amazon: "https://amzn.to/43OQnuq", asin: "B0DB737QJ3" },
    ],
  },
  {
    category: "🎧 ゲーミングイヤホン",
    description: "ヘッドセットより軽く、長時間でも疲れにくいゲーミングイヤホン。",
    items: [
      { name: "SHURE SE215 SPE-A 有線イヤホン", price: "約8,000円〜", tag: "高遮音性", tagColor: "#4CAF50", note: "VGP殿堂入り金賞受賞。高遮音性で周囲の雑音をシャットアウトしゲームに集中できる。", amazon: "https://amzn.to/4aWw1mM", asin: "B00A16BT4E" },
      { name: "final VR3000 Gray 有線ゲーミングイヤホン", price: "約5,000円〜", tag: "3Dサラウンド", tagColor: "#2196F3", note: "バイノーラル3Dサラウンドサウンド対応。360オーディオ推奨で立体的な音響体験を実現。", amazon: "https://amzn.to/4vXtIbc", asin: "B0D54GFGCH" },
      { name: "RYR ゲーミングイヤホン（Bluetooth 5.3）", price: "約4,000円〜", tag: "低遅延BT", tagColor: "#9C27B0", note: "20ms未満の超低遅延Bluetooth接続。ノイズキャンセリングマイク内蔵で通話・ゲーム両対応。", amazon: "https://amzn.to/43KBU2I", asin: "B0GTYP918Q" },
      { name: "Soundmaster ゲーミングイヤホン（マイク付き）", price: "約2,000円〜", tag: "コスパ", tagColor: "#FF5722", note: "マイクミュート機能搭載のゲーミングイヤホン。Nintendo Switch含むマルチデバイス対応。", amazon: "https://amzn.to/4fW4XaL", asin: "B0BGYR5WGS" },
      { name: "Erssimo ゲーミングイヤホン（マイク付き）", price: "約2,000円〜", tag: "入門モデル", tagColor: "#FF9900", note: "マイクミュート機能付きゲーミングイヤホン。軽量で長時間プレイでも疲れにくい設計。", amazon: "https://amzn.to/4wjoZRF", asin: "B0FZR7CQY3" },
    ],
  },
  {
    category: "🎤 マイク",
    description: "ボイスチャットの音質を上げるゲーミングマイク。チームプレイで声が鮮明に届く。",
    items: [
      { name: "MAONO PD100XS ゲーミングマイク（ダイナミック）", price: "約6,000円〜", tag: "ノイキャン", tagColor: "#4CAF50", note: "ノイズキャンセリング機能搭載のダイナミックマイク。周囲の雑音を拾わず声だけを届ける。", amazon: "https://amzn.to/4a9arLJ", asin: "B0F1F3PZJF" },
      { name: "HyperX コンデンサーマイク（AR0A0AA）", price: "約8,000円〜", tag: "コンテンツ向け", tagColor: "#9C27B0", note: "内蔵ショックマウント採用でノイズを軽減。コンテンツクリエーターにも人気のUSBマイク。", amazon: "https://amzn.to/4vjcDsh", asin: "B0FLKJ7FH7" },
      { name: "HyperX DuoCast USBマイク", price: "約9,000円〜", tag: "配信向け", tagColor: "#9C27B0", note: "USB接続のスタンドアロンマイク。カーディオイド・全指向性の2パターン対応で配信に最適。", amazon: "https://amzn.to/4vqR1uq", asin: "B0B119XZBK" },
      { name: "FIFINE ダイナミックマイク（オーディオミキサー付き）", price: "約7,000円〜", tag: "ミキサー付き", tagColor: "#2196F3", note: "オーディオインターフェース・ミキサー機能一体型。音声モニタリング機能で自分の声をリアルタイム確認。", amazon: "https://amzn.to/4a4Dikk", asin: "B0DNJGTMBK" },
      { name: "UGREEN コンデンサーマイク（RGB）", price: "約5,000円〜", tag: "RGB", tagColor: "#FF5722", note: "7種類のRGBライティングモード搭載。ゲーミングデスクに映えるおしゃれなコンデンサーマイク。", amazon: "https://amzn.to/4vklHNB", asin: "B0FG7DVV62" },
      { name: "USBコンデンサーマイク（RGBライティング）", price: "約3,000円〜", tag: "コスパ", tagColor: "#FF9900", note: "ワンタッチミュート搭載のRGBゲーミングマイク。コンテンツクリエーター向けのエントリーモデル。", amazon: "https://amzn.to/4vYTkEP", asin: "B0D4Z8LWXC" },
      { name: "ZealSound PC用録音マイク（卓上スタンド付属）", price: "約3,000円〜", tag: "スタンド付き", tagColor: "#4CAF50", note: "卓上スタンド付属でセットアップが簡単。YouTube・ゲーム・生配信など幅広い用途に対応。", amazon: "https://amzn.to/4vofWP8", asin: "B092JB6XR3" },
    ],
  },
  {
    category: "🖥️ ゲーミングモニター",
    description: "フォートナイトの映像を最大限に引き出す高リフレッシュレートモニター。",
    items: [
      { name: "ASUS VY249HGR（Amazon限定）24インチ FHD", price: "約18,000円〜", tag: "Amazon限定", tagColor: "#FF9900", note: "SmoothMotion技術搭載で1ms(MPRT)の高速応答。ブルーライト軽減機能付き24インチFHDモニター。", amazon: "https://amzn.to/4vXmPGU", asin: "B0DNDXMLR7" },
      { name: "ASUS VG259Q5A（Amazon限定）25インチ FHD", price: "約25,000円〜", tag: "スピーカー内蔵", tagColor: "#4CAF50", note: "ステレオスピーカー内蔵・DisplayWidget対応のゲーミングモニター。Amazon限定モデル。", amazon: "https://amzn.to/4uNiB3N", asin: "B0F9WJLW45" },
      { name: "INNOCN 25G2G ゲーミングモニター", price: "約15,000円〜", tag: "コスパ", tagColor: "#FF5722", note: "AdaptiveSync対応でカクつきのない滑らかな映像。HDMIケーブル付属で届いてすぐ使える。", amazon: "https://amzn.to/44kMqha", asin: "B0DNKC8HXP" },
      { name: "KOORUI ゲーミングモニター 240Hz", price: "約18,000円〜", tag: "240Hz", tagColor: "#2196F3", note: "240Hz高リフレッシュレート対応。AdaptiveSync・DisplayPort搭載でゲームに最適な環境を構築。", amazon: "https://amzn.to/4el5DoU", asin: "B0GCD62S2H" },
      { name: "AOC 24G4ZR 240Hz ゲーミングモニター", price: "約20,000円〜", tag: "240Hz", tagColor: "#2196F3", note: "FreeSync Premium対応240Hzモニター。ゲームアシスト機能充実でフォートナイトに最適。", amazon: "https://amzn.to/4uHem9N", asin: "B0H2DQCFQK" },
      { name: "Dell SE2426HG（Amazon限定）23.8インチ FreeSync", price: "約16,000円〜", tag: "Amazon限定", tagColor: "#FF9900", note: "Dellブランドの信頼性とFreeSync搭載で安定したゲーミング体験。コスパ重視の入門モデル。", amazon: "https://amzn.to/4eltdC8", asin: "B0G6JV85HG" },
      { name: "240Hz FreeSync ゲーミングモニター（スピーカー付き）", price: "約22,000円〜", tag: "スピーカー内蔵", tagColor: "#4CAF50", note: "FreeSync対応240Hz・DisplayPort接続対応。スピーカー・ヘッドフォン端子内蔵で便利。", amazon: "https://amzn.to/4eidvrg", asin: "B0FX4V8L8N" },
      { name: "BenQ ZOWIE XL2540X（esports仕様）", price: "約55,000円〜", tag: "プロ仕様", tagColor: "#9C27B0", note: "BenQ ZOWIEのesports特化モデル。eQualizer搭載で暗部を見やすく調整。プロ大会標準モニター。", amazon: "https://amzn.to/3Sk2FbJ", asin: "B0FNWK9S7K" },
      { name: "KTC 24.5インチ 240Hz HDR400", price: "約20,000円〜", tag: "HDR対応", tagColor: "#FF5722", note: "HDR400対応でゲームの世界観を鮮やかに描写。240Hz・コントラスト比1000:1の高品質モニター。", amazon: "https://amzn.to/4gs3n0r", asin: "B0FKLTRTQP" },
    ],
  },
  {
    category: "🖱️ マウスパッド",
    description: "マウスの滑りを最適化してエイム精度を向上させるゲーミングマウスパッド。",
    items: [
      { name: "AIM1 × coalowl コラボ マウスパッド（500×500mm）", price: "約4,000円〜", tag: "コラボ限定", tagColor: "#9C27B0", note: "人気ゲーマーcoalowlとAIM1のコラボモデル。バランスタイプ500×500×3.5mmの大型パッド。", amazon: "https://amzn.to/3SBcSR7", asin: "B0FB89TG8K" },
      { name: "Benvo ゲーミングマウスパッド（滑り止めゴム底）", price: "約1,500円〜", tag: "コスパ", tagColor: "#FF5722", note: "滑り止めゴム底でデスクに固定。不整なパターンが特徴的なゲーミングマウスパッド。", amazon: "https://amzn.to/4eidxPU", asin: "B08L7HY8ZB" },
      { name: "Black Shark ゲーミングデスクマット（大型）", price: "約2,000円〜", tag: "大型デスクマット", tagColor: "#2196F3", note: "デスク全体をカバーする大型デスクマット。Black Shark製で安定した操作性を実現。", amazon: "https://amzn.to/4gs6CVF", asin: "B09F6N495X" },
      { name: "G-SR-SE ROUGE II ゲーミングマウスパッド（47×39cm）", price: "約3,000円〜", tag: "速め布製", tagColor: "#4CAF50", note: "47×39cmの中型サイズ。速めの滑り心地で素早いエイムを実現するゲーミングパッド。", amazon: "https://amzn.to/4xAUWWK", asin: "B0F1T63G3K" },
      { name: "ARTISAN NINJA FX SOFT マウスパッド（Lサイズ）", price: "約6,000円〜", tag: "高品質布製", tagColor: "#9C27B0", note: "国産ハイエンドマウスパッドブランドARTISANのNINJA FX。精密なエイム操作をサポート。", amazon: "https://amzn.to/3SlYiNi", asin: "B0CNBZY62H" },
      { name: "SP-004A ガラスゲーミングマウスパッド（第4世代）", price: "約5,000円〜", tag: "ガラス製", tagColor: "#2196F3", note: "第4世代マイクロエッチング加工ガラス表面。超高速スライドと制動力を両立したコンパクトサイズ。", amazon: "https://amzn.to/4eDatNn", asin: "B0FKTHF6D8" },
      { name: "SkyPAD Glass ガラスゲーミングマウスパッド（大型）", price: "約8,000円〜", tag: "ガラス製", tagColor: "#2196F3", note: "特殊ガラス表面で精度と速度が大幅向上。プロフェッショナル向け大型ガラスマウスパッド。", amazon: "https://amzn.to/3SlYk7S", asin: "B09MJ4L9NG" },
      { name: "Fluid Pattern XL ゲーミングデスクマット", price: "約2,000円〜", tag: "XLサイズ", tagColor: "#FF5722", note: "キーボードとマウスを一緒にカバーするXL大型デスクマット。Fluid Patternデザインがおしゃれ。", amazon: "https://amzn.to/4eo1xLm", asin: "B0DSC2K2H3" },
      { name: "Pulsar Gaming Gears Superglide2 マウスパッド", price: "約3,500円〜", tag: "人気ブランド", tagColor: "#4CAF50", note: "Pulsar Gaming Gearsの人気マウスパッド。Superglide2採用で滑りが抜群に良い。", amazon: "https://amzn.to/3QBkNgy", asin: "B088M1Q665" },
    ],
  },
  {
    category: "💪 アームカバー",
    description: "腕の摩擦を軽減してマウス操作をスムーズにするゲーミングアームカバー。",
    items: [
      { name: "REJECT ゲーミングアームカバー（VALORANT/フォートナイト）", price: "約2,500円〜", tag: "プロチームコラボ", tagColor: "#9C27B0", note: "プロeスポーツチームREJECT監修。VALORANT・フォートナイト向けの本格ゲーミングアームカバー。", amazon: "https://amzn.to/43OQGW6", asin: "B0CWTZXQV4" },
      { name: "Peabownn ゲーミングアームカバー（冷感・摩擦軽減）", price: "約1,500円〜", tag: "冷感素材", tagColor: "#2196F3", note: "冷感素材で長時間プレイでも快適。腕の摩擦を軽減してマウス操作が滑らかになる。", amazon: "https://amzn.to/4ozbvyg", asin: "B0F47Z6NT3" },
    ],
  },
];

export default function DevicesPage() {
  return (
    <>
      <style>{`
        .devices-page { max-width: 1000px; margin: 0 auto; padding: 24px 16px 48px; }
        .devices-hero { text-align: center; margin-bottom: 40px; }
        .devices-hero h1 { font-size: 26px; font-weight: 900; color: var(--primary); margin-bottom: 8px; }
        .devices-hero p { color: var(--text-muted); font-size: 14px; }
        .device-category { margin-bottom: 40px; }
        .category-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
        .category-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .device-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .device-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
        .device-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .device-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
        .device-name { font-size: 12px; font-weight: 700; color: var(--text); line-height: 1.4; }
        .device-tag { font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .device-note { font-size: 11px; color: var(--text-muted); line-height: 1.6; flex: 1; }
        .device-footer { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
        .device-price { font-size: 14px; font-weight: 700; color: var(--primary); }
        .amazon-btn { flex: 1; display: inline-block; padding: 9px 12px; background: #FF9900; color: #000; font-size: 12px; font-weight: 700; border-radius: 8px; text-decoration: none; text-align: center; transition: opacity 0.15s; }
        .amazon-btn:hover { opacity: 0.85; }
        .affiliate-note { margin-top: 40px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; color: var(--text-muted); text-align: center; line-height: 1.8; }
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
                  <DeviceImage
                    asin={item.asin}
                    alt={item.name}
                    emoji={category.category.split(" ")[0]}
                  />
                  <div className="device-body">
                    <div className="device-card-header">
                      <div className="device-name">{item.name}</div>
                      <span className="device-tag" style={{ background: item.tagColor + "22", color: item.tagColor }}>
                        {item.tag}
                      </span>
                    </div>
                    <div className="device-note">{item.note}</div>
                    <div className="device-footer">
                      <div className="device-price">{item.price}</div>
                      <a href={item.amazon} className="amazon-btn" target="_blank" rel="noopener noreferrer">
                        🛒 Amazonで見る
                      </a>
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
