import { NextRequest, NextResponse } from "next/server";

// Supported cities with their coordinates for nearest-city matching
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
  { name: "Moodbidri", slug: "moodbidri", lat: 13.0686, lon: 74.9988, aliases: ["moodabidri"] },
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

const CITY_SLUGS = SUPPORTED_CITIES.map((c) => c.slug);

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest supported city based on coordinates
function findNearestCity(lat: number, lon: number): { slug: string; distance: number } | null {
  let nearest = SUPPORTED_CITIES[0];
  let minDistance = calculateDistance(lat, lon, nearest.lat, nearest.lon);

  for (const city of SUPPORTED_CITIES) {
    const distance = calculateDistance(lat, lon, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  // Only return if within 300km
  if (minDistance <= 300) {
    return { slug: nearest.slug, distance: Math.round(minDistance) };
  }
  return null;
}

// Find city by name (exact or alias match)
function findCityByName(cityName: string): string | null {
  const lowerCity = cityName.toLowerCase();
  const match = SUPPORTED_CITIES.find(
    (city) =>
      city.name.toLowerCase() === lowerCity ||
      city.aliases.some((alias) => alias.toLowerCase() === lowerCity)
  );
  return match?.slug ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // CRITICAL: Force www → non-www redirect for SEO consistency
  // This ensures Google indexes only the non-www version (https://goldmeter.in)
  if (host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const newUrl = new URL(request.url);
    newUrl.host = newHost;
    console.log(`🔄 [Middleware] Redirecting www → non-www: ${host} → ${newHost}`);
    return NextResponse.redirect(newUrl, 301); // 301 = permanent redirect
  }

  // SEO MIGRATION: 301 redirect from old /{city} URLs to new /gold-rate/{city} URLs
  // This transfers SEO equity and tells Google the content has permanently moved
  const pathWithoutSlash = pathname.slice(1); // Remove leading slash
  if (CITY_SLUGS.includes(pathWithoutSlash)) {
    const newUrl = new URL(`/gold-rate/${pathWithoutSlash}`, request.url);
    console.log(`🔄 [Middleware] SEO redirect: /${pathWithoutSlash} → /gold-rate/${pathWithoutSlash}`);
    return NextResponse.redirect(newUrl, 301);
  }
  
  // Skip geo-redirect for search engine bots so homepage returns 200.
  // This ensures Google sees the homepage, not city-specific redirected content.
  // Includes: Googlebot, Bingbot, Google's Rich Results Test, Lighthouse, etc.
  const ua = request.headers.get("user-agent") || "";
  const isBot = /bot|crawl|spider|slurp|bingpreview|lighthouse|pagespeed|google|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(ua);
  if (isBot) {
    return NextResponse.next();
  }

  // Only run geo-redirect on homepage
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // Check if user specifically requested to stay on homepage (e.g. "Back to India" button or logo click)
  // This can come from either:
  // 1. ?noredirect query param (initial click)
  // 2. stayOnIndia cookie (persists preference)
  const stayOnIndiaCookie = request.cookies.get("stayOnIndia");
  
  if (request.nextUrl.searchParams.has("noredirect")) {
    console.log("🚫 [Middleware] User requested noredirect via param, setting session cookie and staying on India page");
    // Use NextResponse.next() instead of redirect to avoid race condition
    // The cookie is set and the homepage loads immediately without another redirect
    const response = NextResponse.next();
    response.cookies.set("stayOnIndia", "true", { 
      path: "/", 
      sameSite: "lax",
      // No maxAge = session cookie - expires when browser closes
      // This ensures geo-redirect works again on next browser session
    });
    return response;
  }
  
  if (stayOnIndiaCookie?.value === "true") {
    console.log("🚫 [Middleware] User has stayOnIndia cookie, staying on India page");
    return NextResponse.next();
  }

  // Use Vercel's built-in geo headers (instant, no API call!)
  // These are provided automatically by Vercel Edge Network
  const vercelCity = request.headers.get("x-vercel-ip-city");
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  const vercelLatitude = request.headers.get("x-vercel-ip-latitude");
  const vercelLongitude = request.headers.get("x-vercel-ip-longitude");

  let detectedSlug: string | null = null;

  // Step 1: Try exact city match from Vercel's city header
  if (vercelCity) {
    const decodedCity = decodeURIComponent(vercelCity);
    console.log(`🌍 [Middleware] Vercel detected city header: ${decodedCity}`);
    detectedSlug = findCityByName(decodedCity);
  }

  // Step 2: If no exact match, try nearest city from coordinates
  if (!detectedSlug && vercelLatitude && vercelLongitude) {
    const lat = parseFloat(vercelLatitude);
    const lon = parseFloat(vercelLongitude);
    console.log(`📍 [Middleware] Vercel detected coords: ${lat}, ${lon}`);
    if (!isNaN(lat) && !isNaN(lon)) {
      const nearest = findNearestCity(lat, lon);
      if (nearest) {
        console.log(`📏 [Middleware] Nearest supported city: ${nearest.slug} (${nearest.distance}km)`);
        detectedSlug = nearest.slug;
      }
    }
  }

  // Step 3: Only redirect for Indian users (or if country is not detected)
  // This prevents redirecting non-Indian users to city-specific pages
  if (detectedSlug) {
    // Only redirect if in India or country unknown
    if (!vercelCountry || vercelCountry === "IN") {
      console.log(`✅ [Middleware] Redirecting to detected city: ${detectedSlug}`);
      return NextResponse.redirect(new URL(`/gold-rate/${detectedSlug}`, request.url));
    } else {
      console.log(`🌍 [Middleware] Detected ${detectedSlug} but country is ${vercelCountry} (not IN), skipping redirect`);
    }
  } else {
    console.log("⚠️ [Middleware] No supported city detected from Vercel headers");
  }

  // No city detected or not in India - allow homepage to load normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths for www redirect, and homepage for geo-redirect
     * Excludes static files, images, and Next.js internals
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

