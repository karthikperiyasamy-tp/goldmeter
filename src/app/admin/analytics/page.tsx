"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  totalViews: number;
  uniqueUsers: number;
  topPages: Array<{ _id: string; count: number }>;
  sources: Array<{ _id: string; count: number }>;
  topCities: Array<{ _id: string; count: number }>;
  hourlyTraffic: Array<{ _id: string; count: number }>;
}

const TIME_RANGES = [
  { value: '5m', label: 'Last 5 minutes' },
  { value: '15m', label: 'Last 15 minutes' },
  { value: '30m', label: 'Last 30 minutes' },
  { value: '1h', label: 'Last 1 hour' },
  { value: '4h', label: 'Last 4 hours' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/analytics/summary?range=${selectedRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('[Analytics] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedRange]);

  const currentRange = TIME_RANGES.find(r => r.value === selectedRange)?.label || 'Last 7 days';

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">Analytics Dashboard</h1>
          <Link 
            href="/"
            className="text-amber-600 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Security Warning */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
          <p className="text-xs md:text-sm text-amber-900">
            🔒 <strong>Admin Page:</strong> Blocked from search engines. Don&apos;t share this URL publicly.
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="timeRange" className="text-sm font-medium text-slate-700">
              Time Range:
            </label>
            <select
              id="timeRange"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {TIME_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Server-side tracking (can&apos;t be blocked)</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Loading analytics...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Failed to load analytics data</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => setSelectedRange(selectedRange)} // Trigger refetch
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h3 className="text-xs md:text-sm font-medium text-slate-600 mb-2">Total Page Views</h3>
                <p className="text-3xl md:text-4xl font-bold text-charcoal">{data.totalViews.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{currentRange}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h3 className="text-xs md:text-sm font-medium text-slate-600 mb-2">Unique Visitors</h3>
                <p className="text-3xl md:text-4xl font-bold text-charcoal">{data.uniqueUsers.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Based on unique IPs</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h3 className="text-xs md:text-sm font-medium text-slate-600 mb-2">Avg. Pages per User</h3>
                <p className="text-3xl md:text-4xl font-bold text-charcoal">
                  {data.uniqueUsers > 0 ? (data.totalViews / data.uniqueUsers).toFixed(1) : '0'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Top Pages */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h2 className="text-base md:text-lg font-semibold text-charcoal mb-4">📄 Top Pages</h2>
                <div className="space-y-2">
                  {data.topPages.map((page: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs md:text-sm text-slate-700 font-mono truncate mr-2">{page._id || '/'}</span>
                      <span className="text-xs md:text-sm font-semibold text-charcoal flex-shrink-0">{page.count}</span>
                    </div>
                  ))}
                  {data.topPages.length === 0 && (
                    <p className="text-sm text-slate-500">No data for this time range</p>
                  )}
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h2 className="text-base md:text-lg font-semibold text-charcoal mb-4">🌐 Traffic Sources</h2>
                <div className="space-y-3">
                  {data.sources.map((source: any, idx: number) => {
                    const percentage = data.totalViews > 0 ? ((source.count / data.totalViews) * 100).toFixed(1) : '0';
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs md:text-sm text-slate-700 capitalize">{source._id || 'unknown'}</span>
                          <span className="text-xs md:text-sm font-semibold text-charcoal">
                            {source.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {data.sources.length === 0 && (
                    <p className="text-sm text-slate-500">No data for this time range</p>
                  )}
                </div>
              </div>

              {/* Top Cities */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h2 className="text-base md:text-lg font-semibold text-charcoal mb-4">🏙️ Top Cities</h2>
                <div className="space-y-2">
                  {data.topCities.map((city: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs md:text-sm text-slate-700">{city._id}</span>
                      <span className="text-xs md:text-sm font-semibold text-charcoal">{city.count}</span>
                    </div>
                  ))}
                  {data.topCities.length === 0 && (
                    <p className="text-sm text-slate-500">No geo data for this time range</p>
                  )}
                </div>
              </div>

              {/* Time-based Traffic */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-slate-200">
                <h2 className="text-base md:text-lg font-semibold text-charcoal mb-4">
                  ⏰ Traffic Over Time
                </h2>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {data.hourlyTraffic.map((hour: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-1 text-xs">
                      <span className="text-slate-600 font-mono">{hour._id}</span>
                      <span className="font-semibold text-charcoal">{hour.count}</span>
                    </div>
                  ))}
                  {data.hourlyTraffic.length === 0 && (
                    <p className="text-sm text-slate-500">No data for this time range</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison with GA */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">
                📊 Why This Shows More Traffic Than Google Analytics
              </h3>
              <ul className="text-xs md:text-sm text-blue-800 space-y-2">
                <li>✅ <strong>Server-side tracking</strong> - Can&apos;t be blocked by ad blockers (30-50% of users)</li>
                <li>✅ <strong>Privacy browsers</strong> - Captures Brave, Firefox Enhanced Protection users</li>
                <li>✅ <strong>DNS blocking</strong> - Works even when users block Google Analytics via Pi-hole/NextDNS</li>
                <li>✅ <strong>All traffic</strong> - Shows the actual traffic your server is receiving</li>
              </ul>
              <p className="text-xs text-blue-700 mt-4">
                💡 <strong>Tip:</strong> Use this dashboard for accurate traffic numbers. Use Google Analytics for detailed behavior analysis of users who don&apos;t block it.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-500">
              <p>Data stored in MongoDB • Real-time updates • Privacy-friendly</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
