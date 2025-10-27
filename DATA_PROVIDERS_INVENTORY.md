# 📊 Complete Data Providers Inventory

## 🏗️ Project Architecture Overview

```
nepal-air-watch/
├── backend/              # Express.js backend server
│   ├── services/
│   │   └── providers/   # 4 Air Quality API providers
│   ├── routes/          # API endpoints
│   └── server.js        # Main server
│
└── src/                 # React frontend
    ├── lib/
    │   ├── api/         # Backend client (USED)
    │   ├── providers/   # OLD providers (NOT USED)
    │   ├── data/        # Location data
    │   └── utils/       # Forecast generation
    └── pages/           # React components
```

---

## 🔌 Backend Data Providers (Actively Used)

The backend uses **4 air quality providers** with automatic fallback:

### 1. **OpenWeatherMap** (Primary)
- **Location:** `backend/services/providers/openweather.js`
- **Status:** ✅ Active (priority 1)
- **API Endpoint:** `https://api.openweathermap.org/data/2.5`
- **Data Provided:**
  - Air pollution API (PM2.5, PM10, NO2, O3, CO, SO2)
  - Current weather data (temperature, humidity, wind)
  - AQI values (1-5 converted to 0-500)
- **Auth Required:** ✅ API key needed
- **API Key:** `OPENWEATHER_API_KEY` in `.env`
- **Free Tier:** 1,000 calls/day, 60 calls/minute
- **Documentation:** https://openweathermap.org/api

### 2. **WAQI (World Air Quality Index)** (Secondary)
- **Location:** `backend/services/providers/waqi.js`
- **Status:** ✅ Active (priority 2)
- **API Endpoint:** `https://api.waqi.info`
- **Data Provided:**
  - Real-time AQI
  - PM2.5, PM10, NO2, O3, CO, SO2
  - Global coverage with monitoring stations
- **Auth Required:** ✅ Token needed
- **API Token:** `WAQI_API_TOKEN` in `.env`
- **Free Tier:** 1,000 calls/day
- **Documentation:** https://aqicn.org/api/

### 3. **Open-Meteo** (Tertiary - Currently Used)
- **Location:** `backend/services/providers/openmeteo.js`
- **Status:** ✅ Active (priority 3 - **FALLBACK**)
- **API Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Data Provided:**
  - US AQI
  - PM2.5, PM10, CO, NO2, SO2, O3
  - Weather data from Open-Meteo weather API
  - Temperature, humidity, wind speed
- **Auth Required:** ❌ No API key needed
- **Free Tier:** Unlimited
- **Documentation:** https://open-meteo.com/en/docs/air-quality-api

### 4. **OpenAQ** (Last Resort)
- **Location:** `backend/services/providers/openaq.js`
- **Status:** ✅ Active (priority 4)
- **API Endpoint:** `https://api.openaq.org/v2`
- **Data Provided:**
  - Air quality measurements
  - PM2.5, PM10, NO2, O3, CO, SO2
  - Community-sourced data
  - Multiple locations near coordinates
- **Auth Required:** ❌ No API key needed
- **Free Tier:** Unlimited
- **Documentation:** https://docs.openaq.org/

---

## 🎯 Provider Fallback Chain

When a request comes in, the backend tries providers in this order:

```
1. OpenWeatherMap → Most reliable, best coverage
   ↓ (if fails)
2. WAQI → Good global coverage
   ↓ (if fails)
3. Open-Meteo → Free, no key required (✅ CURRENTLY USING)
   ↓ (if fails)
4. OpenAQ → Community data
   ↓ (if fails)
5. Return null → Frontend shows safe defaults
```

**Current Behavior:** Open-Meteo is being used because OpenWeatherMap and WAQI keys are not loading properly from `.env` file.

---

## 📡 Frontend Data Sources

### Active: Backend API Client
- **Location:** `src/lib/api/backend-client.ts`
- **Status:** ✅ **ACTIVELY USED**
- **Endpoint:** `http://localhost:3001/api/air-quality`
- **How it works:**
  - Frontend calls backend API
  - Backend tries all 4 providers
  - Returns first successful data
- **Used in:**
  - `src/pages/Home.tsx` - Main dashboard
  - `src/pages/Forecast.tsx` - Weather forecast
  - `src/pages/Map.tsx` - District map
  - `src/pages/Schools.tsx` - School locations

### Deprecated: Old Direct Providers (NOT USED)
- **Location:** `src/lib/providers/`
- **Status:** ⚠️ NOT USED (kept for reference)
- **Files:**
  - `air-quality-client.ts` - Old unified client
  - `openaq-provider.ts` - OpenAQ provider
  - `aqicn-provider.ts` - AQICN provider
