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

// Test IPs for development - real IPs from different Indian cities
const TEST_IPS = {
  chennai: "14.142.130.50",      // Chennai, Tamil Nadu
  mumbai: "103.21.124.25",       // Mumbai, Maharashtra
  bangalore: "49.206.32.10",     // Bangalore, Karnataka
  delhi: "122.160.5.20",         // Delhi
  hyderabad: "157.33.24.15",     // Hyderabad, Telangana
  coimbatore: "103.25.232.8",    // Coimbatore, Tamil Nadu
  pune: "103.251.43.10",         // Pune, Maharashtra
  kolkata: "103.106.237.5",      // Kolkata, West Bengal
  ahmedabad: "103.230.104.15",   // Ahmedabad, Gujarat
  vijayawada: "117.247.108.20",  // Vijayawada, Andhra Pradesh
};

// Mock geolocation data for test IPs (used in development to bypass external API)
const MOCK_GEO_DATA: Record<string, { city: string; country: string; region: string }> = {
  "14.142.130.50": { city: "Chennai", country: "IN", region: "Tamil Nadu" },
  "103.21.124.25": { city: "Mumbai", country: "IN", region: "Maharashtra" },
  "49.206.32.10": { city: "Bangalore", country: "IN", region: "Karnataka" },
  "122.160.5.20": { city: "Delhi", country: "IN", region: "Delhi" },
  "157.33.24.15": { city: "Hyderabad", country: "IN", region: "Telangana" },
  "103.25.232.8": { city: "Coimbatore", country: "IN", region: "Tamil Nadu" },
  "103.251.43.10": { city: "Pune", country: "IN", region: "Maharashtra" },
  "103.106.237.5": { city: "Kolkata", country: "IN", region: "West Bengal" },
  "103.230.104.15": { city: "Ahmedabad", country: "IN", region: "Gujarat" },
  "117.247.108.20": { city: "Vijayawada", country: "IN", region: "Andhra Pradesh" },
};

// Get a random test IP for local development
function getRandomTestIP(): string {
  const cities = Object.keys(TEST_IPS) as Array<keyof typeof TEST_IPS>;
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const testIp = TEST_IPS[randomCity];
  console.log(`🎲 [Detect-City] Randomly selected test city: ${randomCity} (IP: ${testIp})`);
  return testIp;
}

// Get mock geolocation data for test IPs (development mode only)
function getMockGeoData(ip: string) {
  return MOCK_GEO_DATA[ip] || null;
}

export async function GET(request: NextRequest) {
  try {
    console.log("🌍 [Detect-City] API called");
    
    // Get user's IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    let ip = forwarded?.split(",")[0] || realIp || "unknown";
    
    const isDevelopment = process.env.NODE_ENV === "development";
    const isLocalhost = ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("::");
    
    // Development mode: Auto-use random test IP for localhost
    if (isDevelopment && isLocalhost) {
      // Check if auto-random IPs are disabled
      const noAutoIP = request.nextUrl.searchParams.get("noAutoIP") === "true" || 
                       process.env.DISABLE_AUTO_TEST_IP === "true";
      
      if (noAutoIP) {
        console.log(`⏸️  [Detect-City] Auto test IP disabled, using localhost IP`);
      } else {
        // Check for manual test IP override via query param or env variable
        const manualTestIp = request.nextUrl.searchParams.get("testIp") || process.env.TEST_IP;
        
        if (manualTestIp) {
          console.log(`🧪 [Detect-City] Using manual test IP: ${manualTestIp}`);
          ip = manualTestIp;
        } else {
          // Automatically use a random test IP
          ip = getRandomTestIP();
          console.log(`🏠 [Detect-City] Localhost detected, using random test IP: ${ip}`);
        }
      }
    } else {
      console.log(`📍 [Detect-City] IP detected: ${ip}`);
    }

    // Use ipapi.co for free IP geolocation OR mock data in development
    let detectedCity = null;
    let detectedCountry = null;
    let geoData = null;

    if (ip !== "unknown" && ip !== "127.0.0.1" && !ip.startsWith("::")) {
      // In development mode, use mock data for test IPs to avoid external API calls
      if (isDevelopment && MOCK_GEO_DATA[ip]) {
        console.log(`🧪 [Detect-City] Using MOCK geolocation data (dev mode)`);
        geoData = getMockGeoData(ip);
        if (geoData) {
          detectedCity = geoData.city.toLowerCase();
          detectedCountry = geoData.country;
          console.log(`🗺️  [Detect-City] Mock geolocation data:`, {
            city: detectedCity,
            country: detectedCountry,
            region: geoData.region,
          });
        }
      } else {
        // Production mode or custom IP: use real geolocation API
        try {
          console.log(`🌐 [Detect-City] Fetching real geolocation data from ipapi.co...`);
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: {
              "User-Agent": "GoldRate-App/1.0",
            },
          });

          if (geoResponse.ok) {
            geoData = await geoResponse.json();
            detectedCity = geoData.city?.toLowerCase();
            detectedCountry = geoData.country_code;
            
            console.log(`🗺️  [Detect-City] Geolocation data:`, {
              city: detectedCity,
              country: detectedCountry,
              region: geoData.region,
            });
          }
        } catch (geoError) {
          console.error("❌ [Detect-City] Geolocation API error:", geoError);
          console.log("💡 [Detect-City] Tip: In development, we use mock data for test IPs to avoid SSL issues");
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

