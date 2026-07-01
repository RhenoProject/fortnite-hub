const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const fs = require("fs");

async function main() {
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

  console.log(`\n購読件数: ${snapshot.size}件`);
  snapshot.docs.forEach((doc, i) => {
    const data = doc.data();
    const sub = data.subscription || {};
    const endpoint = (sub.endpoint || "").slice(0, 60);
    const wishlist = data.wishlist || [];
    console.log(`[${i + 1}] endpoint: ${endpoint}...`);
    console.log(`     wishlist: ${wishlist.length}件`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
