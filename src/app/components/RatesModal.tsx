"use client";

type GoldRate = {
  gold22k: number | null;
  gold24k: number | null;
  error?: string;
  timestamp: string;
};

type CityRates = {
  [city: string]: GoldRate;
};

type RatesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: {
    india: GoldRate;
    cities: CityRates;
  } | null;
  loading: boolean;
};

const formatPrice = (price: number | null) => {
  if (price === null) return "N/A";
  return `₹${price.toLocaleString("en-IN")}`;
};

const CityCard = ({
  name,
  data,
}: {
  name: string;
  data: GoldRate;
}) => {
  const hasError = !!data.error;
  const hasData = data.gold22k || data.gold24k;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">{name}</h3>
          <p className="text-xs text-slate-500 mt-1">GoodReturns Data</p>
        </div>
        {hasError && (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
            Error
          </span>
        )}
        {!hasError && hasData && (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
            ✓
          </span>
        )}
      </div>

      {hasError ? (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {data.error}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">22K Gold (10g)</span>
            <span className="text-lg font-bold text-amber-700">
              {formatPrice(data.gold22k)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">24K Gold (10g)</span>
            <span className="text-lg font-bold text-amber-700">
              {formatPrice(data.gold24k)}
            </span>
          </div>
          {!hasData && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              No data found. The website may not have rates for this city.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function RatesModal({
  isOpen,
  onClose,
  data,
  loading,
}: RatesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl bg-amber-50 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-charcoal">
              Gold Rates by City
            </h2>
            <p className="text-sm text-slate-600">
              Live rates from GoodReturns.in • Per 10 grams
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-lg hover:bg-slate-50 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
              <p className="mt-4 text-sm text-slate-600">
                Fetching gold rates from multiple cities...
              </p>
              <p className="mt-1 text-xs text-slate-500">Scraping data from GoodReturns.in</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* India Overall Rate */}
              <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-charcoal flex items-center gap-2">
                      🇮🇳 All India Rate
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Overall India average from GoodReturns.in</p>
                  </div>
                  {data.india.error ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-600">
                      Error
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 font-semibold">
                      ✓ Live
                    </span>
                  )}
                </div>

                {data.india.error ? (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {data.india.error}
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-amber-100 p-4">
                      <span className="text-sm font-medium text-amber-800">22K Gold (10g)</span>
                      <p className="text-2xl font-bold text-amber-900 mt-2">
                        {formatPrice(data.india.gold22k)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-4 text-white">
                      <span className="text-sm font-medium text-slate-300">24K Gold (10g)</span>
                      <p className="text-2xl font-bold mt-2">
                        {formatPrice(data.india.gold24k)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* City Rates */}
              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-4">City-Specific Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.cities).map(([cityName, cityData]) => (
                    <CityCard
                      key={cityName}
                      name={cityName}
                      data={cityData}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
                <h3 className="font-semibold text-charcoal">ℹ️ Note</h3>
                <p className="mt-2 text-sm text-slate-600">
                  All prices are scraped from <strong>GoodReturns.in</strong>. 
                  All prices shown are <strong>per 10 grams</strong> (per gram × 10).
                </p>
                <ul className="mt-2 text-xs text-slate-500 list-disc list-inside space-y-1">
                  <li><strong>India Rate:</strong> Overall average from main GoodReturns page</li>
                  <li><strong>City Rates:</strong> Scraped from city-specific pages</li>
                  <li>Format: Per 10 grams (converted from per gram)</li>
                  <li>Both 22K and 24K rates are shown for comparison</li>
                </ul>
                <p className="mt-2 text-xs text-slate-500">
                  Last updated:{" "}
                  {new Date(
                    data.india.timestamp || new Date().toISOString()
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">Click "Fetch Gold Rates" to scrape data from multiple cities</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-amber-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

