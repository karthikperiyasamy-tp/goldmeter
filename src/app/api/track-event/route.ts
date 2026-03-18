import { NextRequest, NextResponse } from "next/server";
import { trackServerAnalyticsEvent } from "@/lib/server-analytics";

type TrackEventBody = {
  eventName?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackEventBody;
    const eventName = (body.eventName || "").trim();
    const path = (body.path || "").trim();

    if (!eventName || !path) {
      return NextResponse.json(
        { success: false, error: "eventName and path are required" },
        { status: 400 }
      );
    }

    await trackServerAnalyticsEvent(request, eventName, path, body.metadata);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Track Event API] Error:", error);
    // Always return success to avoid affecting UX.
    return NextResponse.json({ success: true });
  }
}

