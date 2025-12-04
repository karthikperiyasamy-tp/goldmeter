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

  // Only run on homepage
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // Check for saved city preference cookie (faster than geo detection)
  const savedCity = request.cookies.get("preferredCity")?.value;
  if (savedCity && CITY_SLUGS.includes(savedCity)) {
    // Check if user specifically requested to stay on homepage
    if (!request.nextUrl.searchParams.has("noredirect")) {
      console.log(`🍪 [Middleware] Redirecting to preferred city from cookie: ${savedCity}`);
      const response = NextResponse.redirect(new URL(`/${savedCity}`, request.url));
      response.cookies.set("geo_redirect_checked", "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    } else {
      console.log(`🚫 [Middleware] User requested noredirect, ignoring preference: ${savedCity}`);
    }
  }

  // Skip if user has already been redirected (check cookie)
  // changed cookie name to break old stuck states
  const hasRedirectedCookie = request.cookies.get("geo_redirect_checked");
  if (hasRedirectedCookie) {
    console.log("⏭️ [Middleware] Skipping detection (already checked/redirected in this session)");
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
      const response = NextResponse.redirect(new URL(`/${detectedSlug}`, request.url));
      // Set cookies to remember the city and prevent re-detection
      response.cookies.set("preferredCity", detectedSlug, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      response.cookies.set("geo_redirect_checked", "true", {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    } else {
      console.log(`🌍 [Middleware] Detected ${detectedSlug} but country is ${vercelCountry} (not IN), skipping redirect`);
    }
  } else {
    console.log("⚠️ [Middleware] No supported city detected from Vercel headers");
  }

  // No city detected or not in India - allow homepage to load normally
  // We do NOT set the geo_redirect_checked cookie here, so that we retry detection on the next visit.
  // This helps if the user moves location or if headers were temporarily missing.
  const response = NextResponse.next();
  // If we are allowing the request to proceed without a city, 
  // the client-side fallback in HomeClient will attempt detection if needed.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match only the homepage
     * Exclude API routes, static files, and _next paths
     */
    "/",
  ],
};

