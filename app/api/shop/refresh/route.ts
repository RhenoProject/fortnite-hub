import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const CRON_SECRET = process.env.CRON_SECRET;

async function handler(req: NextRequest) {
  if (CRON_SECRET && req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

export const GET = handler;
export const POST = handler;
