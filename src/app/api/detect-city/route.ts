import { NextRequest, NextResponse } from "next/server";

// Supported cities with their coordinates
const SUPPORTED_CITIES = [
  { name: "Chennai", slug: "chennai", lat: 13.0827, lon: 80.2707, aliases: ["madras"] },
  { name: "Mumbai", slug: "mumbai", lat: 19.0760, lon: 72.8777, aliases: ["bombay"] },
  { name: "Bangalore", slug: "bangalore", lat: 12.9716, lon: 77.5946, aliases: ["bengaluru"] },
  { name: "Delhi", slug: "delhi", lat: 28.6139, lon: 77.2090, aliases: ["new delhi"] },
  { name: "Hyderabad", slug: "hyderabad", lat: 17.3850, lon: 78.4867, aliases: [] },
  { name: "Coimbatore", slug: "coimbatore", lat: 11.0168, lon: 76.9558, aliases: [] },
  { name: "Pune", slug: "pune", lat: 18.5204, lon: 73.8567, aliases: [] },
  { name: "Kolkata", slug: "kolkata", lat: 22.5726, lon: 88.3639, aliases: ["calcutta"] },
  { name: "Ahmedabad", slug: "ahmedabad", lat: 23.0225, lon: 72.5714, aliases: [] },
  { name: "Vijayawada", slug: "vijayawada", lat: 16.5062, lon: 80.6480, aliases: [] },
  // New cities added
  { name: "Ayodhya", slug: "ayodhya", lat: 26.7922, lon: 82.1998, aliases: ["faizabad"] },
  { name: "Bhubaneswar", slug: "bhubaneswar", lat: 20.2961, lon: 85.8245, aliases: [] },
  { name: "Chandigarh", slug: "chandigarh", lat: 30.7333, lon: 76.7794, aliases: [] },
  { name: "Jaipur", slug: "jaipur", lat: 26.9124, lon: 75.7873, aliases: [] },
  { name: "Kerala", slug: "kerala", lat: 9.9312, lon: 76.2673, aliases: ["kochi", "cochin", "trivandrum", "thiruvananthapuram", "thrissur"] },
  { name: "Lucknow", slug: "lucknow", lat: 26.8467, lon: 80.9462, aliases: [] },
  { name: "Madurai", slug: "madurai", lat: 9.9252, lon: 78.1198, aliases: [] },
  { name: "Mangalore", slug: "mangalore", lat: 12.9141, lon: 74.8560, aliases: ["mangaluru"] },
  { name: "Mysore", slug: "mysore", lat: 12.2958, lon: 76.6394, aliases: ["mysuru"] },
  { name: "Nagpur", slug: "nagpur", lat: 21.1458, lon: 79.0882, aliases: [] },
  { name: "Nashik", slug: "nashik", lat: 19.9975, lon: 73.7898, aliases: ["nasik"] },
  { name: "Patna", slug: "patna", lat: 25.5941, lon: 85.1376, aliases: [] },
  { name: "Rajkot", slug: "rajkot", lat: 22.3039, lon: 70.8022, aliases: [] },
  { name: "Salem", slug: "salem", lat: 11.6643, lon: 78.1460, aliases: [] },
  { name: "Surat", slug: "surat", lat: 21.1702, lon: 72.8311, aliases: [] },
  { name: "Trichy", slug: "trichy", lat: 10.7905, lon: 78.7047, aliases: ["tiruchirappalli", "tiruchi"] },
  { name: "Vadodara", slug: "vadodara", lat: 22.3072, lon: 73.1812, aliases: ["baroda"] },
  { name: "Visakhapatnam", slug: "visakhapatnam", lat: 17.6868, lon: 83.2185, aliases: ["vizag", "vishakhapatnam"] },
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Find nearest supported city based on coordinates
function findNearestCity(lat: number, lon: number): { city: typeof SUPPORTED_CITIES[0]; distance: number } {
  let nearest = SUPPORTED_CITIES[0];
  let minDistance = calculateDistance(lat, lon, nearest.lat, nearest.lon);

  for (const city of SUPPORTED_CITIES) {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return { city: nearest, distance: Math.round(minDistance) };
}

export async function GET(request: NextRequest) {
  try {
    console.log("🌍 [Detect-City] API called");
    
    // Get user's IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || "unknown";
    
    console.log(`📍 [Detect-City] IP detected: ${ip}`);

    let detectedCity: string | null = null;
    let detectedCountry: string | null = null;
    let latitude: number | null = null;
    let longitude: number | null = null;

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
          if (geoData && !geoData.error) {
            detectedCity = geoData.city?.toLowerCase() ?? null;
            detectedCountry = geoData.country_code ?? null;
            latitude = geoData.latitude ?? null;
            longitude = geoData.longitude ?? null;
            
            console.log(`🗺️  [Detect-City] Geolocation data:`, {
              city: detectedCity,
              country: detectedCountry,
              region: geoData.region,
              lat: latitude,
              lon: longitude,
            });
          }
        }
      } catch (geoError) {
        console.error("❌ [Detect-City] Geolocation API error:", geoError);
      }
    }

    // Step 1: Try exact city match (by name or alias)
    if (detectedCity) {
      const exactMatch = SUPPORTED_CITIES.find(
        (city) =>
          city.name.toLowerCase() === detectedCity ||
          city.aliases.some(alias => alias.toLowerCase() === detectedCity)
      );

      if (exactMatch) {
        console.log(`✅ [Detect-City] Exact match: ${exactMatch.name}`);
        return NextResponse.json({
          success: true,
          detected: true,
          city: exactMatch.name,
          slug: exactMatch.slug,
          country: detectedCountry,
          matchType: "exact",
          message: `Detected city: ${exactMatch.name}`,
        });
      }
    }

    // Step 2: Use coordinates to find nearest city
    if (latitude !== null && longitude !== null) {
      const { city: nearestCity, distance } = findNearestCity(latitude, longitude);
      
      // Only use nearest city if within 300km (reasonable for India)
      if (distance <= 300) {
        console.log(`✅ [Detect-City] Nearest city: ${nearestCity.name} (${distance}km away)`);
        return NextResponse.json({
          success: true,
          detected: true,
          city: nearestCity.name,
          slug: nearestCity.slug,
          country: detectedCountry,
          matchType: "nearest",
          detectedLocation: detectedCity,
          distance: `${distance}km`,
          message: `Detected ${detectedCity || 'your location'}, showing nearest city: ${nearestCity.name} (${distance}km)`,
        });
      } else {
        console.log(`⚠️  [Detect-City] Nearest city ${nearestCity.name} is ${distance}km away (too far)`);
      }
    }

    // Step 3: No match - stay on India page
    const fallbackResponse = {
      success: true,
      detected: false,
      city: null,
      slug: null,
      country: detectedCountry || "unknown",
      detectedLocation: detectedCity,
      message: detectedCity 
        ? `Detected ${detectedCity} but no nearby supported city found`
        : "Could not detect city, staying on India homepage",
    };
    console.log(`ℹ️  [Detect-City] Using fallback: Stay on India page`);
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
