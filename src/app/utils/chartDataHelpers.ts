/**
 * Chart Data Helpers
 * 
 * This file contains utilities for managing gold price chart data.
 * Currently uses mock data, but is structured to easily integrate with a database.
 */

export type ChartDataPoint = {
  date: string; // Display format: "22 Nov"
  gold22k: number; // Price per 10g
  gold24k: number; // Price per 10g
  timestamp: number; // Unix timestamp for sorting/filtering
};

export type TimeRange = "7D" | "30D" | "1Y";

/**
 * Generate mock historical data for development/testing
 * 
 * TODO: Replace this with actual database queries when DB is set up
 * 
 * Database schema suggestion:
 * 
 * Table: gold_prices
 * - id: INT (primary key, auto-increment)
 * - date: DATE (index)
 * - city: VARCHAR(50) (index, use "India" for national average)
 * - gold_22k: DECIMAL(10,2) (price per 10g)
 * - gold_24k: DECIMAL(10,2) (price per 10g)
 * - created_at: TIMESTAMP
 * 
 * Example query to fetch data:
 * SELECT 
 *   DATE_FORMAT(date, '%d %b') as date,
 *   gold_22k as gold22k,
 *   gold_24k as gold24k,
 *   UNIX_TIMESTAMP(date) as timestamp
 * FROM gold_prices
 * WHERE city = 'India'
 *   AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
 * ORDER BY date ASC;
 */
export function generateMockChartData(
  currentGold22k: number,
  currentGold24k: number,
  range: TimeRange,
  city: string = "India"
): ChartDataPoint[] {
  const days = range === "7D" ? 7 : range === "30D" ? 30 : 365;
  const data: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price variations (±2% random fluctuation)
    const variation22k = (Math.random() - 0.5) * 0.04; // -2% to +2%
    const variation24k = (Math.random() - 0.5) * 0.04;
    
    // Create a slight upward trend over time
    const trendFactor = (days - i) / days * 0.02; // Max 2% increase from start to now
    
    data.push({
      date: date.toLocaleDateString("en-IN", { 
        day: "2-digit", 
        month: "short" 
      }),
      gold22k: Math.round(currentGold22k * (1 + variation22k - trendFactor)),
      gold24k: Math.round(currentGold24k * (1 + variation24k - trendFactor)),
      timestamp: date.getTime(),
    });
  }

  return data;
}

/**
 * Future: Fetch chart data from database
 * 
 * Example implementation:
 * 
 * export async function fetchChartDataFromDB(
 *   range: TimeRange,
 *   city: string = "India"
 * ): Promise<ChartDataPoint[]> {
 *   const days = range === "7D" ? 7 : range === "30D" ? 30 : 365;
 *   
 *   const response = await fetch(`/api/gold-prices?city=${city}&days=${days}`);
 *   const data = await response.json();
 *   
 *   return data.prices.map((price: any) => ({
 *     date: new Date(price.date).toLocaleDateString("en-IN", {
 *       day: "2-digit",
 *       month: "short"
 *     }),
 *     gold22k: price.gold_22k,
 *     gold24k: price.gold_24k,
 *     timestamp: new Date(price.date).getTime(),
 *   }));
 * }
 */

/**
 * Future: Save scraped prices to database
 * 
 * Example implementation:
 * 
 * export async function savePriceToDB(
 *   city: string,
 *   gold22k: number,
 *   gold24k: number
 * ): Promise<void> {
 *   await fetch('/api/gold-prices', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       city,
 *       gold_22k: gold22k,
 *       gold_24k: gold24k,
 *       date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
 *     }),
 *   });
 * }
 */

