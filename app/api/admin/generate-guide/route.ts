import { NextRequest, NextResponse } from "next/server";
import { runGenerateGuide } from "@/lib/generateGuide";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  return !!(secret && auth === `Bearer ${secret}`);
}

async function handleRequest(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "patch-notes";

  const result = await runGenerateGuide(slug);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ success: true, slug: result.slug, title: result.title });
}

export const GET = handleRequest;
export const POST = handleRequest;
