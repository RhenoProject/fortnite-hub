const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");

const PROPERTY_ID = "541671619";
const KEY_FILE = path.join(__dirname, "../ga4-key.json");

const client = new BetaAnalyticsDataClient({ keyFilename: KEY_FILE });

async function fetchStats(startDate, endDate, label) {
  const [res] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
    ],
  });
  const row = res.rows?.[0]?.metricValues ?? [];
  return {
    label,
    users: row[0]?.value ?? "0",
    pageviews: row[1]?.value ?? "0",
    sessions: row[2]?.value ?? "0",
  };
}

async function fetchTopPages(startDate, endDate) {
  const [res] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 5,
  });
  return (res.rows ?? []).map((r) => ({
    page: r.dimensionValues[0].value,
    views: r.metricValues[0].value,
  }));
}

async function fetchTrafficSources(startDate, endDate) {
  const [res] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  return (res.rows ?? []).map((r) => ({
    channel: r.dimensionValues[0].value,
    sessions: r.metricValues[0].value,
  }));
}

async function main() {
  console.log("=== フォトナHub アクセス解析 ===\n");

  const today = "today";
  const yesterday = "yesterday";
  const week = "7daysAgo";

  const [todayStats, weekStats, topPages, sources] = await Promise.all([
    fetchStats(today, today, "今日"),
    fetchStats(week, "today", "直近7日"),
    fetchTopPages(week, "today"),
    fetchTrafficSources(week, "today"),
  ]);

  for (const s of [todayStats, weekStats]) {
    console.log(`【${s.label}】`);
    console.log(`  ユーザー数: ${s.users}`);
    console.log(`  ページビュー: ${s.pageviews}`);
    console.log(`  セッション: ${s.sessions}`);
    console.log();
  }

  console.log("【直近7日 人気ページ TOP5】");
  for (const p of topPages) {
    console.log(`  ${p.page.padEnd(20)} ${p.views} PV`);
  }
  console.log();

  console.log("【直近7日 流入経路】");
  for (const s of sources) {
    console.log(`  ${s.channel.padEnd(25)} ${s.sessions} セッション`);
  }
  console.log();
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});
