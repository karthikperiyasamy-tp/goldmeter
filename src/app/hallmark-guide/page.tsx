"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  BIS_REGISTERED_JEWELLERS,
  searchJewellers,
  getUniqueCities,
  getUniqueStates,
  type BISJeweller,
} from "@/lib/bisJewellers";

// Purity codes and their meanings
const PURITY_CODES = [
  { code: "999", karat: "24K", purity: 99.9, description: "Pure gold (investment grade)", common: "Coins, bars" },
  { code: "958", karat: "23K", purity: 95.8, description: "High purity gold", common: "Rare jewellery" },
  { code: "916", karat: "22K", purity: 91.6, description: "Standard jewellery gold", common: "Necklaces, bangles, chains" },
  { code: "875", karat: "21K", purity: 87.5, description: "Popular in Middle East", common: "Imported jewellery" },
  { code: "750", karat: "18K", purity: 75.0, description: "Durable for daily wear", common: "Rings, earrings, diamond jewellery" },
  { code: "625", karat: "15K", purity: 62.5, description: "Antique jewellery", common: "Vintage pieces" },
  { code: "585", karat: "14K", purity: 58.5, description: "Popular in Western markets", common: "Imported jewellery" },
  { code: "417", karat: "10K", purity: 41.7, description: "Minimum gold content", common: "Budget jewellery" },
  { code: "375", karat: "9K", purity: 37.5, description: "Low gold content", common: "UK imports" },
];

