import { NextRequest, NextResponse } from "next/server";
import { trackServerAnalyticsEvents } from "@/lib/server-analytics";

type SingleEvent = {
  eventName?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

type TrackEventBody = SingleEvent & {
  // Batched payload: the client buffers events for a page and flushes them in one
  // request to collapse ~8-10 function invocations per page view into a single call.
  events?: SingleEvent[];
};

const MAX_EVENTS_PER_BATCH = 50;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackEventBody;

    const rawEvents = Array.isArray(body.events) && body.events.length
      ? body.events
      : [{ eventName: body.eventName, path: body.path, metadata: body.metadata }];

    const events = rawEvents
      .slice(0, MAX_EVENTS_PER_BATCH)
      .map((e) => ({
        eventName: (e.eventName || "").trim(),
        path: (e.path || "").trim(),
        metadata: e.metadata,
      }))
      .filter((e) => e.eventName && e.path);

    if (events.length === 0) {
      return NextResponse.json(
        { success: false, error: "eventName and path are required" },
        { status: 400 }
      );
    }

    await trackServerAnalyticsEvents(request, events);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Track Event API] Error:", error);
    // Always return success to avoid affecting UX.
    return NextResponse.json({ success: true });
  }
}

