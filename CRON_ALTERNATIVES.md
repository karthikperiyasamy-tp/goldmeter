# 🕐 Cron Job Alternatives for Free Hourly Scraping

## 🚨 Issue: Vercel Free Tier Limitations

Vercel's **Hobby (free) plan** has these restrictions:
- ❌ Only **2 cron jobs** per account
- ❌ Runs **once per day** (no hourly execution)
- ❌ Flexible **1-hour window** (not guaranteed exact time)

**Solution:** Use external cron services to trigger the scraping endpoint.

---

## ✅ Recommended: GitHub Actions (FREE)

### Pros:
- ✅ **2,000 free minutes/month**
- ✅ Reliable and maintained by GitHub
- ✅ Easy monitoring via Actions tab
- ✅ Manual trigger available
- ✅ Works with public/private repos

### Setup:

**Step 1: Already Created!**
The file `.github/workflows/scrape-gold-rates.yml` is already in your repo.

**Step 2: Add Secret to GitHub**
1. Go to: https://github.com/karthikperiyasamy-tp/goldmeter/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `CRON_SECRET`
4. Value: `6iYV2B4qbvckF2XC10ssjuCYERYW/dbmoH/l9vzhRKo=`
5. Click **"Add secret"**

**Step 3: Push to GitHub**
```bash
cd gdrate-app
git add .
git commit -m "Add GitHub Actions for hourly scraping (free alternative)"
git push origin main
```

**Step 4: Verify**
1. Go to your repo → **Actions** tab
2. You should see **"Hourly Gold Rate Scraping"** workflow
3. Click **"Run workflow"** to test manually
4. Check the logs

**Step 5: Monitor**
- Workflow runs automatically every hour at minute 0
- Check **Actions** tab for execution history
- Green checkmark = success, red X = failure

### Schedule:
- Runs: **Every hour** (`0 * * * *`)
- Times: 00:00, 01:00, 02:00, ..., 23:00 UTC

---

## 🔄 Alternative Options

### **Option 2: Cron-job.org** (Free)

**Free Tier:**
- 50 cron jobs
- 1-minute minimum interval
- Web-based dashboard

**Setup:**
1. Sign up: https://cron-job.org/en/signup
2. Create New Cron Job:
   - Title: `Gold Rate Scraping`
   - URL: `https://goldmeter.in/api/admin/scrape-and-save`
   - Schedule: `0 * * * *` (every hour)
   - Request Method: **POST**
   - Custom Headers:
     ```
     Authorization: Bearer 6iYV2B4qbvckF2XC10ssjuCYERYW/dbmoH/l9vzhRKo=
     Content-Type: application/json
     ```
3. Save & Enable

**Monitoring:**
- Dashboard shows last execution time and status
- Email notifications on failure (optional)

---

### **Option 3: EasyCron** (Free Tier)

**Free Tier:**
- 10 cron jobs
- Hourly execution
- Email notifications

**Setup:**
1. Sign up: https://www.easycron.com/user/register
2. Add Cron Job:
   - URL: `https://goldmeter.in/api/admin/scrape-and-save`
   - Cron Expression: `0 * * * *`
   - HTTP Method: POST
   - HTTP Headers: Add authorization header
3. Enable

---

### **Option 4: Upstash QStash** (Free Tier)

**Free Tier:**
- 500 requests/day (enough for hourly = 24/day)
- Serverless scheduling

**Setup:**
1. Sign up: https://console.upstash.com/
2. Create QStash schedule
3. Configure endpoint and schedule

---

### **Option 5: Keep Vercel Daily + Manual Triggers**

**Strategy:**
- Use Vercel's free daily cron (once per day at 10 AM UTC)
- Manual triggers for immediate updates when needed

**Setup:**
Already configured in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/daily-scrape",
    "schedule": "0 10 * * *"
  }]
}
```

**Manual Trigger Command:**
```bash
curl -X POST https://goldmeter.in/api/admin/scrape-and-save \
  -H "Authorization: Bearer 6iYV2B4qbvckF2XC10ssjuCYERYW/dbmoH/l9vzhRKo="
