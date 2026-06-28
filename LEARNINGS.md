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

---

### コスメティック個別ページ C-001（2026-06-22実装）
- 仮説: /cosmetics/[id] で各スキンに独自URLを与えるとロングテールSEO流入が期待できる
- 実施内容: fetchCosmeticById / 個別ページ / generateMetadata / JSON-LD / sitemap200件追加 / 検索カードリンク / ショップカードリンク
- 結果: 本番稼働中。Googleインデックス待ち（2〜4週間後に効果測定予定）
- 追加実装: 検索クエリURL同期（?q=...）でrouter.back()時に検索状態を復元
- 教訓: 個別ページSEOは実装は早いがインデックスに時間がかかる。Search Consoleで進捗を追うこと
- タグ: #SEO #新規ページ

### マップページの失敗（2026-06-22）
- 仮説: マップ表示・ドロップスポット機能でユーザー価値がある
- 実施内容: /map・MapClient・ズーム/パン・ドロップスポットピン（13POI）
- 問題1: DROP_DATAのキーが英語名だがAPIは日本語名を返すためピンが全件非表示（バグ）
- 問題2: しゅうやが「マップを追加する意味はある？」と問い直し → 競合（fortnite.gg等）に勝てる独自コンテンツがない
- 結論: ナビから削除・developに残存（宝箱座標等の独自データが取れたら再着手）
- 教訓: **独自データがない単なるAPI表示は競合に勝てない。「これがないと困る」という機能のみ作る**
- タグ: #判断ミス #競合分析

### Reddit告知は日本語サイトに向かない（2026-06-22）
- 試したこと: r/FortNiteBR に投稿 → 削除。r/FortniteJP は存在しない
- 根本原因: Reddit英語サブは自己宣伝に厳しい。日本人フォートナイトユーザーはRedditをほぼ使わない
- 結論: Reddit戦略は廃止。Discord・X・YouTube・クリエイターDMに集中する
- 教訓: **チャンネル選定は「ターゲットユーザーがそこにいるか」を先に確認する**
- タグ: #SNS #失敗

### スキン一覧ページの判断ミス（2026-06-22）
- 仮説: スキン一覧は検索需要があるから作るべき
- 実施内容: /skins・SkinsClient・/api/cosmetics/list を実装
- 結果: しゅうやに「本当に残すという判断は大事か？」と指摘 → 削除
- 根本原因: PROJECT.md「今必要ない機能は作らない」ルールを確認せずに実装した。競合が強い・ショップ内全スキン検索が既に同等機能として存在する点を事前に評価しなかった
- 教訓: **新規ページ実装前に必ずPROJECT.md・LEARNINGS.md・AI_TASKS.mdを再読し「競合」「既存機能との重複」「今必要か」を評価する。実装コストがあっても見切り発車で始めない**
- タグ: #判断ミス #PROJECT.md違反

### Server→Client ペイロード超過（2026-06-22）
- 問題: スキン一覧で5000件以上のコスメデータをServer Componentからpropsで渡した → ペイロード超過でページ表示不可
- 修正: /api/cosmetics/list APIルート新設（クライアント側でフェッチ・80件/ページ・type/q/pageフィルター）
- 教訓: **大量データ（目安: 1000件以上）はServer→Clientのprops転送禁止。必ずAPIルート経由でクライアント取得する**
- タグ: #Next.js #パフォーマンス

### 武器データ取得の限界（2026-06-22）
- 調査: fortnite-api.com の /v2/cosmetics/br?type=weapon は 404（武器データなし）
- 原因: fortnite-api.com は コスメ（スキン・エモート等）専門API。武器バランスデータは提供していない
- 結論: 無料での武器バランス（ダメージ・DPS・環境変動）自動取得は不可能
- 解決策: fortniteapi.io（月$5〜）で武器・大会・環境データが取得可能
- 教訓: **APIの対象データ範囲を先に調査してから実装方針を決める。fortnite-api.com = コスメ特化・fortniteapi.io = 総合（有料）**
- タグ: #API #調査

