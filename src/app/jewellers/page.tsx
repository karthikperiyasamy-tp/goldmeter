"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import JewellerCard from "../components/JewellerCard";
import { getAllJewellers, type JewellerConfig, type Region } from "@/lib/jewellerConfig";

const REGIONS: { value: Region | 'all'; label: string }[] = [
  { value: 'all', label: 'All India' },
  { value: 'pan-india', label: 'Pan-India Chains' },
  { value: 'south', label: 'South India' },
  { value: 'north', label: 'North India' },
  { value: 'east', label: 'East India' },
  { value: 'west', label: 'West India' },
];

export default function JewellersPage() {
  const allJewellers = getAllJewellers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'makingCharges' | 'heritage'>('name');

  // Featured jewellers (national chains) for hero section - defined before useMemo
  const featuredJewellers = useMemo(() => 
    allJewellers.filter((j) => j.type === 'national').slice(0, 4),
    [allJewellers]
  );
  
  // Get slugs of featured jewellers to exclude from main grid
  const featuredSlugs = useMemo(() => 
    new Set(featuredJewellers.map((j) => j.slug)),
    [featuredJewellers]
  );

  const filteredJewellers = useMemo(() => {
    let result = [...allJewellers];

    // Exclude featured jewellers from main grid to avoid duplicate h3 headings
    // Only exclude when showing all jewellers (no search/region filter active)
    if (!searchQuery.trim() && selectedRegion === 'all') {
      result = result.filter((j) => !featuredSlugs.has(j.slug));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.name.toLowerCase().includes(query) ||
          j.headquarters.toLowerCase().includes(query)
      );
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      result = result.filter(
        (j) => j.regions.includes(selectedRegion) || j.regions.includes('pan-india')
      );
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'makingCharges') {
      result.sort((a, b) => a.makingChargesMin - b.makingChargesMin);
    } else if (sortBy === 'heritage') {
      result.sort((a, b) => a.foundedYear - b.foundedYear);
    }

    return result;
  }, [allJewellers, searchQuery, selectedRegion, sortBy, featuredSlugs]);

  return (
    <main className="min-h-screen bg-amber-50 pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600">GoldMeter Home</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Jewellers Directory</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 to-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">
            Jewellers Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal md:text-4xl">
            Top Gold Jewellers in India - Compare Making Charges & Reviews
          </h1>
          <p className="mt-3 text-slate-600 max-w-3xl leading-relaxed">
            Buying gold jewellery is one of the most significant purchases Indian families make, 
            whether for weddings, investments, or festivals. Choosing the right jeweller can save you 
            thousands in making charges while ensuring guaranteed purity and reliable exchange policies.
          </p>
          <p className="mt-2 text-slate-600 max-w-3xl leading-relaxed">
            Our comprehensive directory covers <strong>{allJewellers.length} trusted jewellery chains</strong> across 
            India - from national giants like Tanishq and Kalyan Jewellers to beloved regional brands 
            like GRT and Lalithaa Jewellery. Compare making charges (ranging from ₹140 to ₹800 per gram), 
            understand exchange policies, and make informed decisions.
          </p>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-white/80 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{allJewellers.length}</p>
              <p className="text-xs text-slate-600 mt-1">Jewellers Listed</p>
            </div>
            <div className="rounded-xl bg-white/80 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {allJewellers.filter((j) => j.type === 'national').length}
              </p>
              <p className="text-xs text-slate-600 mt-1">Pan-India Chains</p>
            </div>
            <div className="rounded-xl bg-white/80 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">₹140</p>
              <p className="text-xs text-slate-600 mt-1">Lowest Making Charge</p>
            </div>
            <div className="rounded-xl bg-white/80 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">1832</p>
              <p className="text-xs text-slate-600 mt-1">Oldest Jeweller (PNG)</p>
            </div>
          </div>
        </section>

        {/* Featured National Chains */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl" aria-hidden="true">⭐</span>
            <h2 className="text-xl font-bold text-charcoal">Featured Pan-India Chains</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredJewellers.map((jeweller) => (
              <JewellerCard key={jeweller.slug} jeweller={jeweller} featured />
            ))}
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search jewellers by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region | 'all')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'makingCharges' | 'heritage')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-amber-300 focus:outline-none"
              >
                <option value="name">Sort: A-Z</option>
                <option value="makingCharges">Sort: Lowest Making Charges</option>
                <option value="heritage">Sort: Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="mt-4 text-sm text-slate-500">
            Showing {filteredJewellers.length} jewellers
            {!searchQuery.trim() && selectedRegion === 'all' && ` (${featuredJewellers.length} featured above)`}
          </p>
        </section>

        {/* Jewellers Grid */}
        <section className="mt-6">
          {filteredJewellers.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJewellers.map((jeweller) => (
                <JewellerCard key={jeweller.slug} jeweller={jeweller} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-lg font-semibold text-slate-700">No jewellers found</p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion('all');
                }}
                className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Making Charges Comparison Table */}
        <section className="mt-12 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Making Charges Comparison Table - Top 10 Jewellers
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            Quick comparison of making charges across popular jewellers. Lower making charges 
            mean more savings, but also consider quality, exchange policy, and trust.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Jeweller</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Making Charges</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Since</th>
                </tr>
              </thead>
              <tbody>
                {allJewellers
                  .sort((a, b) => a.makingChargesMin - b.makingChargesMin)
                  .slice(0, 10)
                  .map((j) => (
                    <tr key={j.slug} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <Link 
                          href={`/jewellers/${j.slug}`}
                          className="font-medium text-charcoal hover:text-amber-600"
                        >
                          {j.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-700">
                        {j.makingChargesRange}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {j.type === 'national' ? 'Pan-India' : 'Regional'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{j.foundedYear}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tools & Resources */}
        <section className="mt-8 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
          <h2 className="text-lg font-bold text-charcoal mb-4">
            Gold Price Tools & Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link 
              href="/jewellers/buying-guide" 
              className="rounded-xl border border-amber-300 bg-amber-50 p-4 hover:border-amber-400 transition-colors"
            >
              <p className="font-semibold text-amber-800">Gold Buying Guide</p>
              <p className="text-sm text-amber-700 mt-1">Complete guide before buying</p>
            </Link>
            <Link 
              href="/hallmark-guide" 
              className="rounded-xl border border-amber-300 bg-amber-50 p-4 hover:border-amber-400 transition-colors"
            >
              <p className="font-semibold text-amber-800">Hallmark Verification</p>
              <p className="text-sm text-amber-700 mt-1">Verify BIS hallmark & HUID</p>
            </Link>
            <Link 
              href="/calculator" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Gold Calculator</p>
              <p className="text-sm text-slate-600 mt-1">Calculate jewellery cost with GST</p>
            </Link>
            <Link 
              href="/wastage-calculator" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Wastage Calculator</p>
              <p className="text-sm text-slate-600 mt-1">Estimate making & wastage charges</p>
            </Link>
            <Link 
              href="/wedding-gold-planner" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Wedding Gold Planner</p>
              <p className="text-sm text-slate-600 mt-1">Plan wedding gold purchase</p>
            </Link>
            <Link 
              href="/gold-rate-today" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Today&apos;s Gold Rate</p>
              <p className="text-sm text-slate-600 mt-1">Live 22K & 24K prices</p>
            </Link>
            <Link 
              href="/gold-rate/chennai" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Gold Rate Chennai</p>
              <p className="text-sm text-slate-600 mt-1">Today&apos;s 22K & 24K prices</p>
            </Link>
            <Link 
              href="/gold-rate/mumbai" 
              className="rounded-xl border border-slate-100 bg-white p-4 hover:border-amber-200 transition-colors"
            >
              <p className="font-semibold text-charcoal">Gold Rate Mumbai</p>
              <p className="text-sm text-slate-600 mt-1">Zaveri Bazaar rates today</p>
            </Link>
          </div>
        </section>

        {/* Understanding Making Charges Section */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Understanding Making Charges - A Complete Guide
          </h2>
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Making charges</strong> are the fees jewellers charge for converting raw gold into finished jewellery. 
              These charges cover labor, craftsmanship, design complexity, and overhead costs. Understanding making charges 
              is crucial because they can significantly impact the total cost of your jewellery purchase.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Making charges in India typically range from <strong>₹140 to ₹800 per gram</strong> depending on the jeweller, 
              design complexity, and whether the piece is mass-produced or handcrafted. Simple chains and plain bangles 
              have lower charges (₹140-250/gram), while intricate bridal sets with detailed craftsmanship command 
              premium charges (₹500-800/gram).
            </p>
            
            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Impact of Making Charges on Total Cost</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>For a 50-gram bridal set:</strong> The difference between ₹200/gram and ₹600/gram making charge 
                is ₹20,000 - a significant amount that could buy additional pieces.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>On exchange:</strong> You only recover gold value, not making charges. Lower making charges 
                mean better value retention if you plan to exchange later.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>GST applies:</strong> 3% GST is charged on both gold value and making charges, adding to the premium.</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Comparing National Chains vs Regional Jewellers</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>National chains</strong> like Tanishq (₹350-800/gram) and Kalyan (₹250-600/gram) offer brand assurance, 
              pan-India exchange, and certified purity but charge premium making charges. <strong>Regional chains</strong> like 
              GRT (₹180-450/gram), Lalithaa (₹150-400/gram), and Thangamayil (₹160-420/gram) offer competitive pricing 
              with BIS hallmarked quality, making them excellent value for budget-conscious buyers.
            </p>
          </div>
        </section>

        {/* Jewellery Buying Checklist */}
        <section className="mt-8 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl" aria-hidden="true">✅</span>
            <h2 className="text-xl font-bold text-charcoal">Gold Jewellery Buying Checklist</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Use this checklist before making any gold purchase to ensure you get the best deal with guaranteed quality:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-800">Pre-Purchase Research</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Compare making charges across 2-3 jewellers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Check today&apos;s gold rate on IBJA or GoldMeter
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Understand the jeweller&apos;s exchange policy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Ask about gold savings schemes for large purchases
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Consider timing - festivals often have making charge offers
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-800">In-Store Verification Steps</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Verify BIS hallmark (916 for 22K, 750 for 18K)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Watch weight measurement in your presence
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Get itemized bill: gold rate + making + GST separately
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Confirm stone weight is excluded from gold weight
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">□</span>
                  Ask for purity certificate and warranty card
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Regional Jewellery Guide */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Regional Jewellery Styles Across India
          </h2>
          <p className="text-slate-600 mb-6">
            India&apos;s diverse cultural heritage is reflected in its jewellery traditions. Different regions have 
            distinct styles, and choosing a jeweller familiar with your regional preference ensures authentic designs:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">South India (Tamil Nadu, Kerala, Karnataka)</h3>
              <p className="text-sm text-slate-600 mt-2">
                Temple jewellery, heavy gold necklaces, traditional designs. <strong>Top jewellers:</strong> GRT, 
                Lalithaa, Thangamayil, Jos Alukkas, Bhima.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">North India (Delhi, Punjab, UP)</h3>
              <p className="text-sm text-slate-600 mt-2">
                Polki, Kundan, Meenakari work. <strong>Top jewellers:</strong> Mehrasons, PC Jeweller, 
                Tanishq, Kalyan Jewellers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">West India (Maharashtra, Gujarat)</h3>
              <p className="text-sm text-slate-600 mt-2">
                Maharashtrian Mangalsutra, Kolhapuri Saaj. <strong>Top jewellers:</strong> TBZ, PNG Jewellers, 
                Tanishq, Malabar Gold.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">East India (Bengal, Odisha)</h3>
              <p className="text-sm text-slate-600 mt-2">
                Bengali filigree, lightweight intricate work. <strong>Top jewellers:</strong> Senco Gold, 
                PC Chandra, Tanishq.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">Andhra Pradesh & Telangana</h3>
              <p className="text-sm text-slate-600 mt-2">
                Traditional Telugu designs, temple motifs. <strong>Top jewellers:</strong> Khazana, 
                GRT, Malabar Gold, Kalyan.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-charcoal">NRI / International</h3>
              <p className="text-sm text-slate-600 mt-2">
                Global exchange, duty considerations. <strong>Top jewellers:</strong> Joyalukkas, 
                Malabar Gold, Kalyan (Middle East presence).
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-6">
            Frequently Asked Questions About Buying Gold Jewellery
          </h2>
          <div className="space-y-4">
            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                Which jeweller has the lowest making charges in India?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                <strong>Saravana Stores Gold Palace</strong> in Chennai typically has the lowest making charges 
                among branded jewellers, starting from <strong>₹140/gram</strong>. Regional jewellers like 
                Lalithaa Jewellery (₹150/gram), Thangamayil (₹160/gram), and AVR Swarna Mahal (₹170/gram) also 
                offer competitive rates. Among national chains, Malabar Gold (₹200/gram+) offers the best value.
              </p>
            </details>
            
            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                Is it safe to buy gold from branded jewellers vs local shops?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Branded jewellers offer <strong>BIS hallmarking, transparent billing, and reliable exchange policies</strong>. 
                While local shops may have lower making charges (sometimes ₹100-150/gram), ensure they provide 
                hallmarked gold and proper invoices. For significant purchases like wedding jewellery (10+ grams), 
                branded stores offer peace of mind with documented purity and nationwide exchange options. 
                The ₹100-200/gram premium often justifies the security.
              </p>
            </details>
            
            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                What should I check before buying gold jewellery?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                <strong>Always verify these five things:</strong> (1) BIS hallmark - look for 916 for 22K gold, 
                750 for 18K; (2) Detailed invoice showing gold rate, net weight, making charges, and GST separately; 
                (3) Weight measurement done in your presence on certified scale; (4) Stone weight excluded from 
                gold weight calculation; (5) Written exchange/buyback policy. Compare making charges across 
                2-3 jewellers and don&apos;t hesitate to negotiate, especially on large purchases.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                Can I exchange old gold at any jeweller?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Most branded jewellers accept old gold exchange, but policies vary significantly. 
                <strong>National chains like Tanishq, Kalyan, and Malabar</strong> accept gold from any source 
                with 2-5% deduction for purity testing. Their own jewellery typically gets 100% gold value. 
                <strong>Tip:</strong> Exchange during festivals when jewellers often offer exchange bonuses. 
                Always compare exchange rates - some jewellers offer better rates on exchange purchases.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                What is the difference between 22K and 24K gold?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                <strong>24K gold (99.9% pure)</strong> is too soft for jewellery and is mainly used for coins 
                and bars. <strong>22K gold (91.6% pure)</strong> is the standard for Indian jewellery - it contains 
                8.4% other metals (copper, silver) for durability while maintaining the golden color. 
                <strong>18K gold (75% pure)</strong> is harder and used for studded diamond jewellery. 
                For investment, buy 24K; for wearing, buy 22K.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                Are gold savings schemes worth it?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Gold savings schemes can be valuable for planned purchases like weddings. Most schemes 
                (Tanishq Golden Harvest, Kalyan KGSS, Joyalukkas Easy Buy) offer <strong>one month free</strong> after 
                11 monthly payments - effectively 8-9% bonus value. However, you must buy from that jeweller 
                at their making charges. <strong>Best for:</strong> Customers who already prefer that jeweller 
                and want to systematically save for a major purchase. Calculate if the bonus outweighs 
                potentially higher making charges.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                Which jeweller is best for wedding jewellery?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                It depends on your priorities: <strong>For brand assurance:</strong> Tanishq (Rivaah collection 
                for regional styles). <strong>For value:</strong> Malabar Gold or regional jewellers like GRT, 
                Lalithaa with lower making charges. <strong>For NRI convenience:</strong> Joyalukkas or 
                Malabar Gold with international exchange. <strong>For traditional regional designs:</strong> 
                Local specialists like GRT (South), TBZ (Maharashtra), Senco (Bengal). Budget 10-15% over 
                gold value for making charges and GST.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-100 p-4">
              <summary className="cursor-pointer font-semibold text-charcoal group-open:text-amber-700">
                How do I verify if gold is genuine after purchase?
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                <strong>Primary verification:</strong> Check BIS hallmark - a six-digit HUID number is mandatory 
                since 2021. You can verify the HUID at bis.gov.in. <strong>At Tanishq stores:</strong> Use their 
                Karatmeter for instant purity testing. <strong>Independent verification:</strong> Any BIS-certified 
                assay center can test gold purity. Keep your original invoice and purity certificate safe - 
                they&apos;re essential for any future exchange or sale.
              </p>
            </details>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Why Compare Jewellers Before Buying Gold?
          </h2>
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Gold jewellery purchases in India are significant financial decisions, often involving lakhs of rupees 
              for wedding sets or festival purchases. The <strong>making charges alone can vary by ₹400-500 per gram</strong> 
              between jewellers, meaning a 50-gram necklace could cost ₹20,000-25,000 more at one store compared to another.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our jewellers directory helps you understand the trade-offs between different options. <strong>Premium brands</strong> 
              like Tanishq offer Tata Group&apos;s reliability and pan-India exchange but charge higher making charges. 
              <strong>Regional champions</strong> like GRT, Lalithaa, and Thangamayil offer excellent quality at 
              significantly lower making charges for customers in their operating areas.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Remember: <strong>Gold rate is the same everywhere</strong> (IBJA rates), so the real difference is in making 
              charges, design variety, exchange policies, and trust. Use our detailed jeweller profiles to find 
              the best match for your specific needs - whether it&apos;s the lowest price, best exchange policy, 
              regional specialization, or international convenience.
            </p>
          </div>
        </section>

        {/* Complete Guide to Indian Jewellery Industry */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Complete Guide to the Indian Jewellery Industry
          </h2>
          <div className="prose prose-slate prose-sm max-w-none space-y-4">
            <p className="text-slate-600 leading-relaxed">
              India stands as the world&apos;s second-largest consumer of gold, with an annual demand exceeding 700-800 tonnes. This remarkable appetite for gold is deeply rooted in Indian culture, where gold transcends mere adornment to become a symbol of prosperity, security, and auspiciousness. Understanding the Indian jewellery industry landscape is essential for anyone planning to purchase gold jewellery, whether for weddings, investments, or personal adornment.
            </p>
            
            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">The Structure of India&apos;s Jewellery Retail Market</h3>
            <p className="text-slate-600 leading-relaxed">
              The Indian jewellery retail market is broadly divided into organized and unorganized sectors. The organized sector, comprising branded jewellery chains like Tanishq, Kalyan Jewellers, Malabar Gold, and regional players like GRT and Lalithaa Jewellery, accounts for approximately 35-40% of the total market. These branded players have transformed the industry by introducing transparency, certified purity, standardized making charges, and reliable exchange policies.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The remaining 60-65% of the market consists of local family jewellers and goldsmiths who have served communities for generations. While some local jewellers offer excellent craftsmanship and competitive pricing, the lack of standardization can make quality assessment challenging for consumers. This is why understanding the differences between organized and unorganized retail becomes crucial for informed decision-making.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">How Gold Pricing Works in India</h3>
            <p className="text-slate-600 leading-relaxed">
              Gold pricing in India follows the rates set by the India Bullion and Jewellers Association (IBJA), which publishes daily rates based on international gold prices, the USD-INR exchange rate, and import duties. This means the <strong>base gold rate is essentially the same across all jewellers</strong> on any given day. What varies significantly is the making charges, wastage, and GST calculations.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The total cost of gold jewellery = (Gold weight × Gold rate per gram) + Making charges + GST (3% on gold value + 5% on making charges). For example, if the gold rate is ₹7,000 per gram for 22K gold and making charges are ₹500 per gram, a 10-gram necklace would cost approximately: (10 × 7,000) + (10 × 500) + GST = ₹70,000 + ₹5,000 + ₹2,350 = ₹77,350. Understanding this breakdown helps you compare prices across jewellers effectively.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">The BIS Hallmarking Revolution</h3>
            <p className="text-slate-600 leading-relaxed">
              The Bureau of Indian Standards (BIS) hallmarking system has been a game-changer for consumer protection in the jewellery industry. Since June 2021, hallmarking has become mandatory for gold jewellery sold in India. Every hallmarked piece carries a unique 6-digit Hallmark Unique Identification Number (HUID) that can be verified on the BIS website, ensuring complete traceability and authenticity.
            </p>
            <p className="text-slate-600 leading-relaxed">
              The hallmark includes several marks: the BIS logo, purity grade (916 for 22K, 750 for 18K, 585 for 14K), and the HUID. This standardization means that whether you buy from Tanishq in Delhi or a local jeweller in Madurai, the purity of hallmarked gold is guaranteed by the government. However, craftsmanship, design quality, and after-sales service still vary significantly between jewellers.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">How Making Charges Vary by Jeweller Type</h3>
            <p className="text-slate-600 leading-relaxed">
              Making charges represent the cost of transforming raw gold into finished jewellery. These charges vary based on multiple factors: the jeweller&apos;s brand positioning, design complexity, manufacturing process (handcrafted vs. machine-made), and regional market dynamics. National chains like Tanishq charge premium making charges (₹350-800 per gram) reflecting their brand value, quality assurance, and pan-India service network.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Regional jewellers often offer significantly lower making charges. For instance, GRT Jewellers (₹180-450/gram), Lalithaa Jewellery (₹150-400/gram), and Thangamayil (₹160-420/gram) provide competitive pricing while maintaining BIS hallmarked quality. For a 50-gram bridal set, this difference in making charges can translate to savings of ₹10,000-20,000 or more.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Exchange and Buyback: What to Expect</h3>
            <p className="text-slate-600 leading-relaxed">
              Exchange policies are a critical consideration when choosing a jeweller. Most branded jewellers offer 100% gold value exchange for their own jewellery, meaning you only lose the making charges when exchanging. For old gold from other sources, a deduction of 2-5% is typically applied for purity testing. Some jewellers like Tanishq and Kalyan have standardized nationwide policies, while regional jewellers may have varying terms.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For NRI customers or those who travel frequently, the international exchange policies of jewellers like Joyalukkas and Malabar Gold become particularly valuable. These brands allow you to buy gold in India and exchange it at stores in the UAE, Singapore, USA, UK, and other countries where they operate, providing unmatched flexibility.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Monthly Gold Savings Plans Explained</h3>
            <p className="text-slate-600 leading-relaxed">
              Most major jewellers offer gold savings schemes that help customers plan for significant purchases like wedding jewellery. The typical structure involves monthly deposits for 11 months, with the 12th month contributed free by the jeweller (effectively 8-9% bonus). Some schemes protect against gold price rises during the deposit period, while others simply accumulate money value.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Popular schemes include Tanishq&apos;s Golden Harvest, Kalyan&apos;s KGSS, Malabar&apos;s Gold Savings Plan, and Joyalukkas Easy Buy. When evaluating these schemes, consider the jeweller&apos;s making charges - a 9% bonus might be offset if the jeweller charges ₹200 more per gram than competitors. Calculate the total cost including making charges before committing to a scheme.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Regional Specializations in Indian Jewellery</h3>
            <p className="text-slate-600 leading-relaxed">
              India&apos;s diverse cultural heritage is reflected in its jewellery traditions, with each region having distinctive styles. South Indian jewellery is known for temple designs, elaborate necklaces, and heavy gold work - specialists include GRT, Lalithaa, NAC, and Thangamayil. Kerala jewellery features unique designs like Nagapadam, Manga Mala, and traditional wedding sets - key players include Joyalukkas, Jos Alukkas, and Bhima.
            </p>
            <p className="text-slate-600 leading-relaxed">
              North Indian jewellery excels in Kundan, Polki, and Meenakari work - heritage jewellers like Mehrasons in Delhi are renowned for these crafts. Bengali jewellery is distinguished by intricate filigree work and lightweight designs - Senco Gold is a master of this tradition. Maharashtrian jewellery features distinctive Mangalsutras and traditional designs - TBZ and PNG Jewellers specialize in this heritage.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Tips for Wedding Jewellery Shopping</h3>
            <p className="text-slate-600 leading-relaxed">
              Wedding jewellery represents the largest gold purchase most Indian families make. For a typical South Indian wedding, the bride&apos;s gold requirements can range from 50-200 grams or more. Planning this purchase wisely can save lakhs of rupees. Start by determining your budget and required gold weight. Compare making charges across 3-4 jewellers in your city. Consider joining a gold savings scheme 12-18 months before the wedding.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For wedding purchases, the exchange policy becomes especially important since bridal jewellery is often exchanged or redesigned over time. Choose a jeweller with a clear, favorable exchange policy. Also, consider the jeweller&apos;s presence - a pan-India brand ensures you can service or exchange jewellery even if you relocate after marriage.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Online vs. Offline Gold Jewellery Purchase</h3>
            <p className="text-slate-600 leading-relaxed">
              The digital transformation of Indian jewellery retail has accelerated, with major brands offering comprehensive e-commerce platforms. Tanishq, Malabar Gold, Kalyan (via Candere), and regional players like GRT now offer thousands of designs online with doorstep delivery, try-at-home services, and easy returns. Online purchases often feature making charge discounts and exclusive collections.
            </p>
            <p className="text-slate-600 leading-relaxed">
              However, for significant purchases like wedding jewellery, most customers prefer the in-store experience to assess weight, design, and fit. The ideal approach combines online research (comparing designs, making charges, reviews) with offline purchase for major items. Many jewellers now offer video shopping consultations as a middle ground.
            </p>

            <h3 className="text-lg font-semibold text-charcoal mt-6 mb-3">Investment Perspective: Gold Jewellery vs. Gold Bars/Coins</h3>
            <p className="text-slate-600 leading-relaxed">
              From a pure investment standpoint, gold coins and bars are more efficient than jewellery since you avoid making charges (which are not recovered on resale). A 10-gram gold bar will always fetch the market rate, while a 10-gram necklace will lose 5-15% to making charges on exchange. However, gold jewellery serves dual purposes of adornment and wealth storage, which coins cannot provide.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For those prioritizing investment efficiency, consider 24K gold coins from reputed brands (available at most jewellers at minimal premiums over gold rate) or digital gold options. For those who want wearable wealth, choosing jewellers with lower making charges maximizes value retention.
            </p>
          </div>
        </section>

        {/* Industry Trends Section */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Current Trends in the Indian Jewellery Market
          </h2>
          <div className="prose prose-slate prose-sm max-w-none space-y-4">
            <p className="text-slate-600 leading-relaxed">
              The Indian jewellery industry is undergoing significant transformation driven by changing consumer preferences, technological adoption, and regulatory evolution. Understanding these trends helps buyers make informed decisions aligned with market dynamics.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-charcoal mb-2">Lightweight Jewellery Revolution</h4>
                <p className="text-sm text-slate-600">
                  Young consumers increasingly prefer lightweight, everyday wearable jewellery over traditional heavy pieces. Collections like Tanishq&apos;s Mia, Senco&apos;s Everlite, and Malabar&apos;s Quorra cater to this demand with designer pieces at lower price points. This trend makes gold more accessible to younger buyers entering the market.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-charcoal mb-2">Lab-Grown Diamonds Integration</h4>
                <p className="text-sm text-slate-600">
                  Lab-grown diamonds are increasingly being paired with gold jewellery, offering consumers larger stones at lower prices. Major jewellers now offer both natural and lab-grown diamond options, making diamond-studded gold jewellery more affordable without compromising on visual appeal.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-charcoal mb-2">Customization and Personalization</h4>
                <p className="text-sm text-slate-600">
                  Custom-designed jewellery is becoming mainstream with jewellers offering CAD-based design services. Customers can now create unique pieces combining traditional elements with personal touches. This trend is particularly popular for engagement rings, wedding sets, and milestone gifts.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-charcoal mb-2">Sustainability and Ethical Sourcing</h4>
                <p className="text-sm text-slate-600">
                  Conscious consumers are increasingly asking about gold sourcing practices. Major brands are responding with responsible sourcing certifications and recycled gold options. Tanishq&apos;s commitment to ethical practices and Malabar&apos;s transparent supply chain are examples of this industry evolution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Identify Genuine Jewellers */}
        <section className="mt-8 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            How to Identify Trustworthy Jewellers
          </h2>
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Choosing a trustworthy jeweller is crucial for a satisfying gold purchase experience. Here are key indicators of a reliable jeweller:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>BIS License:</strong> Check if the jeweller is BIS-licensed to sell hallmarked jewellery. Verify their license number on the BIS website for authenticity.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>Transparent Billing:</strong> A good jeweller provides itemized bills showing gold rate, net weight, making charges, stone charges, and GST separately. Avoid jewellers who give lump-sum pricing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>Weight Verification:</strong> Reputable jewellers weigh gold in front of customers on certified electronic scales. The weight shown should match the weight printed on the tag.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>Written Exchange Policy:</strong> Clear exchange and buyback terms should be provided in writing or printed on the invoice. Avoid verbal promises about future exchanges.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>Industry Reputation:</strong> Look for jewellers with established track records, industry memberships (GJF, state jewellers associations), and positive customer reviews over years of operation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5">✓</span>
                <span><strong>No Pressure Selling:</strong> Trustworthy jewellers allow customers to browse, compare, and think without aggressive sales tactics or time-pressure discounts that expire immediately.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Gold Purity Guide */}
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            Gold Purity Guide: 24K, 22K, 18K & 14K Differences
          </h2>
          <div className="prose prose-slate prose-sm max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Gold purity is measured in karats (K), with 24K being pure gold. Understanding the differences helps you choose the right purity for your needs:
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-50 text-amber-900">
                    <th className="px-4 py-3 text-left border border-amber-200 font-semibold">Purity</th>
                    <th className="px-4 py-3 text-left border border-amber-200 font-semibold">Gold Content</th>
                    <th className="px-4 py-3 text-left border border-amber-200 font-semibold">BIS Mark</th>
                    <th className="px-4 py-3 text-left border border-amber-200 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="bg-white">
                    <td className="px-4 py-3 border border-amber-200 font-medium">24K Gold</td>
                    <td className="px-4 py-3 border border-amber-200">99.9% pure gold</td>
                    <td className="px-4 py-3 border border-amber-200">999</td>
                    <td className="px-4 py-3 border border-amber-200">Investment (coins, bars), rarely for jewellery due to softness</td>
                  </tr>
                  <tr className="bg-amber-50/30">
                    <td className="px-4 py-3 border border-amber-200 font-medium">22K Gold</td>
                    <td className="px-4 py-3 border border-amber-200">91.6% gold + 8.4% alloys</td>
                    <td className="px-4 py-3 border border-amber-200">916</td>
                    <td className="px-4 py-3 border border-amber-200">Traditional Indian jewellery, wedding sets, heavy designs</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 border border-amber-200 font-medium">18K Gold</td>
                    <td className="px-4 py-3 border border-amber-200">75% gold + 25% alloys</td>
                    <td className="px-4 py-3 border border-amber-200">750</td>
                    <td className="px-4 py-3 border border-amber-200">Diamond jewellery, intricate designs, everyday wear</td>
                  </tr>
                  <tr className="bg-amber-50/30">
                    <td className="px-4 py-3 border border-amber-200 font-medium">14K Gold</td>
                    <td className="px-4 py-3 border border-amber-200">58.3% gold + 41.7% alloys</td>
                    <td className="px-4 py-3 border border-amber-200">585</td>
                    <td className="px-4 py-3 border border-amber-200">Very durable everyday pieces, Western-style jewellery</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 leading-relaxed mt-4">
              In India, <strong>22K gold is the standard for traditional jewellery</strong> because it offers an ideal balance of purity and durability. The 8.4% alloy content (typically copper and silver) provides the strength needed for detailed craftsmanship while maintaining the rich golden color. 18K gold is preferred for diamond-studded pieces because the harder metal holds gemstone settings more securely.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
