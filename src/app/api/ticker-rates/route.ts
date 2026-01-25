import { NextResponse } from "next/server";
import { getLatestGoldRates } from "@/lib/goldRatesDB";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const dbData = await getLatestGoldRates();
    
    if (!dbData?.india) {
      return NextResponse.json({
        success: false,
        error: "No data available",
      });
    }

    // Calculate price changes
    let gold24kChange = 0;
    let gold22kChange = 0;
    let silver1kgChange = 0;

    if (dbData.yesterdayIndia) {
      gold24kChange = dbData.india.gold24k - dbData.yesterdayIndia.gold24k;
      gold22kChange = dbData.india.gold22k - dbData.yesterdayIndia.gold22k;
      silver1kgChange = (dbData.india.silver1kg || 0) - (dbData.yesterdayIndia.silver1kg || 0);
    }

    return NextResponse.json({
      success: true,
      data: {
        gold24k: dbData.india.gold24k,
        gold22k: dbData.india.gold22k,
        gold18k: Math.round((dbData.india.gold24k * 18) / 24),
        silver1kg: dbData.india.silver1kg || 0,
        gold24kChange,
        gold22kChange,
        silver1kgChange,
        updated: dbData.india.date,
      },
    }, {
      headers: {
        // Cache for 5 minutes at edge, serve stale for 10 more minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Ticker rates error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch rates",
    });
  }
}

