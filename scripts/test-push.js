require("dotenv").config({ path: ".env.local" });
const { Firestore } = require("@google-cloud/firestore");
const webpush = require("web-push");
const path = require("path");
const fs = require("fs");

async function main() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    const keyFile = path.join(__dirname, "../ga4-key.json");
    credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  }

  const db = new Firestore({ projectId: "second-form-499516-a2", credentials });
  const snapshot = await db.collection("push_subscriptions").get();

  console.log(`購読数: ${snapshot.size}件`);

  const payload = JSON.stringify({
    title: "🔔 テスト通知",
    body: "フォトナHubからのテスト送信です",
    url: "https://fortnite-hub-delta.vercel.app",
    icon: "/icon-192x192.png",
  });

  let sent = 0;
  let failed = 0;

  for (const doc of snapshot.docs) {
    const { subscription } = doc.data();
    try {
      await webpush.sendNotification(subscription, payload);
      console.log(`✅ 送信成功: ${(subscription.endpoint || "").slice(0, 50)}...`);
      sent++;
    } catch (e) {
      console.log(`❌ 送信失敗 (${e.statusCode}): ${(subscription.endpoint || "").slice(0, 50)}...`);
      console.log(`   エラー: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n結果: 成功${sent}件 / 失敗${failed}件`);
}

main().catch((e) => { console.error(e); process.exit(1); });
