const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const fs = require("fs");

async function main() {
  // Try env var first, fall back to local key file
  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } else {
    const keyFile = path.join(__dirname, "../ga4-key.json");
    if (!fs.existsSync(keyFile)) {
      console.error("ga4-key.json が見つかりません");
      process.exit(1);
    }
    credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  }

  const db = new Firestore({ projectId: "second-form-499516-a2", credentials });

  const snapshot = await db.collection("push_subscriptions").get();
  const count = snapshot.size;

  if (count === 0) {
    console.log("購読が0件です。何もしません。");
    return;
  }

  console.log(`${count}件の購読が見つかりました。削除します...`);
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`✅ ${count}件の購読を削除しました`);
}

main().catch((e) => { console.error(e); process.exit(1); });