// Red flags for fake hallmarks
const RED_FLAGS = [
  {
    title: "Missing HUID",
    description: "Since April 2023, all hallmarked gold MUST have a 6-digit HUID. No HUID = Not legally hallmarked.",
    severity: "critical",
  },
  {
    title: "Blurry or Unclear Markings",
    description: "Genuine BIS hallmarks are laser-engraved and crisp. Blurry, smudged, or hand-stamped marks indicate fraud.",
    severity: "critical",
  },
  {
    title: "Missing BIS Logo",
    description: "The triangular BIS logo must be present. If only purity number is stamped, it's not BIS certified.",
    severity: "high",
  },
  {
    title: "Inconsistent Purity Claims",
    description: "If seller claims 22K but stamp shows 750 (18K), they're lying. Always match verbal claims with stamps.",
    severity: "high",
  },
  {
    title: "No Bill or GST Invoice",
    description: "Legitimate jewellers provide GST invoices with HUID mentioned. No bill = No legal protection.",
    severity: "high",
  },
  {
    title: "Price Too Good to Be True",
    description: "If 22K gold is being sold significantly below market rate, the purity is likely lower than claimed.",
    severity: "medium",
  },
  {
    title: "Reluctance to Show Hallmark",
    description: "If the jeweller discourages you from checking the hallmark or HUID, walk away immediately.",
    severity: "critical",
  },
  {
    title: "Old Stock Without HUID",
    description: "Jewellers may claim 'old stock' to sell non-HUID items. This is illegal since April 2023.",
    severity: "high",
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function HallmarkGuidePage() {
  // State for Purity Decoder
  const [purityInput, setPurityInput] = useState("");
  const [goldRate22k, setGoldRate22k] = useState(59200); // Default rate per 10g
  
  // State for Jeweller Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [searchResults, setSearchResults] = useState<BISJeweller[]>([]);
  
  // Fetch current gold rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch('/api/calculator-rates');
        const data = await res.json();
        if (data.success && data.rates?.[0]?.gold22k) {
          setGoldRate22k(data.rates[0].gold22k);
        }
      } catch (e) {
        console.error('Failed to fetch gold rate');
      }
    }
    fetchRate();
  }, []);

  // Decode purity
  const decodedPurity = useMemo(() => {
    const normalizedInput = purityInput.trim().toUpperCase();
    
    // Check for karat format (e.g., "22K", "24K")
    const karatMatch = normalizedInput.match(/^(\d{1,2})K?$/);
    if (karatMatch) {
      const karat = parseInt(karatMatch[1]);
      const purityPercent = (karat / 24) * 100;
      const code = Math.round(purityPercent * 10).toString();
      const found = PURITY_CODES.find(p => p.karat === `${karat}K`);
      if (found) return found;
      if (karat >= 9 && karat <= 24) {
        return {
          code,
          karat: `${karat}K`,
          purity: parseFloat(purityPercent.toFixed(1)),
          description: `${karat} karat gold`,
          common: "Various jewellery",
        };
      }
    }
    
    // Check for numeric code (e.g., "916", "750")
    const found = PURITY_CODES.find(
      p => p.code === normalizedInput || p.code === normalizedInput.replace(/[^0-9]/g, '')
    );
    return found || null;
  }, [purityInput]);

  // Calculate price based on purity
  const priceEstimate = useMemo(() => {
    if (!decodedPurity) return null;
    const rate24kPer10g = goldRate22k / 0.916; // Estimate 24K from 22K
    const pricePerGram = (rate24kPer10g / 10) * (decodedPurity.purity / 100);
    return {
      perGram: Math.round(pricePerGram),
      per10g: Math.round(pricePerGram * 10),
    };
  }, [decodedPurity, goldRate22k]);

  // Search jewellers
  const handleSearch = () => {
    let results = searchJewellers(searchQuery);
    if (selectedState) {
      results = results.filter(j => j.state === selectedState);
    }
    setSearchResults(results);
  };

  // Auto-search on input change
  useEffect(() => {
    if (searchQuery.length >= 2 || selectedState) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedState]);

  const states = getUniqueStates();
  const cities = getUniqueCities();

  return (
    <main className="min-h-screen bg-amber-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Gold Verification Tool
              </p>
              <h1 className="text-3xl font-bold text-charcoal">
                Hallmark Verification Center
              </h1>
            </div>
          </div>
          <p className="mt-2 text-slate-600">
            Decode gold purity, verify BIS registration, and learn to spot fake hallmarks.
            Protect yourself from gold fraud with our comprehensive verification tools.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid gap-3 md:grid-cols-4 mb-8">
          <a href="#purity-decoder" className="rounded-2xl border border-amber-200 bg-white p-4 hover:border-amber-400 transition-colors">
            <span className="text-2xl">⚖️</span>
            <p className="font-semibold mt-1">Purity Decoder</p>
            <p className="text-xs text-slate-500">Decode 916, 750, etc.</p>
          </a>
          <a href="#jeweller-search" className="rounded-2xl border border-amber-200 bg-white p-4 hover:border-amber-400 transition-colors">
            <span className="text-2xl">🏪</span>
            <p className="font-semibold mt-1">Jeweller Lookup</p>
            <p className="text-xs text-slate-500">Verify BIS registration</p>
          </a>
          <a href="#verification-guide" className="rounded-2xl border border-amber-200 bg-white p-4 hover:border-amber-400 transition-colors">
            <span className="text-2xl">📱</span>
            <p className="font-semibold mt-1">HUID Verification</p>
            <p className="text-xs text-slate-500">BIS CARE app guide</p>
          </a>
          <a href="#red-flags" className="rounded-2xl border border-amber-200 bg-white p-4 hover:border-amber-400 transition-colors">
            <span className="text-2xl">🚨</span>
            <p className="font-semibold mt-1">Red Flags</p>
            <p className="text-xs text-slate-500">Spot fake hallmarks</p>
          </a>
        </div>

        {/* Section 1: Purity Decoder */}
        <section id="purity-decoder" className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚖️</span>
            <h2 className="text-xl font-bold text-charcoal">Gold Purity Decoder</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Enter the purity code stamped on your jewellery (e.g., 916, 750, 22K) to understand its meaning and current value.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">
                Enter Purity Code or Karat
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg font-semibold"
                  placeholder="e.g., 916, 750, 22K, 18K"
                  value={purityInput}
                  onChange={(e) => setPurityInput(e.target.value)}
                />
              </label>

              {decodedPurity && (
                <div className="mt-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Decoded Successfully</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Karat:</span>
                      <span className="font-bold text-2xl text-amber-700">{decodedPurity.karat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Purity:</span>
                      <span className="font-semibold">{decodedPurity.purity}% pure gold</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">BIS Code:</span>
                      <span className="font-mono font-semibold">{decodedPurity.code}</span>
                    </div>
                    <div className="pt-2 border-t border-emerald-200">
                      <p className="text-sm text-slate-700">{decodedPurity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Common use: {decodedPurity.common}</p>
                    </div>
                  </div>
                </div>
              )}

              {purityInput && !decodedPurity && (
                <div className="mt-4 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <span>❌</span>
                    <span className="font-semibold">Invalid Code</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    The code &quot;{purityInput}&quot; is not a recognized gold purity standard.
                    Valid codes: 999, 916, 750, 585, or 24K, 22K, 18K, 14K.
                  </p>
                </div>
              )}
            </div>

            <div>
              {priceEstimate && decodedPurity && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-3">
                    💰 Estimated Gold Value ({decodedPurity.karat})
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Per gram:</span>
                      <span className="text-xl font-bold text-charcoal">₹{formatCurrency(priceEstimate.perGram)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Per 10 grams:</span>
                      <span className="text-xl font-bold text-charcoal">₹{formatCurrency(priceEstimate.per10g)}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    * Based on current 22K gold rate of ₹{formatCurrency(goldRate22k)}/10g.
                    Actual prices vary by jeweller.
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-charcoal mb-2">📋 Common Purity Codes</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-mono">916</span>
                    <span>22K (91.6% pure) - Most jewellery</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-mono">750</span>
                    <span>18K (75% pure) - Diamond jewellery</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-mono">585</span>
                    <span>14K (58.5% pure) - Western style</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-mono">999</span>
                    <span>24K (99.9% pure) - Coins/bars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: BIS Jeweller Search */}
        <section id="jeweller-search" className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏪</span>
            <h2 className="text-xl font-bold text-charcoal">BIS Registered Jeweller Lookup</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Verify if a jeweller is registered with the Bureau of Indian Standards (BIS).
            Only BIS-registered jewellers can legally sell hallmarked gold in India.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-slate-600 md:col-span-2">
              Search by Jeweller Name, City, or Registration Number
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                placeholder="e.g., Tanishq, Chennai, R-TN-1234567"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Filter by State
              <select
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-slate-600 mb-2">
                Found <strong>{searchResults.length}</strong> registered jeweller(s)
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((jeweller) => (
                  <div
                    key={jeweller.registrationNumber}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            BIS Verified
                          </span>
                          {jeweller.isActive && (
                            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-charcoal mt-1">{jeweller.name}</p>
                        <p className="text-sm text-slate-600">{jeweller.city}, {jeweller.state}</p>
                        <p className="text-xs text-slate-500 mt-1">{jeweller.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Registration No.</p>
                        <p className="font-mono text-sm font-semibold">{jeweller.registrationNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">Valid until: {jeweller.validUntil}</p>
                        <p className="text-xs text-emerald-600 mt-1 capitalize">{jeweller.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-amber-800">
                <strong>⚠️ No results found</strong> for &quot;{searchQuery}&quot;
              </p>
              <p className="text-sm text-slate-600 mt-2">
                This doesn&apos;t necessarily mean the jeweller is unregistered. Our database contains
                a sample of major jewellers. For complete verification:
              </p>
              <ul className="text-sm text-slate-600 mt-2 list-disc list-inside">
                <li>Visit <a href="https://bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">bis.gov.in</a> for the official registry</li>
                <li>Ask the jeweller to show their BIS certificate</li>
                <li>Verify the HUID on your jewellery using the BIS CARE app</li>
              </ul>
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              <strong>Note:</strong> This database contains a representative sample of major BIS-registered jewellers.
              For the complete official registry (100,000+ jewellers), visit{" "}
              <a href="https://bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                bis.gov.in
              </a>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              <Link href="/jewellers" className="text-amber-600 hover:underline">Compare making charges</Link> across major jewellers • 
              <Link href="/gold-rate-today" className="text-amber-600 hover:underline ml-1">Check today&apos;s gold rate</Link>
            </p>
          </div>
        </section>

        {/* Section 3: HUID Verification Guide */}
        <section id="verification-guide" className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📱</span>
            <h2 className="text-xl font-bold text-charcoal">How to Verify HUID Using BIS CARE App</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            The Hallmark Unique Identification (HUID) is a 6-character alphanumeric code stamped on all
            hallmarked gold jewellery in India since April 2023. Here&apos;s how to verify it:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-charcoal mb-3">📋 What is HUID?</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="font-medium text-amber-800">Example HUID: A1B2C3</p>
                  <p className="text-xs mt-1">6 alphanumeric characters uniquely identifying your jewellery</p>
                </div>
                <p>
                  HUID is linked to a central database that stores:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Exact purity/fineness of the gold</li>
                  <li>Jeweller&apos;s BIS registration details</li>
                  <li>Assaying center that tested the gold</li>
                  <li>Date of hallmarking</li>
                  <li>Type of article (ring, chain, etc.)</li>
                </ul>
              </div>

              <h3 className="font-semibold text-charcoal mt-6 mb-3">✅ Three Marks to Look For</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <span className="text-lg">△</span>
                  </div>
                  <div>
                    <p className="font-semibold">BIS Logo</p>
                    <p className="text-xs text-slate-500">Triangle with &quot;BIS&quot; text</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <span className="font-mono font-bold">916</span>
                  </div>
                  <div>
                    <p className="font-semibold">Purity Code</p>
                    <p className="text-xs text-slate-500">916 for 22K, 750 for 18K</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <span className="font-mono text-sm font-bold">A1B2C3</span>
                  </div>
                  <div>
                    <p className="font-semibold">HUID Code</p>
                    <p className="text-xs text-slate-500">6-character unique ID</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal mb-3">📱 Steps to Verify HUID</h3>
              <div className="space-y-3">
                <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Download BIS CARE App</p>
                    <p className="text-sm text-slate-600">Available on Google Play Store and Apple App Store</p>
                    <div className="mt-2 flex gap-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.bis.care"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-charcoal px-3 py-1 text-xs text-white hover:bg-slate-700"
                      >
                        Play Store →
                      </a>
                      <a
                        href="https://apps.apple.com/in/app/bis-care-app/id6443724891"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-charcoal px-3 py-1 text-xs text-white hover:bg-slate-700"
                      >
                        App Store →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Register with Phone Number</p>
                    <p className="text-sm text-slate-600">Create an account using your mobile number and OTP</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Select &quot;Verify HUID&quot;</p>
                    <p className="text-sm text-slate-600">Tap the &quot;Verify HUID&quot; option on the home screen</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Enter 6-Digit HUID</p>
                    <p className="text-sm text-slate-600">Type the code stamped on your jewellery</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold">View Verification Results</p>
                    <p className="text-sm text-slate-600">
                      See jeweller name, purity, assaying center, and hallmarking date
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
                <p className="font-semibold text-amber-800">⚠️ Important</p>
                <p className="text-sm text-slate-600 mt-1">
                  If the HUID doesn&apos;t show any results or shows mismatched details,
                  the hallmark may be fake. Report it to BIS immediately via the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Red Flags */}
        <section id="red-flags" className="rounded-3xl border border-rose-200 bg-white p-6 shadow-soft mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚨</span>
            <h2 className="text-xl font-bold text-charcoal">Red Flags: How to Spot Fake Hallmarks</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Protect yourself from gold fraud. Watch out for these warning signs when buying gold jewellery:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {RED_FLAGS.map((flag, index) => (
              <div
                key={index}
                className={`rounded-2xl border-2 p-4 ${
                  flag.severity === 'critical'
                    ? 'border-rose-300 bg-rose-50'
                    : flag.severity === 'high'
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {flag.severity === 'critical' ? '🚫' : flag.severity === 'high' ? '⚠️' : '💡'}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-charcoal">{flag.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          flag.severity === 'critical'
                            ? 'bg-rose-200 text-rose-700'
                            : flag.severity === 'high'
                            ? 'bg-amber-200 text-amber-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{flag.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="font-semibold text-emerald-800">✅ What to Do If You Suspect Fraud</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Report to BIS via the BIS CARE app (&quot;Complaints&quot; section)</li>
              <li>File a complaint with the local consumer forum</li>
              <li>Contact the Legal Metrology Department</li>
              <li>Preserve all bills, receipts, and photographs as evidence</li>
            </ul>
            <p className="mt-3 text-sm text-emerald-700">
              Read our <Link href="/jewellers/buying-guide" className="text-amber-600 hover:underline font-medium">complete gold buying guide</Link> to protect yourself from common scams.
            </p>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-4">🔧 Related Gold Tools</h3>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Link href="/calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">🧮</span>
              <p className="text-sm font-semibold mt-2">Price Calculator</p>
              <p className="text-xs text-slate-500">Get price with GST</p>
            </Link>
            <Link href="/wastage-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">💎</span>
              <p className="text-sm font-semibold mt-2">Wastage Tool</p>
              <p className="text-xs text-slate-500">Making charges</p>
            </Link>
            <Link href="/purity-converter" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">⚖️</span>
              <p className="text-sm font-semibold mt-2">Purity Converter</p>
              <p className="text-xs text-slate-500">22K ↔ 24K</p>
            </Link>
            <Link href="/investment-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">📈</span>
              <p className="text-sm font-semibold mt-2">Investment SIP</p>
              <p className="text-xs text-slate-500">Gold returns</p>
            </Link>
            <Link href="/gold-loan-calculator" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">🏦</span>
              <p className="text-sm font-semibold mt-2">Loan Calculator</p>
              <p className="text-xs text-slate-500">Loan against gold</p>
            </Link>
            <Link href="/jewellers" className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:border-amber-200 transition-colors">
              <span className="text-2xl">🏪</span>
              <p className="text-sm font-semibold mt-2">Find Jewellers</p>
              <p className="text-xs text-slate-500">Compare charges</p>
            </Link>
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-3">📚 Understanding Gold Hallmarking in India</h3>
          <div className="prose prose-sm text-slate-600 max-w-none">
            <p>
              <strong>Gold hallmarking</strong> in India is a certification process by the Bureau of Indian Standards (BIS)
              that verifies the purity of gold jewellery. Since April 2023, it is mandatory for all gold jewellery sold
              in India to carry a <strong>6-digit HUID (Hallmark Unique Identification)</strong> number.
            </p>
            <p className="mt-3">
              The hallmark consists of three elements: the <strong>BIS logo</strong> (triangular mark), the
              <strong> purity grade</strong> (916 for 22K, 750 for 18K), and the <strong>HUID code</strong>.
              This system replaced the earlier 4-mark system that included jeweller identification and assay center marks.
            </p>
            <p className="mt-3">
              <strong>Why is hallmarking important?</strong> It protects consumers from being cheated on gold purity.
              Without hallmarking, jewellers could claim higher purity than actual, charging more for lower quality gold.
              The HUID system creates a digital trail that can be verified anytime using the BIS CARE app.
            </p>
            <p className="mt-3">
              <strong>Penalties for selling non-hallmarked gold:</strong> Jewellers can face fines up to ₹1 lakh and
              imprisonment up to 1 year for selling gold jewellery without proper BIS hallmarking.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <Link
            href="/gold-rate-today"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold rate today → ₹/gram for 22K & 24K gold.
          </Link>
          <Link
            href="/news"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold news → daily headlines and market movers.
          </Link>
          <Link
            href="/jewellers/buying-guide"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Buying guide → tips for purchasing gold safely.
          </Link>
        </section>
      </div>
    </main>
  );
}
