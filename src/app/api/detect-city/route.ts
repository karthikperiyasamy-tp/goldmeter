import { NextRequest, NextResponse } from "next/server";

// Map of cities we support
const SUPPORTED_CITIES = [
  { name: "Chennai", slug: "chennai", aliases: ["madras"] },
  { name: "Mumbai", slug: "mumbai", aliases: ["bombay"] },
  { name: "Bangalore", slug: "bangalore", aliases: ["bengaluru"] },
  { name: "Delhi", slug: "delhi", aliases: ["new delhi"] },
  { name: "Hyderabad", slug: "hyderabad", aliases: [] },
  { name: "Coimbatore", slug: "coimbatore", aliases: [] },
  { name: "Pune", slug: "pune", aliases: [] },
  { name: "Kolkata", slug: "kolkata", aliases: ["calcutta"] },
  { name: "Ahmedabad", slug: "ahmedabad", aliases: [] },
  { name: "Vijayawada", slug: "vijayawada", aliases: [] },
];


export async function GET(request: NextRequest) {
  try {
    console.log("🌍 [Detect-City] API called");
    
    // Get user's IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || "unknown";
    
    console.log(`📍 [Detect-City] IP detected: ${ip}`);

    // Use ipapi.co for IP geolocation
    let detectedCity: string | null = null;
    let detectedCountry: string | null = null;

    if (ip !== "unknown" && ip !== "127.0.0.1" && !ip.startsWith("::")) {
      try {
        console.log(`🌐 [Detect-City] Fetching geolocation data from ipapi.co...`);
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            "User-Agent": "GoldRate-App/1.0",
          },
        });

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData) {
            detectedCity = geoData.city?.toLowerCase() ?? null;
            detectedCountry = geoData.country_code ?? null;
            
            console.log(`🗺️  [Detect-City] Geolocation data:`, {
              city: detectedCity,
              country: detectedCountry,
              region: geoData.region,
            });
          }
        }
      } catch (geoError) {
        console.error("❌ [Detect-City] Geolocation API error:", geoError);
      }
    }

    // Match detected city to our supported cities
    if (detectedCity) {
      const matchedCity = SUPPORTED_CITIES.find(
        (city) =>
          city.name.toLowerCase() === detectedCity ||
          city.aliases.some(alias => alias.toLowerCase() === detectedCity)
      );

      if (matchedCity) {
        const matchResponse = {
          success: true,
          detected: true,
          city: matchedCity.name,
          slug: matchedCity.slug,
          country: detectedCountry,
          ip,
          message: `Detected city: ${matchedCity.name}`,
        };
        console.log(`✅ [Detect-City] Matched city: ${matchedCity.name} (${matchedCity.slug})`);
        console.log(`📤 [Detect-City] Response:`, JSON.stringify(matchResponse, null, 2));
        return NextResponse.json(matchResponse);
      } else {
        // City detected but not in our list
        const noMatchResponse = {
          success: true,
          detected: false,
          city: null,
          slug: null,
          country: detectedCountry,
          message: `Detected ${detectedCity} but not in supported cities list`,
        };
        console.log(`⚠️  [Detect-City] City "${detectedCity}" not in supported list`);
        console.log(`📤 [Detect-City] Response:`, JSON.stringify(noMatchResponse, null, 2));
        return NextResponse.json(noMatchResponse);
      }
    }

    // Default to stay on India page if detection fails or not in India
    const fallbackResponse = {
      success: true,
      detected: false,
      city: null,
      slug: null,
      country: detectedCountry || "unknown",
      message: "Could not detect city, staying on India homepage",
    };
    console.log(`ℹ️  [Detect-City] Using fallback: Stay on India page`);
    console.log(`📤 [Detect-City] Response:`, JSON.stringify(fallbackResponse, null, 2));
    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error("❌ [Detect-City] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        city: null,
        slug: null,
      },
      { status: 500 }
    );
  }
}

