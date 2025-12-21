# Google Search Console Setup Guide

## 🎯 Objective
Get your website indexed by Google and start appearing in search results.

## 📋 Prerequisites
- Domain deployed on Vercel: `https://goldmeter.in`
- Google account
- 15 minutes of time

## 🚀 Step-by-Step Setup

### Step 1: Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Sign in with your Google account
3. Click **"Add Property"**

### Step 2: Add Your Website
**Choose:** URL Prefix
- Enter: `https://goldmeter.in`
- Click **"Continue"**

### Step 3: Verify Ownership

#### Option A: HTML Meta Tag (Recommended for Vercel)

1. Google will show you a meta tag like:
```html
<meta name="google-site-verification" content="YOUR_CODE_HERE" />
```

2. Add it to your `layout.tsx`:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "GoldRate — Daily India Gold Prices & Tools",
  description: "...",
  // Add this:
  verification: {
    google: "YOUR_CODE_HERE", // Just the code, not the full tag
  },
  // ... rest of metadata
};
```

3. Deploy to Vercel:
```bash
git add src/app/layout.tsx
git commit -m "Add Google Search Console verification"
git push origin main
```

4. Wait 1-2 minutes for Vercel deployment
5. Go back to Search Console and click **"Verify"**

#### Option B: DNS Verification (Alternative)

1. Google will give you a TXT record
2. Add it to your domain's DNS settings
3. Wait for DNS propagation (5-30 minutes)
4. Click **"Verify"**

### Step 4: Submit Sitemap

1. In Search Console, go to **"Sitemaps"** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **"Submit"**

**Expected Result:**
```
✅ Sitemap successfully submitted
📊 21 pages discovered
```

### Step 5: Request Indexing (Important!)

1. Go to **"URL Inspection"** (left sidebar)
2. Enter: `https://goldmeter.in`
3. Click **"Request Indexing"**
4. Repeat for important pages:
   - `https://goldmeter.in/chennai`
   - `https://goldmeter.in/mumbai`
   - `https://goldmeter.in/calculator`

**Why:** Speeds up initial indexing from weeks to days.

### Step 6: Set Up Property Settings

1. **Target Country:**
   - Go to Settings → International Targeting
   - Select: India

2. **Preferred Domain:**
   - Already set (HTTPS)

3. **Users & Permissions:**
   - Add team members if needed

## 📊 What to Monitor

### Daily (First Week):
- **Coverage:** Check how many pages are indexed
- **Performance:** See if any search queries are coming in

### Weekly:
- **Coverage Report:** Look for errors
- **Performance:** Track impressions and clicks
- **Enhancements:** Check mobile usability

### Monthly:
- **Search Analytics:** What keywords bring traffic?
- **Page Experience:** Core Web Vitals scores
- **Links:** Who's linking to you?

## 📈 Expected Timeline

| Time | What Happens |
|------|-------------|
| **0-24 hours** | Google discovers your site |
| **1-3 days** | Homepage gets indexed |
| **1-2 weeks** | Most pages indexed |
| **2-4 weeks** | Start appearing for keywords |
| **1-3 months** | Ranking improves, traffic grows |

## 🔍 How to Check If You're Indexed

**Method 1: Direct Search**
```
site:goldmeter.in
```
Enter this in Google - you'll see all indexed pages.

**Method 2: Specific Page**
```
site:goldmeter.in/chennai
```

**Method 3: Search Console**
- Coverage report shows all indexed pages

## ⚠️ Common Issues & Solutions

### Issue: "Page not indexed"
**Solution:** 
- Request indexing manually
- Check robots.txt isn't blocking
- Ensure page loads properly

### Issue: "Crawl errors"
**Solution:**
- Fix broken links
- Ensure sitemap is up to date
- Check for redirect chains

### Issue: "Mobile usability issues"
**Solution:**
- Your site is already mobile-responsive ✅
- Just fix any specific issues reported

## 🎯 Success Criteria

After 2-4 weeks, you should see:

✅ **Coverage:**
- 21+ pages indexed (homepage + 10 cities + tools + news)

✅ **Performance:**
- 100+ impressions per day
- 1-5 clicks per day initially
- Average position < 50

✅ **Enhancements:**
- No mobile usability issues
- Core Web Vitals: All green

## 💡 Pro Tips

1. **Set up email alerts** - Get notified of issues
2. **Link Google Analytics** - See full user journey
3. **Monitor competitors** - Search for same keywords
4. **Update content regularly** - Google loves fresh content
5. **Fix issues quickly** - Check Search Console weekly

## 📝 Next Steps After Setup

1. **Create Google Business Profile** (if applicable)
2. **Submit to Bing Webmaster Tools** (similar process)
3. **Build backlinks** - Get mentioned on other sites
4. **Regular content updates** - News articles, guides
5. **Monitor rankings** - Track keyword positions

## 🆘 Need Help?

**Google's Official Guide:**
https://support.google.com/webmasters/answer/9128668

**Search Console Help Center:**
https://support.google.com/webmasters

**Vercel SEO Docs:**
https://vercel.com/docs/concepts/analytics/web-vitals

---

**Remember:** SEO is a marathon, not a sprint. Consistent updates and quality content win!

