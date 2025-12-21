# 🚀 MongoDB Integration - Deployment Guide

## ✅ Implementation Complete!

All code has been implemented. Follow these steps to deploy:

---

## 📋 Step 1: Install Dependencies

```bash
cd gdrate-app
npm install
```

This installs the new `mongodb` package added to `package.json`.

---

## 🗄️ Step 2: Setup MongoDB Atlas

### 2.1: Create Account & Cluster
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier M0 is perfect)
3. Create a new cluster:
   - Provider: **AWS**
   - Region: **Mumbai (ap-south-1)** (closest to India)
   - Cluster Name: **goldrate-cluster**

### 2.2: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Username: `goldrate-admin`
4. Click **"Autogenerate Secure Password"** → **SAVE THIS PASSWORD**
5. Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 2.3: Whitelist IPs
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"**
4. IP: `0.0.0.0/0` (auto-fills)
5. Click **"Confirm"**

### 2.4: Get Connection String
1. Go to **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js 5.5 or later**
5. **COPY** the connection string (looks like):
   ```
   mongodb+srv://goldrate-admin:<password>@goldrate-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with your actual password from Step 2.2

---

## 🔑 Step 3: Create Environment Variables

### 3.1: For Local Development

Create `.env.local` file in `gdrate-app/` directory:

```bash
# In gdrate-app folder
touch .env.local  # On Windows: New-Item .env.local
```

Add this content (replace with your actual values):

```env
# MongoDB Connection String (from Step 2.4)
MONGODB_URI=mongodb+srv://goldrate-admin:YOUR_PASSWORD@goldrate-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

# CRON Secret (generate a random string)
CRON_SECRET=your-secure-random-string-here
```

### 3.2: Generate CRON_SECRET

**On Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

Copy the generated string and use it as `CRON_SECRET`.

---

## 🧪 Step 4: Test Locally

### 4.1: Start Development Server

```bash
npm run dev
```

### 4.2: Test Manual Scraping

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/admin/scrape-and-save -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Rates scraped and saved successfully",
  "saved": 11,
  "timestamp": "2025-11-26T..."
}
```

### 4.3: Verify Data in MongoDB

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. You should see:
   - Database: `goldrate`
   - Collection: `gold_prices`
   - Documents: 11 records (India + 10 cities)

### 4.4: Test Homepage

Visit `http://localhost:3000`
- Rates should display with "Live" badges
- Check browser console - should see: `✅ [HomePage] Using rates from MongoDB`

---

## 🌐 Step 5: Deploy to Vercel

### 5.1: Add Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your **goldmeter** project
3. Go to **Settings** → **Environment Variables**
4. Add two variables:

**Variable 1:**
- Name: `MONGODB_URI`
- Value: `mongodb+srv://goldrate-admin:YOUR_PASSWORD@...` (your connection string)
- Environments: ✅ Production ✅ Preview ✅ Development

**Variable 2:**
- Name: `CRON_SECRET`
- Value: (your generated secret from Step 3.2)
- Environments: ✅ Production ✅ Preview ✅ Development

5. Click **"Save"**

### 5.2: Commit and Push Changes

```bash
cd gdrate-app
git add .
git commit -m "Add MongoDB integration with CRON jobs"
git push origin main
```

### 5.3: Wait for Deployment

- Vercel will automatically deploy
- Check deployment logs for any errors
- Should take ~2-3 minutes

### 5.4: Verify CRON Job

1. In Vercel dashboard, go to **Settings** → **Cron Jobs**
2. You should see:
   - Path: `/api/cron/daily-scrape`
   - Schedule: `0 10 * * *` (Daily at 10:00 AM UTC)
   - Status: **Active**

**Note:** Vercel's free plan only supports **once-daily** cron jobs. For **hourly scraping**, see `CRON_ALTERNATIVES.md` for free alternatives using GitHub Actions.

### 5.5: Manual First Run (Important!)

After deployment, manually trigger scraping to populate the database:

```bash
curl -X POST https://goldmeter.in/api/admin/scrape-and-save \
  -H "Authorization: Bearer YOUR_CRON_SECRET_HERE"
```

This ensures data is available immediately rather than waiting for the first CRON run.

---

## ✅ Step 6: Verify Everything Works

### 6.1: Check Homepage
- Visit https://goldmeter.in
- Rates should display from database
- "Live" badges should show

