# LEARNINGS.md

> 施策の成功・失敗・想定外の結果を記録する。同じ失敗を繰り返さないために使う。

---

## ルール

- 施策完了後、必ずここに結果を記録する
- 仮説と実際の結果を並べて書く
- 「なぜそうなったか」の根本原因を書く
- 次回への教訓を具体的に書く

---

## フォーマット

```
### [施策名]
- 日付: YYYY-MM-DD
- 仮説: 〜すれば〜になるはず
- 実施内容: 何をしたか
- 結果: 数値で示す（PV・ユーザー・CTR等）
- 根本原因: なぜその結果になったか
- 教訓: 次回に活かすこと
- タグ: #SEO #SNS #UX #収益化 etc
```

---

## 2026-06

### ブラウザプッシュ通知 + ほしいものリスト（2026-06-16実装）
- 仮説: ほしいスキンが出たら通知することでリピート率が上がる
- 実施内容: Web Push (VAPID) + Firestore で購読者管理。毎日9:05 JST自動送信
- 結果: 実装完了。購読者数計測中（初期段階）
- 教訓: 通知インフラは早期に入れるべき。購読者が増えるほど価値が上がる

### Discord自動投稿（2026-06-17実装）
- 仮説: X API無料枠では投稿不可なため、Discord経由でしゅうやが手動コピペ投稿する運用で代替
- 実施内容: 毎朝9:00 JSTにDiscordへ今日のショップ情報を自動送信
- 結果: Organic Social が 8→22セッション（1週間で2.75倍）
- 教訓: 自動化できない部分でも「仕組み作り」でCEOの負担を最小化できる。X APIの無料枠制限は早期に判明させること

### Discord daily-post バグ（2026-06-18修正）
- 仮説: POSTで送ればCronが動く
- 実施内容: Vercel CronはGETリクエストを送ることが判明→GETに修正
- 結果: 修正後正常動作
- 教訓: Vercel Cron はデフォルトで GET を送る。次回Cron実装時はGET対応を最初から設計する

### Amazonアフィリエイト画像のホットリンク問題（2026-06-19解決）
- 仮説: `m.media-amazon.com/images/P/ASIN.09._SL1500_.jpg` のCDN URLをimgタグで直接表示できる
- 実施内容: ブラウザからCDN URLへの直接アクセス → Amazon側でホットリンクブロック
- 結果: 白画像・表示不可
- 根本原因: Amazonは第三者ドメインからのCDN直接参照をブロックしている（Refererチェック）
- 解決策: Next.js APIルート（/api/amazon-img）をサーバーサイドプロキシとして実装。サーバーからAmazon商品ページのhiRes/og:image URLを取得→バイト転送
- 教訓: Amazon画像はブラウザ側では取得不可。必ずサーバーサイドプロキシ経由で配信する。Cache-Control 1週間設定で重複リクエストも回避できる

### デバイスページ本番公開（2026-06-19）
- 実施内容: 8カテゴリ51商品・Amazonアソシエイトタグ yoshidashuya0-22・DeviceImageコンポーネント・価格安い順ソートをmainマージ
- 結果: 本番稼働中（https://fortnite-hub-delta.vercel.app/devices）
- 教訓: 商品数が多い場合は最初にASIN中心のデータ構造を設計し、画像取得を分離コンポーネントに委ねる設計が保守しやすい

### 技術SEO強化（2026-06-16実装）
- 仮説: JSON-LD構造化データ・サイトマップ強化でGoogle検索流入が増える
- 実施内容: JSON-LD WebSite/ItemList・/updates sitemap追加・各ページmeta強化
- 結果: 計測中（Search Consoleでインデックス登録待ち）
- 教訓: SEO効果は2〜4週間後に出る。焦らず継続計測が必要

---

### Vercel Cron は GET を送る（2026-06-19・再確認）
- 仮説: POSTで実装すればCronが動く
- 実施内容: push/send と x/post-shop を POST のみで実装していた
- 結果: 毎日 9:05・9:15 に 405 で静かに失敗。通知も X投稿も届いていなかった
- 根本原因: Vercel Cron Job は GET リクエストを送る仕様。Discord daily-post で同じバグを修正済みだったが push/send と x/post-shop に同じ修正を適用し忘れた
- 教訓: **Vercel Cron 対応ルートは必ず `GET` と `POST` 両方をエクスポートする**。新規 Cron ルート作成時は Discord のパターン（handleRequest共通化）をテンプレとして使うこと。タグ: #Vercel #Cron #バグ

