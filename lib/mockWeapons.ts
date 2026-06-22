export interface Weapon {
  id: string;
  name: string;
  type: "assault" | "smg" | "shotgun" | "sniper" | "pistol" | "explosive" | "special";
  typeDisplay: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "exotic";
  rarityDisplay: string;
  damage: number;
  dps: number;
  fireRate: number;
  magSize: number;
  reloadTime: number;
  headMultiplier: number;
  emoji: string;
  // APIキー取得後にここが画像URLになる
  image?: string;
}

export const MOCK_WEAPONS: Weapon[] = [
  // ─── アサルトライフル ───
  { id: "ar_uc", name: "アサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "uncommon", rarityDisplay: "アンコモン", damage: 33, fireRate: 5.5, magSize: 30, reloadTime: 2.4, dps: 181, headMultiplier: 2.0, emoji: "🔫" },
  { id: "ar_r", name: "アサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "rare", rarityDisplay: "レア", damage: 35, fireRate: 5.5, magSize: 30, reloadTime: 2.3, dps: 192, headMultiplier: 2.0, emoji: "🔫" },
  { id: "ar_e", name: "アサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "epic", rarityDisplay: "エピック", damage: 37, fireRate: 5.5, magSize: 30, reloadTime: 2.2, dps: 203, headMultiplier: 2.0, emoji: "🔫" },
  { id: "ar_l", name: "アサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 39, fireRate: 5.5, magSize: 30, reloadTime: 2.1, dps: 214, headMultiplier: 2.0, emoji: "🔫" },
  { id: "burst_r", name: "バーストアサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "rare", rarityDisplay: "レア", damage: 32, fireRate: 4.0, magSize: 30, reloadTime: 2.3, dps: 128, headMultiplier: 2.0, emoji: "🔫" },
  { id: "burst_e", name: "バーストアサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "epic", rarityDisplay: "エピック", damage: 33, fireRate: 4.0, magSize: 30, reloadTime: 2.2, dps: 132, headMultiplier: 2.0, emoji: "🔫" },
  { id: "heavy_e", name: "ヘビーアサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "epic", rarityDisplay: "エピック", damage: 44, fireRate: 3.3, magSize: 25, reloadTime: 3.0, dps: 145, headMultiplier: 1.75, emoji: "🔫" },
  { id: "heavy_l", name: "ヘビーアサルトライフル", type: "assault", typeDisplay: "アサルトライフル", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 46, fireRate: 3.3, magSize: 25, reloadTime: 2.9, dps: 151, headMultiplier: 1.75, emoji: "🔫" },

  // ─── SMG ───
  { id: "smg_c", name: "サブマシンガン", type: "smg", typeDisplay: "SMG", rarity: "common", rarityDisplay: "コモン", damage: 18, fireRate: 13.0, magSize: 35, reloadTime: 2.1, dps: 234, headMultiplier: 1.5, emoji: "🔫" },
  { id: "smg_uc", name: "サブマシンガン", type: "smg", typeDisplay: "SMG", rarity: "uncommon", rarityDisplay: "アンコモン", damage: 19, fireRate: 13.0, magSize: 35, reloadTime: 2.0, dps: 247, headMultiplier: 1.5, emoji: "🔫" },
  { id: "smg_r", name: "サブマシンガン", type: "smg", typeDisplay: "SMG", rarity: "rare", rarityDisplay: "レア", damage: 20, fireRate: 13.0, magSize: 35, reloadTime: 1.9, dps: 260, headMultiplier: 1.5, emoji: "🔫" },
  { id: "compact_e", name: "コンパクトSMG", type: "smg", typeDisplay: "SMG", rarity: "epic", rarityDisplay: "エピック", damage: 23, fireRate: 11.0, magSize: 40, reloadTime: 2.2, dps: 253, headMultiplier: 1.5, emoji: "🔫" },
  { id: "compact_l", name: "コンパクトSMG", type: "smg", typeDisplay: "SMG", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 24, fireRate: 11.0, magSize: 40, reloadTime: 2.1, dps: 264, headMultiplier: 1.5, emoji: "🔫" },

  // ─── ショットガン ───
  { id: "pump_uc", name: "ポンプショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "uncommon", rarityDisplay: "アンコモン", damage: 95, fireRate: 0.7, magSize: 5, reloadTime: 0.85, dps: 66, headMultiplier: 1.5, emoji: "🔫" },
  { id: "pump_r", name: "ポンプショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "rare", rarityDisplay: "レア", damage: 100, fireRate: 0.7, magSize: 5, reloadTime: 0.85, dps: 70, headMultiplier: 1.5, emoji: "🔫" },
  { id: "pump_e", name: "ポンプショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "epic", rarityDisplay: "エピック", damage: 107, fireRate: 0.7, magSize: 5, reloadTime: 0.8, dps: 74, headMultiplier: 1.5, emoji: "🔫" },
  { id: "pump_l", name: "ポンプショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 112, fireRate: 0.7, magSize: 5, reloadTime: 0.75, dps: 78, headMultiplier: 1.5, emoji: "🔫" },
  { id: "tac_r", name: "タクティカルショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "rare", rarityDisplay: "レア", damage: 74, fireRate: 1.5, magSize: 8, reloadTime: 0.72, dps: 111, headMultiplier: 1.5, emoji: "🔫" },
  { id: "tac_e", name: "タクティカルショットガン", type: "shotgun", typeDisplay: "ショットガン", rarity: "epic", rarityDisplay: "エピック", damage: 78, fireRate: 1.5, magSize: 8, reloadTime: 0.69, dps: 117, headMultiplier: 1.5, emoji: "🔫" },

  // ─── スナイパー ───
  { id: "bolt_r", name: "ボルトアクション スナイパーライフル", type: "sniper", typeDisplay: "スナイパーライフル", rarity: "rare", rarityDisplay: "レア", damage: 116, fireRate: 0.33, magSize: 1, reloadTime: 1.9, dps: 38, headMultiplier: 2.5, emoji: "🎯" },
  { id: "bolt_e", name: "ボルトアクション スナイパーライフル", type: "sniper", typeDisplay: "スナイパーライフル", rarity: "epic", rarityDisplay: "エピック", damage: 121, fireRate: 0.33, magSize: 1, reloadTime: 1.8, dps: 39, headMultiplier: 2.5, emoji: "🎯" },
  { id: "bolt_l", name: "ボルトアクション スナイパーライフル", type: "sniper", typeDisplay: "スナイパーライフル", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 126, fireRate: 0.33, magSize: 1, reloadTime: 1.7, dps: 41, headMultiplier: 2.5, emoji: "🎯" },
  { id: "semi_e", name: "セミオート スナイパーライフル", type: "sniper", typeDisplay: "スナイパーライフル", rarity: "epic", rarityDisplay: "エピック", damage: 90, fireRate: 1.1, magSize: 10, reloadTime: 2.3, dps: 99, headMultiplier: 2.0, emoji: "🎯" },
  { id: "semi_l", name: "セミオート スナイパーライフル", type: "sniper", typeDisplay: "スナイパーライフル", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 94, fireRate: 1.1, magSize: 10, reloadTime: 2.2, dps: 103, headMultiplier: 2.0, emoji: "🎯" },

  // ─── ピストル ───
  { id: "hand_c", name: "ハンドキャノン", type: "pistol", typeDisplay: "ピストル", rarity: "common", rarityDisplay: "コモン", damage: 26, fireRate: 7.5, magSize: 16, reloadTime: 1.5, dps: 195, headMultiplier: 2.0, emoji: "🔫" },
  { id: "hand_uc", name: "ハンドキャノン", type: "pistol", typeDisplay: "ピストル", rarity: "uncommon", rarityDisplay: "アンコモン", damage: 28, fireRate: 7.5, magSize: 16, reloadTime: 1.4, dps: 210, headMultiplier: 2.0, emoji: "🔫" },
  { id: "deagle_e", name: "デザートイーグル", type: "pistol", typeDisplay: "ピストル", rarity: "epic", rarityDisplay: "エピック", damage: 42, fireRate: 3.5, magSize: 7, reloadTime: 1.5, dps: 147, headMultiplier: 2.0, emoji: "🔫" },
  { id: "deagle_l", name: "デザートイーグル", type: "pistol", typeDisplay: "ピストル", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 44, fireRate: 3.5, magSize: 7, reloadTime: 1.4, dps: 154, headMultiplier: 2.0, emoji: "🔫" },

  // ─── 爆発物 ───
  { id: "rocket_e", name: "ロケットランチャー", type: "explosive", typeDisplay: "爆発物", rarity: "epic", rarityDisplay: "エピック", damage: 121, fireRate: 0.75, magSize: 1, reloadTime: 2.52, dps: 90, headMultiplier: 1.0, emoji: "🚀" },
  { id: "rocket_l", name: "ロケットランチャー", type: "explosive", typeDisplay: "爆発物", rarity: "legendary", rarityDisplay: "レジェンダリー", damage: 127, fireRate: 0.75, magSize: 1, reloadTime: 2.42, dps: 95, headMultiplier: 1.0, emoji: "🚀" },
  { id: "grenade_e", name: "グレネードランチャー", type: "explosive", typeDisplay: "爆発物", rarity: "epic", rarityDisplay: "エピック", damage: 100, fireRate: 0.9, magSize: 6, reloadTime: 0.8, dps: 90, headMultiplier: 1.0, emoji: "💣" },
];

export const MOCK_PATCH_NOTES = [
  {
    version: "34.20",
    date: "2026-06-11",
    changes: [
      { category: "🔫 アサルトライフル", items: ["ダメージを 34 → 35 に増加（レア）", "リロード時間を 2.5秒 → 2.3秒 に短縮"] },
      { category: "🔫 ポンプショットガン", items: ["レジェンダリー ダメージを 110 → 112 に増加"] },
      { category: "🔫 SMG", items: ["コンパクトSMGのマガジンを 35 → 40 に増加", "コンパクトSMGのリコイルを微調整"] },
      { category: "🆕 新追加", items: ["ヘビーアサルトライフル（エピック・レジェンダリー）が追加"] },
      { category: "❌ 削除", items: ["シールドキャノンが削除"] },
    ],
  },
  {
    version: "34.10",
    date: "2026-05-21",
    changes: [
      { category: "🔫 ボルトアクション スナイパーライフル", items: ["ヘッドショット倍率を 2.0 → 2.5 に増加", "弾速を 5% 向上"] },
      { category: "🔫 ピストル", items: ["ハンドキャノンのDPSを 200 → 195 に減少（バランス調整）"] },
      { category: "🛡️ 回復アイテム", items: ["シールドポーションの回復量を 50 → 50 (変更なし)", "スラープジュースが新マップPOIでドロップ開始"] },
    ],
  },
  {
    version: "34.00 (新シーズン)",
    date: "2026-05-01",
    changes: [
      { category: "🆕 新追加", items: ["バーストアサルトライフルが復活", "コンパクトSMGが新追加", "デザートイーグルが復活"] },
      { category: "❌ 削除", items: ["コンバットショットガンが削除", "スナイパーライフル（セミオート コモン）が削除"] },
      { category: "🌍 マップ変更", items: ["マップが大幅リニューアル（新POI: アバランチ高地・クリスタル洞窟追加）", "旧POI「シャイニータワー」が削除"] },
    ],
  },
];
