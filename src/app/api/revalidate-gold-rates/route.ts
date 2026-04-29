import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const runtime = "edge";

const ALLOWED_TAGS = new Set([
  "gold-rates",
  "news",
  "international-gold-rates",
  "trending-articles",
]);

type RevalidateBody = {
  tag?: string;
  tags?: string[];
};

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ||
    new URL(request.url).searchParams.get("secret");

  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const requested = [
    ...(body.tag ? [body.tag] : []),
    ...(Array.isArray(body.tags) ? body.tags : []),
  ];

  const fallback = new URL(request.url).searchParams.get("tag");
  if (fallback) requested.push(fallback);

  const tags = (requested.length ? requested : ["gold-rates"]).filter((t) =>
    ALLOWED_TAGS.has(t)
  );

  if (tags.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no allowed tags supplied", allowed: [...ALLOWED_TAGS] },
      { status: 400 }
    );
  }

  for (const t of tags) revalidateTag(t, "max");

  return NextResponse.json({ ok: true, revalidated: tags, at: Date.now() });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
