"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import TopBar from "./TopBar";
import Footer from "./Footer";
import PriceTicker from "./PriceTicker";

// Map URL slugs to city display names
const SLUG_TO_CITY: Record<string, string> = {
  "": "India",
  "ahmedabad": "Ahmedabad",
  "ayodhya": "Ayodhya",
  "bangalore": "Bangalore",
  "bhubaneswar": "Bhubaneswar",
  "chandigarh": "Chandigarh",
  "chennai": "Chennai",
  "coimbatore": "Coimbatore",
  "delhi": "Delhi",
  "hyderabad": "Hyderabad",
  "jaipur": "Jaipur",
  "kerala": "Kerala",
  "kolkata": "Kolkata",
  "lucknow": "Lucknow",
  "madurai": "Madurai",
  "mangalore": "Mangalore",
  "mumbai": "Mumbai",
  "mysore": "Mysore",
  "nagpur": "Nagpur",
  "nashik": "Nashik",
  "patna": "Patna",
  "pune": "Pune",
  "rajkot": "Rajkot",
  "salem": "Salem",
  "surat": "Surat",
  "trichy": "Trichy",
  "vadodara": "Vadodara",
  "vijayawada": "Vijayawada",
  "visakhapatnam": "Visakhapatnam",
};

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Derive city from URL path
  const getCityFromPath = (path: string): string => {
    // Break path into segments to handle gold-rate, silver-rate, and legacy routes
    const segments = path.split("/").filter(Boolean);

    // Gold rate routes: /gold-rate/{city}
    if (segments[0] === "gold-rate") {
      const citySlug = segments[1] || "";
      return SLUG_TO_CITY[citySlug] || "India";
    }

    // Silver routes: /silver-rate/{city}
    if (segments[0] === "silver-rate") {
      const citySlug = segments[1] || "";
      return SLUG_TO_CITY[citySlug] || "India";
    }

    // Legacy routes or homepage: /{city} or /
    const citySlug = segments[0] || "";
    return SLUG_TO_CITY[citySlug] || "India";
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
      <PriceTicker />
      <TopBar city={activeCity} onCityChange={setActiveCity} />
      {children}
      <Footer />
    </>
  );
}