### AI_CTO.md フレームワーク導入（2026-06-19）
- 仮説: 意思決定フレームワーク・学習記録・ロードマップを整備することでCTOの判断精度と継続性が上がる
- 実施内容: AI_CTO.md / PROJECT_VISION.md / ROADMAP.md / AI_TASKS.md / LEARNINGS.md / DAILY_REPORT.md を新規作成
- 結果: Required Reading 体制が確立。次回以降のセッションは毎回これらを参照してから作業開始
- 教訓: 仕組みの整備は初回に時間がかかっても長期で見ると大きく回収できる。早期整備が正解

### 自立作業モード設定（2026-06-19）
- 仮説: defaultMode:auto + 許可リストにより Level1-2 作業でしゅうやへの確認が不要になり、作業速度が上がる
- 実施内容: .claude/settings.json 作成（defaultMode:auto・Edit/Write/Bash等を許可）
- 結果: 次回セッションから自動実行可能。Level3-5（DB変更・インフラ・課金）は引き続きCEO確認が必要
- 教訓: 権限設定はスコープを明確にすることが重要。「自動実行できるもの」と「要承認のもの」をAI_CTO.md Level定義で整合させた

---

### 日付表示をUTC基準に統一（2026-06-21）
- 問題: JST基準の日付計算だと深夜0〜8時59分に「翌日の日付なのにショップは前日のまま」の矛盾が発生
- 根本原因: フォートナイトのショップリセットは UTC 0:00（= JST 9:00）。JST基準だと9時間ずれが生じる
- 修正: 全ファイルの日付計算を UTC 基準に統一（`new Date().toISOString().slice(0, 10)`）
- 教訓: **フォートナイトのデータは常にUTC基準で扱う**。JST表示が必要な場面でも、計算はUTCで行ってから表示形式を変換する

### Vercel Cron EXPIRY_DATE の境界バグ（2026-06-21）
- 問題: `if (jstDateStr > EXPIRY_DATE)` だと当日（equal）でも止まらない
- 例: EXPIRY_DATE = "2026-06-21"、当日 = "2026-06-21" → `"2026-06-21" > "2026-06-21"` = false → 当日も発動
- 修正: `>=` に変更
- 教訓: **期限チェックには必ず `>=` を使う**。`>` は「翌日から停止」になる

### Firestoreプッシュ購読の蓄積問題（2026-06-21）
- 問題: しゅうやのPCに34通の通知が一斉に届いた
- 根本原因: 開発・テスト中に複数ブラウザ/シークレットウィンドウで通知許可 → Firestoreに34件蓄積。Cronが全件に送信 → 34通同時配信
- 仕組み: 購読は `docId = base64(endpoint)` でFirestoreに保存。同じブラウザなら同一docだが、異なるブラウザ・プロファイルは別doc
- 解決: `scripts/clear-push-subscriptions.js` でga4-key.jsonを使い直接削除（34件全削除完了）
- 教訓: **開発中にプッシュ通知テストをしたら、セッション後に必ずFirestoreの購読を清掃する**。清掃コマンド: `node scripts/clear-push-subscriptions.js`

### Vercel 環境変数（Encrypted）はCLIで取得不可（2026-06-21）
- 問題: `vercel env pull` で CRON_SECRET / GOOGLE_SERVICE_ACCOUNT_KEY / VAPID_PRIVATE_KEY が空（""）で返ってくる
- 根本原因: Vercelの「Encrypted」マークが付いた変数はpull時に復号されない仕様
- 解決策: `npx vercel env run` でコマンドに環境変数を注入して実行する（ただしこれもEncrypted変数は注入されないことがある）
- 代替: Firestore操作は `ga4-key.json`（ローカルファイル）を使う `scripts/clear-push-subscriptions.js` で直接実行可能
- 教訓: Encrypted変数はVercel Dashboardから直接確認する必要がある。ローカルスクリプトにはga4-key.jsonで代替できる

---

*最終更新: 2026-06-21 by AI CTO ジョブズ（セッション終了時更新）*
