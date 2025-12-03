import React from 'react';

type RateHistory = {
  date: string; // "DD MMM" e.g. "02 Dec"
  timestamp: number;
  gold22k: number;
  gold24k: number;
  gold18k?: number;
};

type Props = {
  history: RateHistory[];
};

const inr = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export default function MonthStatistics({ history }: Props) {
  // Group history by month (using timestamp to be safe)
  // We need to process the data to group by month
  const groupedByMonth: Record<string, RateHistory[]> = {};
  
  // History is typically last 30-90 days.
  history.forEach(item => {
    const date = new Date(item.timestamp);
    const monthKey = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    // Ensure 18k is present
    const gold18k = item.gold18k || Math.round((item.gold24k * 18) / 24);
    groupedByMonth[monthKey].push({ ...item, gold18k });
  });

  const months = Object.keys(groupedByMonth);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3">
        Historical Price of Gold Rate
      </h3>
      
      <div className="space-y-2">
        {months.map((month, index) => {
          const monthData = groupedByMonth[month];
          // Sort by timestamp ascending to find start/end rates
          monthData.sort((a, b) => a.timestamp - b.timestamp);
          
          const startRate24k = monthData[0].gold24k;
          const endRate24k = monthData[monthData.length - 1].gold24k;
          
          const maxRate24k = Math.max(...monthData.map(d => d.gold24k));
          const minRate24k = Math.min(...monthData.map(d => d.gold24k));
          
          const maxRateDate = monthData.find(d => d.gold24k === maxRate24k)?.date;
          const minRateDate = monthData.find(d => d.gold24k === minRate24k)?.date;
          
          const changePercent = ((endRate24k - startRate24k) / startRate24k) * 100;
          const trend = changePercent > 0 ? 'Rising' : changePercent < 0 ? 'Falling' : 'Neutral';

          return (
            <details key={month} className="group rounded-lg border border-slate-200 bg-white open:shadow-md transition-shadow" open={index === 0}>
              <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-slate-700 group-open:text-emerald-700 group-open:bg-emerald-50/50 rounded-t-lg">
                <span>Gold Price Movement in {month}</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              
              <div className="p-4 pt-0 text-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase text-slate-500 border-b border-slate-100">
                        <th className="py-3 font-medium">Gold Rates</th>
                        <th className="py-3 font-medium">22K</th>
                        <th className="py-3 font-medium">24K</th>
                        <th className="py-3 font-medium">18K</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="py-3 text-slate-600">Rate at start of month</td>
                        <td className="py-3">₹{inr.format(monthData[0].gold22k/10)}</td>
                        <td className="py-3">₹{inr.format(monthData[0].gold24k/10)}</td>
                        <td className="py-3">₹{inr.format((monthData[0].gold18k!)/10)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-600">Rate at end of month</td>
                        <td className="py-3">₹{inr.format(monthData[monthData.length - 1].gold22k/10)}</td>
                        <td className="py-3">₹{inr.format(monthData[monthData.length - 1].gold24k/10)}</td>
                        <td className="py-3">₹{inr.format((monthData[monthData.length - 1].gold18k!)/10)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-600">Highest rate in {month.split(' ')[0]}</td>
                        <td className="py-3">₹{inr.format(Math.max(...monthData.map(d => d.gold22k))/10)}</td>
                        <td className="py-3">₹{inr.format(maxRate24k/10)} <span className="text-xs text-slate-400">on {maxRateDate}</span></td>
                        <td className="py-3">₹{inr.format(Math.max(...monthData.map(d => d.gold18k!))/10)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-600">Lowest rate in {month.split(' ')[0]}</td>
                        <td className="py-3">₹{inr.format(Math.min(...monthData.map(d => d.gold22k))/10)}</td>
                        <td className="py-3">₹{inr.format(minRate24k/10)} <span className="text-xs text-slate-400">on {minRateDate}</span></td>
                        <td className="py-3">₹{inr.format(Math.min(...monthData.map(d => d.gold18k!))/10)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-600">Overall performance</td>
                        <td className="py-3 font-medium" colSpan={3}>{trend}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-600">% Change</td>
                        <td className="py-3 font-medium" colSpan={3}>
                          <span className={changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