### 6.2: Check City Pages
- Visit https://goldmeter.in/chennai
- Visit https://goldmeter.in/mumbai
- Etc. - all should show DB data

### 6.3: Check MongoDB
- Go to MongoDB Atlas
- Browse Collections → `goldrate.gold_prices`
- Should see 11 documents with today's date

### 6.4: Check CRON Logs (Within an Hour)
- Go to Vercel Dashboard → Logs
- Filter by `/api/cron/daily-scrape`
- Should see successful runs every hour (at the start of each hour)

---

## 🎯 What's Been Implemented

✅ **MongoDB Atlas Integration**
- Connection utility with dev/prod handling
- Helper functions for save/fetch operations
- Automatic reconnection handling

✅ **Database Operations**
- `saveGoldRates()` - Saves India + all city rates
- `getLatestGoldRates()` - Fetches most recent rates
- `getHistoricalGoldRates()` - For future chart implementation
- Upsert logic (creates or updates based on date + city)

✅ **CRON Job**
- Runs daily at 10:00 AM IST (4:30 AM UTC)
- Automatically scrapes rates
- Saves to MongoDB
- Configured in `vercel.json`

✅ **Manual Trigger Endpoint**
- `/api/admin/scrape-and-save`
- Protected with CRON_SECRET
- For testing and manual updates

✅ **Fallback Strategy**
1. Try MongoDB first
2. Fallback to live scraping
3. Final fallback to mock data

✅ **All Pages Updated**
- Homepage reads from DB
- All 10 city pages read from DB
- Charts still use mock (ready for future enhancement)

---

## 📊 Database Schema

```typescript
Collection: gold_prices

Document Structure:
{
  _id: ObjectId,
  date: ISODate("2025-11-26T00:00:00.000Z"),  // Normalized to start of day
  city: "Chennai",                              // or "India", "Mumbai", etc.
  gold_22k: 59680,                              // Price per 10 grams
  gold_24k: 64890,                              // Price per 10 grams
  source: "GoodReturns",
  created_at: ISODate("2025-11-26T10:30:45.123Z"),
  updated_at: ISODate("2025-11-26T10:30:45.123Z")
}

Indexes:
- { city: 1, date: -1 }  // For fetching latest rates per city
- { date: -1 }           // For date-based queries
```

---

## 🔧 Troubleshooting

### Issue: "MONGODB_URI not defined"
**Solution**: Add environment variable in Vercel and restart deployment

### Issue: "Unauthorized" when calling manual trigger
**Solution**: Make sure Authorization header includes correct CRON_SECRET:
```bash
curl -H "Authorization: Bearer YOUR_SECRET" ...
```

### Issue: No data in MongoDB
**Solution**: Run manual scraping endpoint to populate initially

### Issue: CRON not running
**Solution**: 
1. Check `vercel.json` exists in repo root
2. Verify CRON_SECRET in Vercel env vars
3. Check Vercel Dashboard → Cron Jobs shows the job

### Issue: Website shows mock data
**Solution**:
1. Check MongoDB has data
2. Check MONGODB_URI is correct
3. Check browser console for DB connection errors
4. Run manual scrape to populate DB

---

## 📈 Future Enhancements (Not Yet Implemented)

- [ ] Real historical charts using `getHistoricalGoldRates()`
- [ ] Calculate actual daily price changes
- [ ] Add database indexes for performance
- [ ] Email/Slack notifications on scraping failures
- [ ] Admin dashboard for monitoring
- [ ] Backfill historical data

---

## 🎉 You're Done!

Your GoldRate app now:
1. ✅ Scrapes gold rates daily at 10 AM IST
2. ✅ Stores rates in MongoDB Atlas (kept forever)
3. ✅ Displays rates from database on all pages
4. ✅ Falls back gracefully if DB unavailable
5. ✅ Provides manual trigger for testing

**Next Steps:**
- Monitor CRON logs daily for first week
- Check MongoDB growth (should be ~11 docs/day)
- Consider implementing historical charts next

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Vercel CRON logs
3. Check MongoDB Atlas logs
4. Check browser console errors

**Common Commands:**

```bash
# Test locally
npm run dev

# Build for production (test before deploying)
npm run build

# Start production server locally
npm run start

# Manual scraping test
curl -X POST http://localhost:3000/api/admin/scrape-and-save \
  -H "Authorization: Bearer $CRON_SECRET"
```

Good luck! 🚀

