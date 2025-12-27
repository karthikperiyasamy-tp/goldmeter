import React from 'react';

type RateHistory = {
  date: string;
  gold22k: number;
  gold24k: number;
  gold18k: number;
  silver1kg?: number;
};

type Props = {
  history: RateHistory[];
  city?: string; // Optional city name - if not provided, shows "India"
};

const inr = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

// Get today's date in "DD Mon" format to match against history dates
function getTodayFormatted(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

export default function Last10DaysTable({ history, city }: Props) {
  // DB `getHistoricalGoldRates` returns ascending (oldest to newest).
  // Reverse for display (newest first) and limit to 10 days
  const sortedHistory = [...history].reverse().slice(0, 10);
  
  // Get today's formatted date for comparison
  const todayFormatted = getTodayFormatted();
  
  // Location name for the title
  const locationName = city || 'India';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-700">Gold Rate in {locationName} for Last 10 Days (1 gram)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">24K</th>
              <th className="px-4 py-3 font-medium">22K</th>
              <th className="px-4 py-3 font-medium">18K</th>
              <th className="px-4 py-3 font-medium">Silver (1g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedHistory.map((day, index) => {
              // Calculate change from the NEXT day in the list (which is actually the PREVIOUS day in time)
              const previousDay = sortedHistory[index + 1];
              
              const getChange = (current: number, previous: number | undefined) => {
                if (!previous) return 0;
                return current - previous;
              };

              const change24k = getChange(day.gold24k, previousDay?.gold24k);
              const change22k = getChange(day.gold22k, previousDay?.gold22k);
              const change18k = getChange(day.gold18k, previousDay?.gold18k);
              const changeSilver = getChange(day.silver1kg || 0, previousDay?.silver1kg || 0);

              const renderPrice = (price: number, change: number, divisor: number = 10) => (
                <div className="flex items-center gap-1">
                  <span>₹{inr.format(price/divisor)}</span>
                  {change !== 0 && (
                    <span className={`text-xs ${change > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      ({change > 0 ? '+' : ''}{Math.round(change/divisor)})
                    </span>
                  )}
                  {change === 0 && <span className="text-xs text-slate-400">(0)</span>}
                </div>
              );

              // Check if this date is today
              const isToday = day.date === todayFormatted;
              
              return (
                <tr key={`${day.date}-${index}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {day.date}
                    {isToday && <span className="ml-1 text-amber-600 font-medium">(Today)</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                    {renderPrice(day.gold24k, change24k)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {renderPrice(day.gold22k, change22k)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {renderPrice(day.gold18k, change18k)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {day.silver1kg ? renderPrice(day.silver1kg, changeSilver, 1000) : '-'}
                  </td>
                </tr>
              );
            })}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No historical data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

