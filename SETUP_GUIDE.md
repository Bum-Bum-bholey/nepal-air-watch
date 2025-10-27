# Complete Setup Guide - Nepal Air Watch with Backend

## 🎯 Overview

You now have a complete client-server architecture:
- **Frontend**: React + Vite (client-side)
- **Backend**: Express.js server (Node.js)
- **APIs**: Multiple air quality providers with fallback

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn
- API keys (for best experience)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
copy env.example.txt .env
# On Mac/Linux: cp env.example.txt .env

# Edit .env and add your API keys
# (See "API Keys Setup" section below)

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:3001`

### 2. Frontend Setup

```bash
# Open new terminal, go to project root
cd ..  # or wherever your project root is

# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev
```

Frontend will run on: `http://localhost:5173` (or similar)

## 🔑 API Keys Setup

### OpenWeatherMap (Recommended - Primary)

1. Go to https://openweathermap.org/api
2. Click "Subscribe" to free tier
3. Sign up / Log in
4. Go to API Keys section
5. Copy your API key
6. Add to `backend/.env`:
```
OPENWEATHER_API_KEY=your_key_here
```

**Free tier**: 1,000 calls/day, 60 calls/minute

### WAQI (Optional - Secondary)

1. Go to https://aqicn.org/api/
2. Sign up for free account
3. Get your token
4. Add to `backend/.env`:
```
WAQI_API_TOKEN=your_token_here
```

**Free tier**: 1000 calls/day

### Open-Meteo (No Setup Required!)

- Works without API key
- Automatic fallback
- Free and unlimited

## 📁 Project Structure

```
nepal-air-watch/
├── backend/                 # Express.js backend
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   │   └── air-quality.js
│   ├── services/           # Business logic
│   │   ├── air-quality-service.js
│   │   └── providers/     # API providers
│   │       ├── openweather.js
│   │       ├── waqi.js
│   │       ├── openmeteo.js
│   │       └── openaq.js
│   ├── package.json
│   └── .env               # API keys (create this)
│
├── src/                    # Frontend (React)
│   ├── pages/             # Page components
│   ├── components/        # UI components
│   ├── lib/
│   │   ├── api/          # Backend client
│   │   ├── data/         # Location data
│   │   └── types/        # TypeScript types
│
└── package.json           # Frontend dependencies
```

## 🌐 API Endpoints

### Get Air Quality
```
GET /api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu
```

### Batch Request
```
POST /api/air-quality/batch
Body: { locations: [...] }
```

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server port
PORT=3001

# OpenWeatherMap API key (recommended)
OPENWEATHER_API_KEY=your_key_here

# WAQI API token (optional)
WAQI_API_TOKEN=your_token_here
```

### Frontend Configuration (Optional)

Create `.env` in project root:

```env
# Backend URL (default: http://localhost:3001)
VITE_BACKEND_URL=http://localhost:3001
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

### Production Build

**Build frontend:**
```bash
npm run build
```

**Build output:** `dist/` folder

**Run backend (production):**
```bash
cd backend
npm start
```

## 🔄 Provider Priority

The system tries providers in this order:

1. **OpenWeatherMap** (if API key configured)
2. **WAQI** (if token configured)
3. **Open-Meteo** (always available)
4. **OpenAQ** (fallback)

**Why this order?**
- OpenWeather has best coverage and accuracy
- WAQI has good global data
- Open-Meteo is free and reliable
- OpenAQ is community data (less consistent)

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

Check console for port conflicts or missing dependencies.

### "Cannot connect to backend"
1. Make sure backend is running on port 3001
2. Check `backend/.env` is configured
3. Visit http://localhost:3001/health to test backend

### No API data showing
1. Check you've added API keys to `backend/.env`
2. Open-Meteo works without keys (fallback)
3. Check backend console for API errors
4. Verify coordinates are correct

### CORS errors
- Backend automatically handles CORS
- Frontend should work without CORS issues
- If you see CORS errors, backend isn't running

## 📝 Development Tips

### Backend Logs
Watch backend console for:
- `✅ Got data from OpenWeatherMap for Kathmandu`
- `⚠️ OpenWeather failed, trying WAQI...`
- Provider status and errors

### Testing APIs
Use curl or Postman to test backend:

```bash
curl "http://localhost:3001/api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu"
```

### Debug Mode
Backend runs in watch mode (`npm run dev`):
- Auto-reloads on file changes
- Logs all API calls
- Shows which provider succeeded

## 🎉 Success!

If you see data loading, you're all set!

**What's working:**
- ✅ Backend server running
- ✅ Multiple API providers configured
- ✅ Frontend connecting to backend
- ✅ Real air quality data showing
- ✅ No CORS issues
- ✅ Automatic fallback between providers

**Next steps:**
- Add more cities to monitor
- Customize the UI
- Deploy to production

## 📚 API Provider Links

- OpenWeatherMap: https://openweathermap.org/api
- WAQI: https://aqicn.org/api/
- Open-Meteo: https://open-meteo.com/en/docs
- OpenAQ: https://docs.openaq.org/

## 💡 Notes

- **Free tiers are generous** - won't hit limits for personal use
- **Backend required** - No CORS issues, better security
- **API keys stored server-side** - More secure than client-side
- **Graceful fallbacks** - App works even if some APIs fail
- **Open-Meteo always works** - No keys needed

Happy coding! 🌬️

