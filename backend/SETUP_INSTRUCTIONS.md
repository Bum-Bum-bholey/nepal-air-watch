# Backend Setup Instructions

## Step 1: Create .env file

Create a file named `.env` in the `backend` folder with this content:

```env
PORT=3001

# OpenWeatherMap API Key (Get free at https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_key_here

# WAQI API Token (Optional, get free at https://aqicn.org/api/)
WAQI_API_TOKEN=your_token_here
```

**Important:** Replace `your_key_here` and `your_token_here` with your actual API keys!

## Step 2: Check if backend is running

Open a new terminal and run:
```bash
cd backend
node server.js
```

You should see:
```
🚀 Server running on http://localhost:3001
📍 API endpoint: http://localhost:3001/api/air-quality
```

## Step 3: Test the backend

Visit: http://localhost:3001/health

You should see:
```json
{
  "status": "ok",
  "message": "Nepal Air Watch Backend is running"
}
```

## Step 4: Check if API keys are loading

Look at the backend console when fetching data. You should see:
- `🔍 Fetching air quality for Kathmandu...`
- `✅ Got data from OpenWeatherMap for Kathmandu` (if API key is set)
- OR `⚠️ OpenWeatherMap failed...` if no key
- OR `✅ Got data from Open-Meteo for Kathmandu` (fallback)

## Troubleshooting

### "OpenWeather API key not set"
→ You need to create `.env` file with your API key

### "Cannot connect to backend"
→ Make sure backend is running on port 3001
→ Check if frontend is pointing to correct backend URL

### Backend not starting
1. Make sure you're in `backend` folder
2. Run `npm install` first
3. Check for errors in console

## How to get API keys

### OpenWeatherMap (Best results)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's free)
3. Complete registration
4. Go to "API Keys" section
5. Copy your key
6. Add to `.env`: `OPENWEATHER_API_KEY=abc123...`

### WAQI (Optional)
1. Go to https://aqicn.org/api/
2. Sign up for free
3. Get your token
4. Add to `.env`: `WAQI_API_TOKEN=xyz789...`

### Open-Meteo (No key needed!)
- Works without any API key
- Already configured
- Will be used as fallback

