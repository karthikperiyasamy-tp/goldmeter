"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import Footer from "./Footer";

// Map URL slugs to city display names
const SLUG_TO_CITY: Record<string, string> = {
  "": "India",
  "chennai": "Chennai",
  "bangalore": "Bangalore",
  "mumbai": "Mumbai",
  "delhi": "Delhi",
  "hyderabad": "Hyderabad",
  "coimbatore": "Coimbatore",
  "pune": "Pune",
  "kolkata": "Kolkata",
  "ahmedabad": "Ahmedabad",
  "vijayawada": "Vijayawada",
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Derive city from URL path
  const getCityFromPath = (path: string): string => {
    // Break path into segments to handle both gold (/city) and silver (/silver-rate/city)
    const segments = path.split("/").filter(Boolean);

    // Silver routes store city in the second segment
    if (segments[0] === "silver-rate") {
      const silverCitySlug = segments[1] || "";
      return SLUG_TO_CITY[silverCitySlug] || "India";
    }

    // Gold routes keep city in the first segment
    const goldCitySlug = segments[0] || "";
    return SLUG_TO_CITY[goldCitySlug] || "India";
  };

  const [activeCity, setActiveCity] = useState(() => getCityFromPath(pathname));

  // Sync city state with URL changes (e.g., back/forward navigation, redirects)
  useEffect(() => {
    const cityFromPath = getCityFromPath(pathname);
    if (cityFromPath !== activeCity) {
      setActiveCity(cityFromPath);
    }
  }, [pathname, activeCity]);

  return (
    <>
      <TopBar city={activeCity} onCityChange={setActiveCity} />
      {children}
      <Footer />
    </>
  );
}

