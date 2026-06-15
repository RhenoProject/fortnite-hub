import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    const db = getDb();
    const id = Buffer.from(subscription.endpoint).toString("base64").slice(0, 64);
    await db.collection("push_subscriptions").doc(id).set({
      subscription,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const db = getDb();
    const id = Buffer.from(endpoint).toString("base64").slice(0, 64);
    await db.collection("push_subscriptions").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
