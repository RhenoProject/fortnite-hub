import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";

function docId(endpoint: string) {
  return Buffer.from(endpoint).toString("base64").slice(0, 64);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wishlist, ...subscription } = body;
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    const db = getDb();
    await db.collection("push_subscriptions").doc(docId(subscription.endpoint)).set({
      subscription,
      wishlist: wishlist ?? [],
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { endpoint, wishlist } = await req.json();
    if (!endpoint || !Array.isArray(wishlist)) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }
    const db = getDb();
    await db.collection("push_subscriptions").doc(docId(endpoint)).update({ wishlist });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const db = getDb();
    await db.collection("push_subscriptions").doc(docId(endpoint)).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
