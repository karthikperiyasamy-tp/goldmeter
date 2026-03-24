import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getDatabase } from "@/lib/mongodb";

const COLLECTION = "tool_feedback";
const MAX_COMMENT = 500;
const MAX_PER_HOUR = 20;
const ALLOWED_TOOLS = new Set(["purity-converter"]);

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0] || realIp || "unknown").trim();
}

function ipHash(ip: string): string {
  const salt = process.env.TOOL_FEEDBACK_SALT || "goldmeter-tool-feedback";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tool = typeof body.tool === "string" ? body.tool.trim() : "";
    const helpful = body.helpful === true || body.helpful === false ? body.helpful : null;
    const comment =
      typeof body.comment === "string" ? body.comment.slice(0, MAX_COMMENT).trim() : "";
    const locale = typeof body.locale === "string" ? body.locale.slice(0, 12) : "";
    const honeypot = typeof body.website === "string" ? body.website.trim() : "";

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!ALLOWED_TOOLS.has(tool) || helpful === null) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const ip = clientIp(request);
    const hashed = ipHash(ip);
    const since = new Date(Date.now() - 60 * 60 * 1000);

    const db = await getDatabase();
    const col = db.collection(COLLECTION);

    const recent = await col.countDocuments({
      ipHash: hashed,
      createdAt: { $gte: since },
    });

    if (recent >= MAX_PER_HOUR) {
      return NextResponse.json({ success: false, error: "Rate limit" }, { status: 429 });
    }

    await col.insertOne({
      tool,
      helpful,
      comment: comment || null,
      locale: locale || null,
      ipHash: hashed,
      createdAt: new Date(),
      userAgent: request.headers.get("user-agent")?.slice(0, 400) || null,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[tool-feedback]", e);
    return NextResponse.json({ success: true });
  }
}
