# City Detection Testing Guide

## 🎯 Overview

When running the app locally (development mode), the city auto-detection will automatically use **random test IPs** with **mock geolocation data** to simulate users from different Indian cities. This makes testing the city-specific pages much easier without needing external API calls!

### ✨ Key Features:
- **No external API calls** in development (uses mock data)
- **No SSL certificate issues** 
- **Instant city detection** without rate limits
- **Random city selection** on each page refresh

## 🚀 Default Behavior (Development)

When you visit `http://localhost:3000/` in development:
1. The app detects you're on localhost (IP: `::1` or `127.0.0.1`)
2. **Automatically assigns a random test IP** from one of 10 Indian cities
3. **Uses mock geolocation data** (no external API call)
4. Auto-redirects you to the detected city page

### 🔒 Why Mock Data?
- **Avoids SSL certificate errors** in corporate networks
- **No rate limits** from external geolocation APIs
- **Instant responses** without network delays
- **Works offline** during development

### Test IPs Used:

| City | Test IP | Region |
|------|---------|--------|
| Chennai | `14.142.130.50` | Tamil Nadu |
| Mumbai | `103.21.124.25` | Maharashtra |
| Bangalore | `49.206.32.10` | Karnataka |
| Delhi | `122.160.5.20` | Delhi |
| Hyderabad | `157.33.24.15` | Telangana |
| Coimbatore | `103.25.232.8` | Tamil Nadu |
| Pune | `103.251.43.10` | Maharashtra |
| Kolkata | `103.106.237.5` | West Bengal |
| Ahmedabad | `103.230.104.15` | Gujarat |
| Vijayawada | `117.247.108.20` | Andhra Pradesh |

## 🎲 Testing Options

### Option 1: Random City (Default)
Just visit the homepage - you'll be randomly redirected to a city page:

```
http://localhost:3000/
```

Refresh multiple times to test different cities!

### Option 2: Specific City Test
Want to test a specific city? Use the `testIp` query parameter:

```bash
# Test Chennai
http://localhost:3000/?testIp=14.142.130.50

# Test Mumbai
http://localhost:3000/?testIp=103.21.124.25

# Test Bangalore
http://localhost:3000/?testIp=49.206.32.10
```

### Option 3: Disable Auto-Random (Stay on India Page)
Want to test the India homepage without auto-redirect?

```bash
http://localhost:3000/?noAutoIP=true
```

Or set environment variable in `.env.local`:

```bash
DISABLE_AUTO_TEST_IP=true
```

### Option 4: Fixed Test IP via Environment
Want to always test the same city? Set in `.env.local`:

```bash
# Always test with Mumbai IP
TEST_IP=103.21.124.25
```

## 📝 Console Logs

When testing, check your terminal for helpful logs:

**With Mock Data (Development):**
```
🌍 [Detect-City] API called
🎲 [Detect-City] Randomly selected test city: mumbai (IP: 103.21.124.25)
🏠 [Detect-City] Localhost detected, using random test IP: 103.21.124.25
🧪 [Detect-City] Using MOCK geolocation data (dev mode)
🗺️  [Detect-City] Mock geolocation data: { city: 'mumbai', country: 'IN', region: 'Maharashtra' }
✅ [Detect-City] Matched city: Mumbai (mumbai)
📤 [Detect-City] Response: { "success": true, "detected": true, "city": "Mumbai", "slug": "mumbai" }
✈️  [HomeClient] Redirecting to /mumbai...
```

**With Real API (Custom IP or Production):**
```
🌍 [Detect-City] API called
🌐 [Detect-City] Fetching real geolocation data from ipapi.co...
🗺️  [Detect-City] Geolocation data: { city: 'delhi', country: 'IN', region: 'Delhi' }
✅ [Detect-City] Matched city: Delhi (delhi)
```

## 🌐 Production Behavior

In production (`NODE_ENV=production`):
- Random test IPs are **disabled**
- Only real user IPs are used
- No query parameter overrides work (security)

## 🛠️ Environment Variables

Create `.env.local` file in `gdrate-app/`:

```bash
# Option 1: Always use a specific test IP
TEST_IP=103.21.124.25

# Option 2: Disable auto-random IPs (stay on India page)
DISABLE_AUTO_TEST_IP=true
```

## 🔧 Troubleshooting

**Still seeing India page?**
- Check console logs to see which IP was used
- Verify the city name matches our supported cities list
- The geolocation API might be rate-limited (free tier: 1000 requests/day)
- Clear your session storage: `sessionStorage.clear()` in browser console

**Want to test multiple redirects?**
- Clear session storage between tests: `sessionStorage.removeItem("cityAutoRedirected")`
- Or open in incognito/private window for each test

**IP not being detected as Indian city?**
- Some test IPs might resolve to different locations over time
- Use the `testIp` query parameter with a known working IP
- Check ipapi.co API response in console logs

