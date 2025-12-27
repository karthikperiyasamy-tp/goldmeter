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
  city?: string; // Optional city name
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

export default function SilverLast10DaysTable({ history, city }: Props) {
  // Reverse to show newest first (DB returns ascending) and limit to 10 days
  const sortedHistory = [...history].reverse().slice(0, 10);
  
  // Get today's formatted date for comparison
  const todayFormatted = getTodayFormatted();
  
  // Location name for the title
  const locationName = city ? `in ${city} ` : '';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="font-semibold text-slate-700">Silver Rate {locationName}for Last 10 Days</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">1 gram</th>
              <th className="px-4 py-3 font-medium">10 gram</th>
              <th className="px-4 py-3 font-medium">100 gram</th>
              <th className="px-4 py-3 font-medium">1 KG</th>
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

              const silver1kg = day.silver1kg || 0;
              const prevSilver1kg = previousDay?.silver1kg || 0;
              const changeSilver1kg = getChange(silver1kg, prevSilver1kg);

              // Calculate per gram values
              const silver1g = silver1kg / 1000;
              const silver10g = silver1kg / 100;
              const silver100g = silver1kg / 10;
              
              const prevSilver1g = prevSilver1kg / 1000;
              const prevSilver10g = prevSilver1kg / 100;
              const prevSilver100g = prevSilver1kg / 10;
              
              const change1g = getChange(silver1g, prevSilver1kg > 0 ? prevSilver1g : undefined);
              const change10g = getChange(silver10g, prevSilver1kg > 0 ? prevSilver10g : undefined);
              const change100g = getChange(silver100g, prevSilver1kg > 0 ? prevSilver100g : undefined);

              const renderPrice = (price: number, change: number) => (
                <div className="flex items-center gap-1">
                  <span>₹{inr.format(Math.round(price))}</span>
                  {change !== 0 && (
                    <span className={`text-xs ${change > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      ({change > 0 ? '+' : ''}{Math.round(change)})
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
                    {silver1kg > 0 ? renderPrice(silver1g, change1g) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {silver1kg > 0 ? renderPrice(silver10g, change10g) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {silver1kg > 0 ? renderPrice(silver100g, change100g) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {silver1kg > 0 ? renderPrice(silver1kg, changeSilver1kg) : '-'}
                  </td>
                </tr>
              );
            })}
            {history.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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

