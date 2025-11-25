# Database Integration Guide

## Current State
The application currently uses **mock data** for historical price charts. Real-time prices are scraped from GoodReturns.in.

## Database Schema

### Table: `gold_prices`

```sql
CREATE TABLE gold_prices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  city VARCHAR(50) NOT NULL DEFAULT 'India',
  gold_22k DECIMAL(10,2) NOT NULL COMMENT 'Price per 10 grams',
  gold_24k DECIMAL(10,2) NOT NULL COMMENT 'Price per 10 grams',
  source VARCHAR(100) DEFAULT 'GoodReturns',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_city_date (city, date),
  INDEX idx_date (date),
  UNIQUE KEY unique_city_date (city, date)
);
```

### Supported Cities
- India (national average)
- Chennai
- Mumbai
- Bangalore
- Delhi
- Hyderabad
- Coimbatore
- Pune
- Kolkata
- Ahmedabad
- Vijayawada

## Integration Steps

### 1. Set Up Database
Choose your database solution:
- **MySQL/PostgreSQL** (recommended for production)
- **Supabase** (easy setup, built-in API)
- **PlanetScale** (serverless MySQL)
- **Neon** (serverless Postgres)

### 2. Create API Endpoint for Fetching Historical Data

Create `/api/gold-prices/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Your DB connection

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "India";
  const days = parseInt(searchParams.get("days") || "7");
  
  try {
    const prices = await db.query(`
      SELECT 
        DATE_FORMAT(date, '%d %b') as date,
        gold_22k as gold22k,
        gold_24k as gold24k,
        UNIX_TIMESTAMP(date) * 1000 as timestamp
      FROM gold_prices
      WHERE city = ?
        AND date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY date ASC
    `, [city, days]);
    
    return NextResponse.json({
      success: true,
      prices: prices,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 3. Create API Endpoint for Saving Prices

Add to `/api/gold-prices/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { city, gold_22k, gold_24k, date } = body;
  
  try {
    await db.query(`
      INSERT INTO gold_prices (city, gold_22k, gold_24k, date)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        gold_22k = VALUES(gold_22k),
        gold_24k = VALUES(gold_24k),
        updated_at = CURRENT_TIMESTAMP
    `, [city, gold_22k, gold_24k, date]);
    
    return NextResponse.json({
      success: true,
      message: "Price saved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 4. Update Scraping to Save to Database

Modify `/api/scrape-rates/route.ts`:

```typescript
// After successful scraping
const today = new Date().toISOString().split('T')[0];

// Save India rate
await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gold-prices`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    city: 'India',
    gold_22k: india.gold22k,
    gold_24k: india.gold24k,
    date: today,
  }),
});

// Save city rates
for (const [cityName, rates] of Object.entries(cities)) {
  if (rates.gold22k && rates.gold24k) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gold-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: cityName,
        gold_22k: rates.gold22k,
        gold_24k: rates.gold24k,
        date: today,
      }),
    });
  }
}
```

### 5. Update Chart Component to Fetch from Database

In `utils/chartDataHelpers.ts`, implement the commented function:

```typescript
export async function fetchChartDataFromDB(
  range: TimeRange,
  city: string = "India"
): Promise<ChartDataPoint[]> {
  const days = range === "7D" ? 7 : range === "30D" ? 30 : 365;
  
  try {
    const response = await fetch(`/api/gold-prices?city=${city}&days=${days}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch chart data");
    }
    
    const data = await response.json();
    return data.prices;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    // Fallback to mock data
    return generateMockChartData(currentGold22k, currentGold24k, range, city);
  }
}
```

### 6. Update HomeClient to Use Real Data

In `HomeClient.tsx`:

```typescript
const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
const [loadingChart, setLoadingChart] = useState(true);

useEffect(() => {
  async function loadChartData() {
    setLoadingChart(true);
    try {
      const data = await fetchChartDataFromDB(chartRange, "India");
      setChartData(data);
    } catch (error) {
      // Fallback to mock data
      setChartData(generateMockChartData(hero22k, hero24k, chartRange, "India"));
    } finally {
      setLoadingChart(false);
    }
  }
  
  loadChartData();
}, [chartRange, hero22k, hero24k]);
```

## Cron Job Setup

Set up a cron job to scrape prices daily:

### Option 1: Vercel Cron Jobs
Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape-daily",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### Option 2: GitHub Actions
Create `.github/workflows/scrape-daily.yml`:

```yaml
name: Daily Gold Price Scraping
on:
  schedule:
    - cron: '0 10 * * *' # 10 AM daily
  workflow_dispatch: # Allow manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger scraping endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/scrape-rates
```

## Testing

1. **Test with sample data:**
   ```sql
   INSERT INTO gold_prices (city, gold_22k, gold_24k, date) VALUES
   ('India', 59680, 64890, DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
   ('India', 59720, 64950, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
   ('India', 59650, 64880, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
   ('India', 59700, 64920, DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
   ('India', 59680, 64890, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
   ('India', 59750, 64980, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
   ('India', 59800, 65040, CURDATE());
   ```

2. **Verify API:**
   ```bash
   curl http://localhost:3000/api/gold-prices?city=India&days=7
   ```

3. **Check chart display** in browser

## Migration Path

1. ✅ **Phase 1 (Current)**: Mock data for charts, live scraping for current prices
2. **Phase 2**: Set up database and save scraped prices daily
3. **Phase 3**: Switch chart data from mock to database
4. **Phase 4**: Add historical data import/backfill
5. **Phase 5**: Set up automated daily scraping with cron

## Notes

- Keep mock data as fallback in case database is unavailable
- Consider data retention policy (e.g., keep 2 years of data)
- Add indexes for performance on date-based queries
- Monitor database size and implement archiving if needed

