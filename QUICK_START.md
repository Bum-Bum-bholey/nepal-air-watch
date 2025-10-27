# 🚀 Quick Start - Nepal Air Watch

Get your air quality monitoring app running in 5 minutes!

## ⚡ Fast Setup

### 1️⃣ Start Backend

```bash
cd backend
npm install
copy env.example.txt .env   # Windows
# cp env.example.txt .env   # Mac/Linux

# Edit .env and add your API keys (or skip for now, Open-Meteo will work)
# Then start:
npm run dev
```

Backend running on: `http://localhost:3001` ✅

### 2️⃣ Start Frontend (new terminal)

```bash
# Go back to project root
cd ..
npm install
npm run dev
```

Frontend running on: `http://localhost:5173` ✅

### 3️⃣ Open Browser

Navigate to: `http://localhost:5173`

🎉 **You're done!** The app is running with real air quality data.

## 📝 Optional: Add API Keys (Recommended)

### OpenWeatherMap (Best Results)

1. Sign up at https://openweathermap.org/api
2. Get your free API key
3. Add to `backend/.env`:
```
OPENWEATHER_API_KEY=your_key_here
```
4. Restart backend

**Why?** Better data quality and coverage.

## 🌟 What You Get

- ✅ Real-time air quality data
- ✅ Multiple providers with fallback
- ✅ No CORS issues (backend handles it)
- ✅ Auto-refresh every 5 minutes
- ✅ All Nepal cities
- ✅ Weather data (temp, humidity, wind)
- ✅ Health recommendations

## 🐛 Troubleshooting

**Backend won't start?**
- Run `cd backend && npm install`

**No data showing?**
- Check backend console for errors
- Visit `http://localhost:3001/health`
- Open-Meteo works without API keys

**CORS errors?**
- Make sure backend is running
- Check backend console logs

## 📖 Detailed Docs

See `SETUP_GUIDE.md` for complete setup instructions.

## 🎯 Next Steps

1. **Add more cities** - Edit `src/lib/data/nepal-locations.ts`
2. **Customize UI** - Edit components in `src/components/`
3. **Deploy** - See deployment instructions
4. **Add features** - Forecasts, alerts, etc.

## 💡 Pro Tips

- Backend logs show which provider is used
- Open-Meteo works without any API keys
- Add OpenWeather key for best results
- Check backend console for API status

---

**That's it!** Your air quality monitoring app is ready. 🎉

