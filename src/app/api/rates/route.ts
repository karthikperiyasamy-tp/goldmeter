import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    date: "2025-11-20",
    gold_24k: 6450,
    gold_22k: 5920,
    city: "India",
  });
}

