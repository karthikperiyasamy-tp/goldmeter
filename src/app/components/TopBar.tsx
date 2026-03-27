"use client";

import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const router = useRouter();
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/^\/(hi|ta|te)(\/|$)/, "/");
  const currentLocale = rawPathname.match(/^\/(hi|ta|te)(?:\/|$)/)?.[1] ?? "en";
  const localePrefix = currentLocale === "en" ? "" : `/${currentLocale}`;
  const t = useTranslations("nav");

  const withLocalePath = (path: string) => {
    if (!localePrefix) return path;
    if (path === "/") return localePrefix;
    if (path.startsWith("/?")) return `${localePrefix}${path.slice(1)}`;
    return `${localePrefix}${path}`;
  };
  
  // List of city pages for highlighting "Gold Rate Today"
  const cityPages = ["ahmedabad", "ayodhya", "bangalore", "bhubaneswar", "chandigarh", "chennai", "coimbatore", "delhi", "hyderabad", "jaipur", "kerala", "kolkata", "lucknow", "madurai", "mangalore", "moodbidri", "mumbai", "mysore", "nagpur", "nashik", "patna", "pune", "rajkot", "salem", "surat", "trichy", "vadodara", "vijayawada", "visakhapatnam"];
  const isGoldRatePage = pathname === "/" || pathname.startsWith("/gold-rate") || cityPages.some(city => pathname === `/${city}`);
  const isSilverRoute = pathname.startsWith("/silver-rate");
  const citySlug = city.toLowerCase();
  const silverHref = city === "India" ? "/silver-rate" : `/silver-rate/${citySlug}`;
  const primaryNavItems = [
    { label: t("goldRateToday"), href: "/gold-rate-today" },
    { label: t("silverRate"), href: silverHref },
    { label: t("calculator"), href: "/calculator" },
    { label: t("portfolio"), href: "/portfolio" },
    { label: t("articles"), href: "/articles" },
    { label: t("news"), href: "/news" },
    { label: "Games", href: "/games" },
  ];

  // Filter cities based on search query
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredCities = trimmedQuery
    ? cityOptions.filter((c) => c.name.toLowerCase().includes(trimmedQuery))
    : cityOptions.slice(0, 10);

  const handleCitySelect = (citySlug: string, cityName: string) => {
    onCityChange(cityName);
    
    if (citySlug === "") {
      // India selected: stay in current context (gold vs silver)
      if (isSilverRoute) {
        router.push(withLocalePath("/silver-rate"));
      } else {
        router.push(withLocalePath("/?noredirect=true"));
      }
    } else {
      // City selected: clear stayOnIndia cookie so geo-redirect can work on future visits
      document.cookie = "stayOnIndia=; path=/; max-age=0";
      // Route within the current context - use /gold-rate/{city} for gold pages
      const targetPath = isSilverRoute ? `/silver-rate/${citySlug}` : `/gold-rate/${citySlug}`;
      router.push(withLocalePath(targetPath));
    }
    
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchModalOpen(false);
  };

  const moreDropdownItems = [
    { label: t("jewellersDirectory"), href: "/jewellers", match: () => pathname.startsWith("/jewellers") },
    { label: t("compareGoldRates"), href: "/gold-comparison", match: () => pathname === "/gold-comparison" },
    { label: t("community"), href: "/community", match: () => pathname.startsWith("/community") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <button 
          onClick={() => {
            onCityChange("India");
            router.push(withLocalePath("/?noredirect=true"));
          }}
          className="flex min-w-0 shrink-0 cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt="GoldMeter Logo"
            title="GoldMeter - India's Gold Price Today"
            width={56}
            height={56}
            className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
            priority
          />
          <div className="min-w-0 text-left" aria-hidden="true">
            <div className="text-sm sm:text-base md:text-lg font-semibold text-charcoal truncate">GoldMeter</div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 truncate">{t("goldPriceToday")}</p>
          </div>
        </button>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex xl:gap-6">
          {/* Market Pulse — highlighted pill */}
          <Link
            href="/gold-market-pulse"
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              pathname === "/gold-market-pulse"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
            }`}
          >
            <span className="text-sm leading-none">📊</span>
            {t("marketPulse")}
          </Link>

          {primaryNavItems.map((item) => {
            const isActive = item.href === "/gold-rate-today"
              ? isGoldRatePage
              : item.href === silverHref
                ? isSilverRoute
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap transition-all ${
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
                moreMenuOpen || moreDropdownItems.some((d) => d.match())
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-amber-600 hover:bg-slate-50"
              }`}
              aria-label={t("moreOptions")}
              aria-expanded={moreMenuOpen}
            >
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-lg z-50 divide-y divide-slate-100">
                {moreDropdownItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      i === 0 ? "rounded-t-xl" : ""
                    } ${i === moreDropdownItems.length - 1 ? "rounded-b-xl" : ""} ${
                      item.match()
                        ? "text-amber-600 bg-amber-50"
                        : "text-slate-700 hover:bg-amber-50 hover:text-amber-600"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setMoreMenuOpen(false);
                      router.push(withLocalePath(item.href));
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-amber-300 hover:text-amber-600 md:inline-flex"
            onClick={() => {
              setSearchModalOpen(true);
              setShowSearchResults(true);
            }}
            aria-label={t("searchCity")}
            aria-expanded={searchModalOpen}
          >
            <span className="text-sm">⌕</span>
          </button>
          <select
            value={city}
            onChange={(event) => {
              const selectedCity = cityOptions.find(c => c.name === event.target.value);
              if (selectedCity) {
                handleCitySelect(selectedCity.slug, selectedCity.name);
              }
            }}
            className="h-9 rounded-full border border-slate-200 bg-white pl-2 pr-6 text-xs font-medium leading-none text-slate-700 shadow-sm transition-colors hover:border-amber-300 sm:h-10 sm:max-w-none sm:pl-4 sm:pr-8 sm:text-sm appearance-none cursor-pointer max-w-[100px]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.25rem center", backgroundSize: "1rem" }}
            aria-label={t("selectCity")}
          >
            {cityOptions.map((option) => (
              <option key={option.slug} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <LanguageSwitcher />
          <button 
            className="rounded-full border border-slate-200 p-1.5 sm:p-2 text-base sm:text-lg lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t("toggleMenu")}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Tablet/Laptop Search Modal */}
      {searchModalOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="relative">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
                <span className="text-slate-400">⌕</span>
                <input
                  className="w-full bg-transparent text-sm text-charcoal outline-none"
                  placeholder={t("searchCityPlaceholder")}
                  aria-label={t("searchCity")}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredCities[0]) {
                      e.preventDefault();
                      handleCitySelect(filteredCities[0].slug, filteredCities[0].name);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setSearchModalOpen(false);
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                  className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close city search"
                >
                  ✕
                </button>
              </div>

              {showSearchResults && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((cityOption) => (
                      <button
                        key={cityOption.slug}
                        onClick={() => handleCitySelect(cityOption.slug, cityOption.name)}
                        className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-amber-50 hover:text-amber-700"
                      >
                        {cityOption.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500">No city found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-4">
            <div className="space-y-1">
              {/* Market Pulse — highlighted at top */}
              <Link
                href="/gold-market-pulse"
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  pathname === "/gold-market-pulse"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>📊</span> {t("marketPulse")}
              </Link>

              {[
                ...primaryNavItems,
                ...moreDropdownItems.map((d) => ({ label: d.label, href: d.href })),
              ].map((item) => {
                const isActive = item.href === "/gold-rate-today"
                  ? isGoldRatePage
                  : item.href === silverHref
                    ? isSilverRoute
                    : item.href === "/jewellers"
                      ? pathname.startsWith("/jewellers")
                      : pathname === item.href;

                return (
                  <Link
                    key={item.href}
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