### マップAPI無料取得（2026-06-22）
- 調査: fortnite-api.com の `/v1/map?language=ja` で日本語マップ画像+全POI名+座標が無料で取得可能
- 取得データ: マップ画像URL（blank版/POI名入り版）・POI30件（名前・x/y/z座標）
- 教訓: **マップはfortnite-api.comで無料実装可能。武器データと同様に「まず無料APIで取得できるか確認する」フローを徹底する**
- タグ: #API #マップ

### ズーム・パンのライブラリ不要実装（2026-06-22）
- 実装: マウスホイール（カーソル位置中心ズーム）・ドラッグパン・タッチピンチズーム+スライドをuseRef+useEffectで手動実装
- PROJECT.md「ライブラリ追加は最小限」ルールに従い、react-zoom-pan-pinchを不採用
- 教訓: **ズーム/パンはwheel event + touchstart/move/end + transform: translateX scale() の組み合わせで十分。カーソル中心ズームは `mx - r*(mx - ox)` の公式を使う**
- タグ: #UX #手動実装

### 間違ったプレビューURL提供（2026-06-22・2回発生）
- 問題: デプロイ完了前の古いdeploymentのURLを提供してしまった（2回）
- 1回目: スキンページで fortnite-7mo6g9h8p（旧）→ 正しくは fortnite-f2rypwf1i
- 2回目: 武器ページで fortnite-h967pirel（旧）→ 正しくは fortnite-a16h7hhpu
- 原因: git pushからVercelデプロイ完了まで1〜2分のタイムラグがある。pushした直後にAPIを叩くと前回のdeploymentが返ってくる
- 教訓: **プレビューURLを提供する前に `vercel ls` でlatestのdeploymentのURLを確認する。git push直後は30秒以上待ってから確認する**
- タグ: #デプロイ #Vercel

---

---

## 2026-06-29

### Web Push TTL = 配信遅延の直接原因（2026-06-29 特定・修正）
- 問題: push通知が9:05 JSTに送信されているのに、しゅうやには約1時間遅れで届いていた
- 根本原因: `webpush.sendNotification()` の `TTL: 3600`（1時間）設定
  - デバイスがオフライン・スリープ中 → プッシュサービスが通知をキューに保持
  - TTL = 3600 なので最大1時間キューに残る → TTL切れ直前に配信 → 約10:05 JSTに届く
- 修正: `TTL: 3600 → 300`（5分）。5分以内に届かなければ通知はドロップ（古い情報なので届かない方がまし）
- あわせて: cronを `5 0 * * *`（JST 09:05）→ `10 0 * * *`（JST 09:10）に変更。ショップ更新直後のタイムラグを考慮
- 教訓: **Web Push で「届く時刻を制御したい」場合は TTL を短く設定する（ショップ通知なら300〜600秒）。TTLを長くすると「後から突然届く」体験が生まれる**
- タグ: #WebPush #Cron #TTL #バグ修正

### SEO施策まとめ — JSON-LD拡充（2026-06-29）
- 実施内容:
  - /devices: ItemList JSON-LD・title【2026年最新】・h2タグ化
  - /cosmetics/[id]: titleに「いつ出る？」・description改善（ショップ入荷状況・通知案内）・BreadcrumbList JSON-LD追加・画像フォールバック拡張
  - /competition: FAQPage JSON-LD追加（FNCSとは・キャッシュカップ・オープンリーグ）
  - sitemap.ts: devices/competitionのlastModifiedを2026-06-29に更新
  - app/page.tsx: デバイスバナーCTA強化（「勝率が上がる！」「Amazonで見る →」）
- 期待効果: リッチリザルト表示（FAQ・パンくず）→ CTR向上、タイトル改善→ Organic Search増加
- 計測: 2〜4週間後に Search Console で確認予定
- 教訓: **SEO施策はまとめてデプロイするより種類別に計測できるよう記録しておく。FAQリッチリザルトはSearch Consoleの「拡張機能」タブで確認できる**
- タグ: #SEO #JSON-LD #構造化データ

*最終更新: 2026-06-29 by AI CTO ジョブズ（セッション終了時更新）*