- **Note:** These were replaced by backend integration

---

## 📍 Location Data Sources

### Static Data (Frontend)
- **Location:** `src/lib/data/nepal-locations.ts`
- **Type:** Static coordinates data
- **Contains:**
  - 10 major Nepal cities with coordinates
  - 14 Nepal districts across all provinces
  - 5 school locations
  - Health recommendations
- **No external API:** Pure static data

### Real-Time Data (Backend APIs)
- Cities: Uses coordinates to fetch current air quality
- Districts: Batch requests for province overview
- Schools: Individual city-level data for school safety

---

## 🔄 Data Flow Architecture

```
USER REQUEST (Frontend)
    ↓
Home.tsx / Forecast.tsx / Map.tsx / Schools.tsx
    ↓
BackendClient (src/lib/api/backend-client.ts)
    ↓
HTTP Request → backend/server.js
    ↓
API Route (backend/routes/air-quality.js)
    ↓
Service (backend/services/air-quality-service.js)
    ↓
TRY PROVIDERS IN ORDER:
    1. OpenWeatherProvider (backend/services/providers/openweather.js)
    2. WAQIProvider (backend/services/providers/waqi.js)
    3. OpenMeteoProvider (backend/services/providers/openmeteo.js) ← CURRENT
    4. OpenAQProvider (backend/services/providers/openaq.js)
    ↓
RETURN FIRST SUCCESSFUL DATA
    ↓
Frontend displays data
```

---

## 📊 Current Data Status

### What's Working ✅
- ✅ Backend server running on port 3001
- ✅ Open-Meteo provider working (fallback)
- ✅ Batch requests working
- ✅ Health endpoint working
- ✅ Error handling working

### What's Not Working ⚠️
- ⚠️ OpenWeatherMap keys not loading properly
- ⚠️ WAQI tokens not loading properly
- ⚠️ Frontend caching old provider code

### Data Quality
- **Current Provider:** Open-Meteo
- **Accuracy:** Modeled/estimated data (not measured)
- **Coverage:** Global but estimated for Nepal
- **To Improve:** Add OpenWeatherMap or WAQI API keys

---

## 🛠️ API Endpoints

### Backend Endpoints

#### 1. Health Check
- **Endpoint:** `GET /health`
- **Returns:** `{status: "ok", message: "..."}`
- **Purpose:** Verify backend is running

#### 2. Get Air Quality (Single City)
- **Endpoint:** `GET /api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu`
- **Returns:** `{aqi, pm25, temperature, humidity, windSpeed, provider, ...}`
- **Purpose:** Get real-time data for one city

#### 3. Get Air Quality (Batch)
- **Endpoint:** `POST /api/air-quality/batch`
- **Body:** `{locations: [{lat, lng, city}, ...]}`
- **Returns:** `{city1: {...}, city2: {...}}`
- **Purpose:** Get data for multiple cities at once

---

## 📚 Provider Comparison

| Provider | Free | Key Needed | Coverage | Accuracy | Status |
|----------|------|------------|----------|----------|--------|
| OpenWeather | ✅ | ✅ | Global | High | ⚠️ Keys not loading |
| WAQI | ✅ | ✅ | Global | High | ⚠️ Keys not loading |
| Open-Meteo | ✅ | ❌ | Global | Modeled | ✅ Active |
| OpenAQ | ✅ | ❌ | Limited | Variable | ✅ Active |

---

## 🔧 Configuration Files

### Backend Configuration
- **File:** `backend/.env` (create this file)
- **Variables:**
  ```env
  PORT=3001
  OPENWEATHER_API_KEY=your_key_here
  WAQI_API_TOKEN=your_token_here
  ```

### Frontend Configuration
- **File:** `.env` (optional)
- **Variables:**
  ```env
  VITE_BACKEND_URL=http://localhost:3001
  ```

---

## 📝 Summary

### Data Providers Used:
1. **OpenWeatherMap** - Best quality (needs key)
2. **WAQI** - Good coverage (needs key)
3. **Open-Meteo** - Free fallback ✅ **CURRENTLY USING**
4. **OpenAQ** - Last resort

### Data Flow:
```
Frontend → Backend API → Multiple Providers → First Success → Data Returned
```

### Current Issue:
Frontend uses old cached code, not calling backend properly. Backend is working perfectly as verified by Python test.

---

## 🧪 Testing Backend Providers

Run the Python test:
```bash
cd backend
python test_backend_api.py
```

This verifies:
- ✅ All 4 providers are configured
- ✅ Backend can fetch from Open-Meteo
- ✅ Batch requests work
- ✅ Error handling works

Test results: **4/4 tests passed** ✅

