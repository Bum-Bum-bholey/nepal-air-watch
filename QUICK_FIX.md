# 🚨 Quick Fix - Get Your App Working NOW

## The Problem

Your frontend is working but can't get data from backend because **backend is not running**.

## The Solution (2 steps, 30 seconds)

### Step 1: Start Backend

**Option A: Double-click the batch file**
```
start-backend.bat
```

**Option B: Manual command (open new terminal)**
```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
```

### Step 2: Verify It Works

Open browser and go to: http://localhost:3001/health

You should see:
```json
{"status":"ok","message":"Nepal Air Watch Backend is running"}
```

✅ **If you see this, backend is working!**

## Now Your Frontend Will Work

- Refresh your frontend page
- Data should now load from backend
- Open browser console (F12) to see requests working

---

## About Open-Meteo Data

**Why the data might seem "incorrect":**

1. **Open-Meteo uses modeling**
   - Nepal has limited monitoring stations
   - Data is estimated using weather models
   - Not 100% accurate for rural areas

2. **Solution: Add API keys**

Create `backend/.env` file:

```env
PORT=3001
OPENWEATHER_API_KEY=your_actual_key_here
WAQI_API_TOKEN=your_actual_token_here
```

### How to Get API Keys:

**OpenWeatherMap (Recommended):**
1. Go to: https://openweathermap.org/api
2. Sign up for free
3. Get API key
4. Add to `.env`

**WAQI (Optional):**
1. Go to: https://aqicn.org/api/
2. Sign up for free
3. Get token
4. Add to `.env`

Then restart backend.

---

## Summary

✅ **Start backend** → Backend runs, data works
✅ **Add API keys** → Better data quality
✅ **Refresh frontend** → See real-time air quality!

Your app is working! Just need the backend running.

