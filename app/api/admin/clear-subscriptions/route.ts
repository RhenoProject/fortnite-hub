import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";

const ADMIN_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {
  if (!ADMIN_SECRET || req.headers.get("authorization") !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const snapshot = await db.collection("push_subscriptions").get();
  const count = snapshot.size;

  await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));

  return NextResponse.json({ deleted: count, message: `${count}件の購読を削除しました` });
}

export async function GET(req: NextRequest) {
  if (!ADMIN_SECRET || req.headers.get("authorization") !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const snapshot = await db.collection("push_subscriptions").get();

  return NextResponse.json({
    count: snapshot.size,
    docs: snapshot.docs.map((doc) => ({
      id: doc.id,
      hasWishlist: Array.isArray(doc.data().wishlist) && doc.data().wishlist.length > 0,
    })),
  });
}
