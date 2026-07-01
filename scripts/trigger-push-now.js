require("dotenv").config({ path: ".env.local" });
const https = require("https");

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("CRON_SECRET が取得できませんでした");
  process.exit(1);
}

const options = {
  hostname: "fortnite-hub-delta.vercel.app",
  path: "/api/push/send",
  method: "GET",
  headers: { Authorization: `Bearer ${secret}` },
};

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    console.log(`ステータス: ${res.statusCode}`);
    console.log(`結果: ${data}`);
  });
});

req.on("error", (e) => { console.error(e); });
req.end();
