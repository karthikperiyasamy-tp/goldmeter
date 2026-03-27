import { NextResponse } from "next/server";
import { getHistoricalGoldRates } from "@/lib/goldRatesDB";
import { computeAllIndicators, type PricePoint } from "@/lib/goldIndicators";

export const revalidate = 300;

export async function GET() {
  try {
    const history = await getHistoricalGoldRates("India", 365);

    if (!history || history.length === 0) {
      return NextResponse.json(
        { success: false, error: "No historical data available" },
        { status: 503 },
      );
    }

    const data: PricePoint[] = history.map((d) => ({
      date: d.date,
      price: d.gold24k / 10,
      timestamp: d.timestamp,
    }));

    const result = computeAllIndicators(data);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Could not compute indicators" },
        { status: 503 },
      );
    }

    const last30 = data.slice(-30);

    return NextResponse.json(
      {
        success: true,
        updated: new Date().toISOString(),
        ...result,
        history30d: last30,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    console.error("[gold-indicators] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
