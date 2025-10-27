# 🔧 Troubleshooting Guide

## Problem: Frontend not getting data from backend

### Quick Diagnosis

1. **Is the backend running?**
   - Open browser and go to: http://localhost:3001/health
   - If you see an error, backend is NOT running
   - If you see `{status: "ok"}`, backend IS running ✅

2. **Check frontend console:**
   - Open browser console (F12)
   - Look for errors like "Failed to fetch" or "Network error"
   - This means frontend can't reach backend

### Solution: Start the Backend

#### Step 1: Open a NEW terminal

**Terminal 1 - Backend:**

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📍 API endpoint: http://localhost:3001/api/air-quality
```

#### Step 2: In ANOTHER terminal - Start frontend

**Terminal 2 - Frontend:**

```bash
# Go back to project root
cd ..
npm run dev
```

#### Step 3: Check both are running

- Backend: http://localhost:3001/health ✅
- Frontend: http://localhost:8080 or similar ✅

---

## Problem: Open-Meteo data seems incorrect

Open-Meteo provides **realistic estimated data** based on:
- Weather models
- Satellite data
- Nearby monitoring stations (when available)

**Why it might seem "wrong":**
- Nepal has limited actual monitoring stations
- Open-Meteo uses estimation for areas without stations
- Data is modeled, not measured

### Solutions:

1. **Use OpenWeatherMap instead (more accurate)**
   - Sign up: https://openweathermap.org/api
   - Get free API key
   - Create `backend/.env` file:
   ```
   PORT=3001
   OPENWEATHER_API_KEY=your_key_here
   ```
   - Restart backend

2. **Check actual Nepal monitoring stations**
   - Many areas don't have real sensors
   - Data will be estimated/modeled
   - OpenWeather has better coverage

3. **Add WAQI for better coverage**
   - Sign up: https://aqicn.org/api/
   - Get free token
   - Add to `.env`:
   ```
   WAQI_API_TOKEN=your_token_here
   ```
   - Restart backend

---

## Problem: "OpenWeather API key not set"

### Fix:
1. Create `backend/.env` file
2. Add your API key:
   ```
   OPENWEATHER_API_KEY=abc123xyz...
   ```
3. Restart backend server

---

## Problem: CORS errors in frontend

If you see:
```
Access to fetch at 'http://localhost:3001/...' has been blocked by CORS policy
```

**Solution:**
1. Backend has CORS enabled ✅
2. Make sure backend is running
3. Check that frontend is calling correct backend URL
4. Frontend URL: `http://localhost:8080` (or similar)
5. Backend URL: `http://localhost:3001`

---

## Problem: Backend not starting

### Error: "Cannot find module"
```bash
cd backend
npm install
npm run dev
```

### Error: "EADDRINUSE" (Port already in use)
- Another process is using port 3001
- Kill that process or change PORT in `.env`

### Error: "dotenv not found"
```bash
cd backend
npm install
```

---

## Verify Everything is Working

### Test 1: Backend Health
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok",...}`

### Test 2: Backend API
```bash
curl "http://localhost:3001/api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu"
```
Should return JSON with air quality data

### Test 3: Backend Console
When fetching data, backend console should show:
```
🔍 Fetching air quality for Kathmandu...
✅ Got data from OpenWeatherMap for Kathmandu
```
OR
```
⚠️ OpenWeatherMap failed...
🔄 Trying WAQI...
✅ Got data from WAQI for Kathmandu
```
OR
```
⚠️ OpenWeatherMap failed...
⚠️ WAQI failed...
🔄 Trying Open-Meteo...
✅ Got data from Open-Meteo for Kathmandu
```

---

## Still Having Issues?

1. Check terminal running backend for errors
2. Check browser console for frontend errors  
3. Verify `.env` file exists in `backend` folder
4. Make sure API keys are correct (no extra spaces)
5. Restart both backend and frontend

Need more help? Check:
- `backend/README.md` - Backend documentation
- `SETUP_GUIDE.md` - Complete setup guide
- `backend/SETUP_INSTRUCTIONS.md` - API key setup

