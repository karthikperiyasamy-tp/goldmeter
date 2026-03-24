import { NextRequest, NextResponse } from "next/server";
import { trackServerAnalyticsEvent } from "@/lib/server-analytics";

const ALLOWED_EVENTS = new Set([
  "purity_converter_rates_loaded",
  "purity_converter_mode_changed",
  "purity_converter_copy_clicked",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventName = typeof body.eventName === "string" ? body.eventName : "";
    const path = typeof body.path === "string" ? body.path : "/purity-converter";
    const metadata =
      body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
        ? (body.metadata as Record<string, unknown>)
        : undefined;

    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json({ success: false, error: "Invalid event" }, { status: 400 });
    }

    await trackServerAnalyticsEvent(request, eventName, path, metadata);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