```

---

## 📊 Comparison Table

| Service        | Free Tier      | Minimum Interval | Reliability | Setup Difficulty |
|----------------|----------------|------------------|-------------|------------------|
| GitHub Actions | 2,000 min/mo   | 5 minutes        | ⭐⭐⭐⭐⭐    | Easy             |
| Cron-job.org   | 50 jobs        | 1 minute         | ⭐⭐⭐⭐      | Very Easy        |
| EasyCron       | 10 jobs        | 1 hour           | ⭐⭐⭐⭐      | Very Easy        |
| Upstash QStash | 500 req/day    | Real-time        | ⭐⭐⭐⭐⭐    | Medium           |
| Vercel Hobby   | 2 jobs, daily  | 1 day            | ⭐⭐⭐⭐      | Easy             |

---

## 🎯 Our Recommendation

### **For You: GitHub Actions**

**Why:**
1. ✅ **Free forever** (with generous limits)
2. ✅ **Already integrated** with your repo
3. ✅ **No third-party dependencies**
4. ✅ **Easy monitoring** via GitHub UI
5. ✅ **Manual trigger** for testing
6. ✅ **Version controlled** (workflow in repo)

**How it works:**
```
GitHub Actions (every hour)
    ↓
Calls: POST https://goldmeter.in/api/admin/scrape-and-save
    ↓
Your Vercel endpoint scrapes gold rates
    ↓
Saves to MongoDB Atlas
```

---

## 🚀 Quick Start (Recommended Path)

### Using GitHub Actions:

```bash
# 1. Already done - workflow file created

# 2. Add secret to GitHub repo settings
# (Go to repo → Settings → Secrets → New secret)
# Name: CRON_SECRET
# Value: 6iYV2B4qbvckF2XC10ssjuCYERYW/dbmoH/l9vzhRKo=

# 3. Push changes
cd gdrate-app
git add .
git commit -m "Add GitHub Actions for hourly scraping"
git push origin main

# 4. Test manually
# Go to GitHub repo → Actions → Hourly Gold Rate Scraping → Run workflow

# 5. Verify MongoDB
# Check MongoDB Atlas → Browse Collections → should see new data
```

---

## 📝 Current Configuration

**Vercel Cron (vercel.json):**
- Schedule: `0 10 * * *` (Daily at 10:00 AM UTC)
- This is the free tier fallback

**GitHub Actions (recommended):**
- Schedule: `0 * * * *` (Every hour)
- File: `.github/workflows/scrape-gold-rates.yml`

---

## 🔧 Troubleshooting

### GitHub Actions Not Running?

1. **Check Secret:**
   - Repo → Settings → Secrets → Verify `CRON_SECRET` exists

2. **Check Workflow:**
   - Actions tab → Click workflow → View logs

3. **Check Permissions:**
   - Repo → Settings → Actions → General
   - Enable "Allow all actions and reusable workflows"

### Still Getting Errors?

Check the endpoint manually:
```bash
curl -X POST https://goldmeter.in/api/admin/scrape-and-save \
  -H "Authorization: Bearer 6iYV2B4qbvckF2XC10ssjuCYERYW/dbmoH/l9vzhRKo=" \
  -v
```

Expected response:
```json
{
  "success": true,
  "message": "Rates scraped and saved successfully",
  "saved": 11
}
```

---

## 💰 Cost Analysis

### Current Solution (Free):
- GitHub Actions: **$0/month**
- Vercel Hobby: **$0/month**
- MongoDB Atlas (M0): **$0/month**
- **Total: $0/month**

### If Upgrading to Vercel Pro:
- Vercel Pro: **$20/month**
- Benefit: Native cron jobs, better performance
- Recommended if: App generates revenue

---

## 📈 Future Scaling

When your app grows:

1. **Keep free tier** with GitHub Actions ✅
2. **Upgrade to Vercel Pro** ($20/mo) for better cron
3. **Use both** - Vercel cron + GitHub Actions backup

---

## ✅ Summary

**Immediate Action:**
1. Add `CRON_SECRET` to GitHub repo secrets
2. Push the GitHub Actions workflow
3. Test by clicking "Run workflow" in Actions tab

**Result:**
- ✅ Hourly scraping for free
- ✅ No third-party dependencies
- ✅ Easy monitoring via GitHub
- ✅ Fallback: Vercel daily cron

🎉 **You're all set for free hourly scraping!**

