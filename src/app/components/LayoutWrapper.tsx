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
    // Extract the first segment of the path (e.g., "/hyderabad" -> "hyderabad")
    const slug = path.split("/")[1] || "";
    return SLUG_TO_CITY[slug] || "India";
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

