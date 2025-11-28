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
  { name: "Chennai", slug: "chennai" },
  { name: "Bangalore", slug: "bangalore" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Delhi", slug: "delhi" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Pune", slug: "pune" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Vijayawada", slug: "vijayawada" },
];

const navLinks = [
  { label: "Gold Rate Today", href: "/" },
  { label: "Calculator", href: "/calculator" },
  { label: "News", href: "/news" },
];

export default function TopBar({ city, onCityChange }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // List of city pages for highlighting "Gold Rate Today"
  const cityPages = ["chennai", "bangalore", "mumbai", "delhi", "hyderabad", "coimbatore", "pune", "kolkata", "ahmedabad", "vijayawada"];
  const isGoldRatePage = pathname === "/" || cityPages.some(city => pathname === `/${city}`);

  // Filter cities based on search query
  const filteredCities = searchQuery
    ? cityOptions.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleCitySelect = (citySlug: string, cityName: string) => {
    onCityChange(cityName);
    // If India is selected, go to homepage, otherwise go to city page
    router.push(citySlug === "" ? "/" : `/${citySlug}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.png"
            alt="GoldMeter Logo"
            width={56}
            height={56}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
            priority
          />
          <div>
            <div className="text-base sm:text-lg font-semibold text-charcoal">GoldMeter</div>
            <p className="text-[10px] sm:text-xs text-slate-500">Live 22K · 24K prices</p>
          </div>
        </Link>

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

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex">
          {navLinks.map((item) => {
            const isActive = item.label === "Gold Rate Today" 
              ? isGoldRatePage 
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
          <div className="group relative">
            <button className="text-slate-600 transition-colors hover:text-amber-600">
              More ▾
            </button>
            <div className="invisible absolute right-0 top-full mt-2 w-40 rounded-xl border bg-white p-3 text-sm text-slate-500 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
              <Link href="/news" className="block py-1 hover:text-amber-600">
                Charts & News
              </Link>
              <Link href="/calculator" className="block py-1 hover:text-amber-600">
                Tools
              </Link>
              <Link href="/" className="block py-1 hover:text-amber-600">
                Alerts
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <select
            value={city}
            onChange={(event) => {
              const selectedCity = cityOptions.find(c => c.name === event.target.value);
              if (selectedCity) {
                handleCitySelect(selectedCity.slug, selectedCity.name);
              }
            }}
            className="rounded-full border border-slate-200 bg-white pl-4 pr-8 py-2 text-sm font-medium text-slate-700 shadow-sm appearance-none cursor-pointer hover:border-amber-300 transition-colors"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "1.25rem" }}
            aria-label="Select city"
          >
            {cityOptions.map((option) => (
              <option key={option.slug} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <button className="hidden rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-soft md:inline-block">
            Install App
          </button>
          <button className="rounded-full border border-slate-200 p-2 text-lg">
            🔔
          </button>
          <button 
            className="rounded-full border border-slate-200 p-2 text-lg md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg md:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <div className="space-y-3">
              {navLinks.map((item) => {
                const isActive = item.label === "Gold Rate Today" 
                  ? isGoldRatePage 
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
              <div className="border-t border-slate-100 pt-3">
                <Link 
                  href="/calculator" 
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tools
                </Link>
                <Link 
                  href="/" 
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alerts
                </Link>
              </div>
              <div className="pt-2">
                <button className="w-full rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-soft">
                  Install App
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

