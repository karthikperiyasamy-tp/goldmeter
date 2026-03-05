import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import { getRecentRecaps } from "@/lib/recapDB";
import { createWeeklyPoll } from "@/lib/community/polls";

export async function GET(request: NextRequest) {
  try {
    console.log("🗳️ Weekly poll cron job started...");

    const authHeader = request.headers.get("authorization");
    if (process.env.NODE_ENV === "production") {
      const token = authHeader?.replace("Bearer ", "");
      if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
        console.log("❌ [Weekly Poll] Unauthorized access attempt");
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    } else {
      console.log("🔧 [Weekly Poll] Running in development mode (auth check skipped)");
    }

    const recaps = await getRecentRecaps(7);
    if (recaps.length === 0) {
      console.log("⚠️ No recaps found for the past week");
      return NextResponse.json({
        success: false,
        message: "No recaps available for poll generation",
      });
    }

    const summaries = recaps
      .map((r) => `${r.date}: ${r.title}\n${r.summary}`)
      .join("\n\n");

    const prompt = `You are helping create a weekly discussion poll for Indian gold investors on GoldMeter.in.

Based on these gold market summaries from the past week:

${summaries}

Generate ONE engaging discussion question for Indian gold investors with 3-4 poll options.

Rules:
- The question should be relevant to this week's gold news
- Options should represent different investor perspectives or actions
- Keep language simple, suitable for Indian retail gold investors
- Options should be short (under 8 words each)
- Do not include numbering in options

Return ONLY valid JSON (no markdown formatting):
{"question": "...", "options": ["...", "...", "...", "..."]}`;

    console.log("🤖 Generating weekly poll via Gemini...");
    const raw = await generateWithGemini(prompt);

    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const parsed = JSON.parse(cleaned) as { question: string; options: string[] };

    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length < 2) {
      throw new Error("Invalid poll format from Gemini");
    }

    const context = recaps
      .slice(0, 3)
      .map((r) => r.summary)
      .join(" | ");

    const poll = await createWeeklyPoll(parsed.question, parsed.options, context);

    console.log(`✅ Weekly poll created: "${poll.question}"`);
    return NextResponse.json({
      success: true,
      poll: { id: poll.id, question: poll.question, options: poll.options },
    });
  } catch (error) {
    console.error("❌ Weekly poll cron error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
