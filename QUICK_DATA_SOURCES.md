# 🎯 Quick Reference - Data Sources Used

## Currently Active Data Sources

### ✅ Backend Providers (Server-Side)
```
backend/services/providers/
├── openweather.js     ← Priority 1 (needs key)
├── waqi.js            ← Priority 2 (needs key)  
├── openmeteo.js       ← Priority 3 (CURRENT - working!)
└── openaq.js          ← Priority 4 (last resort)
```

### ✅ Frontend Client
```
src/lib/api/
└── backend-client.ts  ← USED BY ALL PAGES
```

### 📍 Static Data
```
src/lib/data/
└── nepal-locations.ts ← Cities, districts, schools
```

### ❌ Old Providers (NOT USED)
```
src/lib/providers/
├── air-quality-client.ts  ← DEPRECATED
├── openaq-provider.ts     ← DEPRECATED
└── aqicn-provider.ts      ← DEPRECATED
```

---

## How It Works NOW

```
Frontend Pages
    ↓
backend-client.ts (calls backend API)
    ↓
Backend Server (localhost:3001)
    ↓
Tries OpenWeather → Fails (no key)
    ↓
Tries WAQI → Fails (no key)
    ↓
Tries Open-Meteo → SUCCESS! ✅
    ↓
Returns data to frontend
```

---

## Current Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Working |
| OpenWeatherMap | ⚠️ Keys not loading |
| WAQI | ⚠️ Keys not loading |
| Open-Meteo | ✅ ACTIVE |
| OpenAQ | ✅ Available |
| Frontend | ⚠️ Needs refresh |

---

## Quick Fix

**To use better data providers:**

1. Stop backend
2. Create `backend/.env` file
3. Add keys:
   ```
   OPENWEATHER_API_KEY=your_key
   WAQI_API_TOKEN=your_token
   ```
4. Restart backend
5. Refresh frontend

**That's it!**

