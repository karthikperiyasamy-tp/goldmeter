"use client";

import Link from "next/link";

type PriceHeroProps = {
  city: string;
  gold22k: number;
  gold24k: number;
  gold18k?: number;
  silver1kg?: number;
  updated: string;
  priceChange?: {
    gold22k: number;
    gold24k: number;
    gold18k?: number;
    silver1kg?: number;
  };
};

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

// Format date for title - handles DD/MM/YYYY format
function formatDateForTitle(dateStr: string): string {
  try {
    // Check if it's DD/MM/YYYY format
    const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    
    // Try standard date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function PriceHero({
  city,
  gold22k,
  gold24k,
  gold18k,
  silver1kg,
  updated,
  priceChange = { gold22k: 0, gold24k: 0 },
}: PriceHeroProps) {
  const finalGold18k = gold18k || Math.round((gold24k * 18) / 24);
  const formattedDate = formatDateForTitle(updated);

  const handleShare = async () => {
    const shareData = {
      title: `${city} Gold Rate Today - ${formattedDate}`,
      text: `${city} Gold Rate Today: 22K ₹${formatter.format(gold22k)}/10g, 24K ₹${formatter.format(gold24k)}/10g`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="border-y border-amber-100 bg-gradient-to-r from-white to-amber-50 print:border-0 print:bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="uppercase tracking-widest text-slate-500">
              Updated {updated}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{formattedDate}</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-amber-700 md:text-4xl">
            {city} Gold Rate Today
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Per 10 grams • Updated daily by GoldMeter
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {/* Enhanced with data attributes for AI/AIO extraction */}
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft" 
                 data-metal="gold" 
                 data-purity="22k" 
                 data-price={gold22k} 
                 data-unit="per-10g" 
                 data-currency="INR"
                 data-price-change={priceChange.gold22k}
                 data-city={city}>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                22K Gold
              </p>
              <p className="text-3xl font-bold text-charcoal" data-speakable-price="22k">
                ₹{formatter.format(gold22k)}
              </p>
              <p className={`text-xs ${priceChange.gold22k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {priceChange.gold22k >= 0 ? '+' : ''}₹{priceChange.gold22k} vs yesterday
              </p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft"
                 data-metal="gold" 
                 data-purity="24k" 
                 data-price={gold24k} 
                 data-unit="per-10g" 
                 data-currency="INR"
                 data-price-change={priceChange.gold24k}
                 data-city={city}>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                24K Gold
              </p>
              <p className="text-3xl font-bold text-charcoal" data-speakable-price="24k">
                ₹{formatter.format(gold24k)}
              </p>
              <p className={`text-xs ${priceChange.gold24k >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {priceChange.gold24k >= 0 ? '+' : ''}₹{priceChange.gold24k} vs yesterday
              </p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-4 shadow-soft"
                 data-metal="gold" 
                 data-purity="18k" 
                 data-price={finalGold18k} 
                 data-unit="per-10g" 
                 data-currency="INR"
                 data-price-change={priceChange.gold18k || 0}
                 data-city={city}>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                18K Gold
              </p>
              <p className="text-3xl font-bold text-charcoal" data-speakable-price="18k">
                ₹{formatter.format(finalGold18k)}
              </p>
              <p className={`text-xs ${(priceChange.gold18k || 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {(priceChange.gold18k || 0) >= 0 ? '+' : ''}₹{priceChange.gold18k || 0} vs yesterday
              </p>
            </div>
            {!!silver1kg && (
              <div className="rounded-2xl bg-white px-6 py-4 shadow-soft"
                   data-metal="silver" 
                   data-purity="999" 
                   data-price={silver1kg} 
                   data-unit="per-kg" 
                   data-currency="INR"
                   data-price-change={priceChange.silver1kg || 0}
                   data-city={city}>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Silver (1kg)
                </p>
                <p className="text-3xl font-bold text-charcoal" data-speakable-price="silver">
                  ₹{formatter.format(silver1kg)}
                </p>
                <p className={`text-xs ${(priceChange.silver1kg || 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {(priceChange.silver1kg || 0) >= 0 ? '+' : ''}₹{priceChange.silver1kg || 0} vs yesterday
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm print:hidden">
            <Link
              href="#price-chart"
              className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Charts
            </Link>
            <Link
              href="/calculator"
              className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-soft hover:bg-amber-700 transition-colors"
            >
              Calculate Price
            </Link>
            <button 
              onClick={handleShare}
              className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              📤 Share
            </button>
            <button 
              onClick={handlePrint}
              className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              🖨️ Print
            </button>
          </div>
        </div>
        <div className="w-full rounded-3xl border border-amber-100 bg-white p-5 shadow-soft md:w-1/3">
          <p className="text-xs uppercase text-slate-400">Quick Calculator</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            ₹{(gold24k / 10).toFixed(2)}
            <span className="text-sm font-medium text-slate-500">/ gram</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Estimate jewellery cost with making + GST
          </p>
          <Link 
            href="/wastage-calculator"
            className="mt-4 block w-full rounded-2xl bg-amber-100 py-2 text-center text-sm font-semibold text-amber-700 hover:bg-amber-200 transition-colors"
          >
            Open Jewellery Wastage Tool
          </Link>
        </div>
      </div>
    </section>
  );
}

