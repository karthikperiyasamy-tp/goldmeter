"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

type TopBarProps = {
  city: string;
  onCityChange: (city: string) => void;
};

const cityOptions = [
  { name: "India", slug: "" }, // Homepage
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Ayodhya", slug: "ayodhya" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Bhubaneswar", slug: "bhubaneswar" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Chennai", slug: "chennai" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Delhi", slug: "delhi" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Jaipur", slug: "jaipur" },
  { name: "Kerala", slug: "kerala" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Lucknow", slug: "lucknow" },
  { name: "Madurai", slug: "madurai" },
  { name: "Mangalore", slug: "mangalore" },
  { name: "Moodbidri", slug: "moodbidri" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Mysore", slug: "mysore" },
  { name: "Nagpur", slug: "nagpur" },
  { name: "Nashik", slug: "nashik" },
  { name: "Patna", slug: "patna" },
  { name: "Pune", slug: "pune" },
  { name: "Rajkot", slug: "rajkot" },
  { name: "Salem", slug: "salem" },
  { name: "Surat", slug: "surat" },
  { name: "Trichy", slug: "trichy" },
  { name: "Vadodara", slug: "vadodara" },
  { name: "Vijayawada", slug: "vijayawada" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
];

export default function TopBar({ city, onCityChange }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // List of city pages for highlighting "Gold Rate Today"
  const cityPages = ["ahmedabad", "ayodhya", "bangalore", "bhubaneswar", "chandigarh", "chennai", "coimbatore", "delhi", "hyderabad", "jaipur", "kerala", "kolkata", "lucknow", "madurai", "mangalore", "moodbidri", "mumbai", "mysore", "nagpur", "nashik", "patna", "pune", "rajkot", "salem", "surat", "trichy", "vadodara", "vijayawada", "visakhapatnam"];
  const isGoldRatePage = pathname === "/" || pathname.startsWith("/gold-rate") || cityPages.some(city => pathname === `/${city}`);
  const isSilverRoute = pathname.startsWith("/silver-rate");
  const citySlug = city.toLowerCase();
  const goldHref = city === "India" ? "/" : `/gold-rate/${citySlug}`;
  const silverHref = city === "India" ? "/silver-rate" : `/silver-rate/${citySlug}`;

  // Filter cities based on search query
  const filteredCities = searchQuery
    ? cityOptions.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCitySelect = (citySlug: string, cityName: string) => {
    onCityChange(cityName);
    
    if (citySlug === "") {
      // India selected: stay in current context (gold vs silver)
      if (isSilverRoute) {
        router.push("/silver-rate");
      } else {
        router.push("/?noredirect=true");
      }
    } else {
      // City selected: clear stayOnIndia cookie so geo-redirect can work on future visits
      document.cookie = "stayOnIndia=; path=/; max-age=0";
      // Route within the current context - use /gold-rate/{city} for gold pages
      const targetPath = isSilverRoute ? `/silver-rate/${citySlug}` : `/gold-rate/${citySlug}`;
      router.push(targetPath);
    }
    
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-4">
        <button 
          onClick={() => {
            onCityChange("India");
            // Navigate to homepage with noredirect param to bypass geo-redirect
            router.push("/?noredirect=true");
          }}
          className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity shrink-0 min-w-0 cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="GoldMeter Logo"
            title="GoldMeter - India's Gold Price Today"
            width={56}
            height={56}
            className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain shrink-0"
            priority
          />
          <div className="min-w-0 text-left" aria-hidden="true">
            <div className="text-sm sm:text-base md:text-lg font-semibold text-charcoal truncate">GoldMeter</div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 truncate">Gold Price Today</p>
          </div>
        </button>

        <div className="relative hidden flex-1 md:block">
          <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <span className="text-slate-400">⌕</span>
            <input
              className="w-full bg-transparent text-sm text-charcoal outline-none"
              placeholder="Search city (e.g., Chennai, Mumbai)"
              aria-label="Search city"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && filteredCities.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
              {filteredCities.map((cityOption) => (
                <button
                  key={cityOption.slug}
                  onClick={() => handleCitySelect(cityOption.slug, cityOption.name)}
                  className="block w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {cityOption.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
          {[
            { label: "Gold Rate Today", href: goldHref },
            { label: "Silver Rate", href: silverHref },
            { label: "Calculator", href: "/calculator" },
            { label: "Articles", href: "/articles" },
            { label: "Portfolio", href: "/portfolio" },
            { label: "News", href: "/news" },
          ].map((item) => {
            const isActive = item.label === "Gold Rate Today" 
              ? isGoldRatePage 
              : item.label === "Silver Rate"
                ? isSilverRoute
                : pathname === item.href;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors ${
                  isActive 
                    ? "text-amber-600 font-semibold" 
                    : "hover:text-amber-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          {/* More Menu (3-dot vertical) */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              onBlur={() => setTimeout(() => setMoreMenuOpen(false), 150)}
              className={`flex flex-col items-center justify-center gap-[3px] p-2 rounded-lg transition-colors ${
                moreMenuOpen || pathname.startsWith("/jewellers")
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-amber-600 hover:bg-slate-50"
              }`}
              aria-label="More options"
              aria-expanded={moreMenuOpen}
            >
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
            </button>
            
            {/* Dropdown Menu */}
            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white shadow-lg z-50 divide-y divide-slate-100">
                <Link
                  href="/jewellers"
                  className={`block px-4 py-3 text-sm font-medium rounded-t-xl transition-colors ${
                    pathname.startsWith("/jewellers")
                      ? "text-amber-600 bg-amber-50"
                      : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setMoreMenuOpen(false);
                    router.push("/jewellers");
                  }}
                >
                  Jewellers Directory
                </Link>
                <Link
                  href="/gold-comparison"
                  className={`block px-4 py-3 text-sm font-medium rounded-b-xl transition-colors ${
                    pathname === "/gold-comparison"
                      ? "text-amber-600 bg-amber-50"
                      : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setMoreMenuOpen(false);
                    router.push("/gold-comparison");
                  }}
                >
                  Compare Gold Rates
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <select
            value={city}
            onChange={(event) => {
              const selectedCity = cityOptions.find(c => c.name === event.target.value);
              if (selectedCity) {
                handleCitySelect(selectedCity.slug, selectedCity.name);
              }
            }}
            className="rounded-full border border-slate-200 bg-white pl-2 pr-6 sm:pl-4 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm appearance-none cursor-pointer hover:border-amber-300 transition-colors max-w-[100px] sm:max-w-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.25rem center", backgroundSize: "1rem" }}
            aria-label="Select city"
          >
            {cityOptions.map((option) => (
              <option key={option.slug} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <button 
            className="rounded-full border border-slate-200 p-1.5 sm:p-2 text-base sm:text-lg lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <div className="space-y-1">
              {[
                { label: "Gold Rate Today", href: goldHref },
                { label: "Silver Rate", href: silverHref },
                { label: "Calculator", href: "/calculator" },
                { label: "Articles", href: "/articles" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "News", href: "/news" },
                { label: "Jewellers", href: "/jewellers" },
                { label: "Compare Gold Rates", href: "/gold-comparison" },
              ].map((item) => {
                const isActive = item.label === "Gold Rate Today" 
                  ? isGoldRatePage 
                  : item.label === "Silver Rate"
                    ? isSilverRoute
                    : item.label === "Jewellers"
                      ? pathname.startsWith("/jewellers")
                      : item.label === "Compare Gold Rates"
                        ? pathname === "/gold-comparison"
                        : pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-50 text-amber-600 font-semibold"
                        : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

