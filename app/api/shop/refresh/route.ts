import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const CRON_SECRET = process.env.CRON_SECRET;

function shopDateStr(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function handler(req: NextRequest) {
  if (CRON_SECRET && req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ホームページ＋今日の日別ページ＋昨日の日別ページを同時にキャッシュクリア
  revalidatePath("/");
  revalidatePath(`/shop/${shopDateStr(0)}`);
  revalidatePath(`/shop/${shopDateStr(-1)}`);
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

export const GET = handler;
export const POST = handler;
