# Nepal Air Watch Backend

Backend API server for Nepal Air Watch with multiple air quality data providers.

## Features

✅ Multiple API providers with fallback support:
1. **OpenWeatherMap** (Primary) - Most reliable, good coverage
2. **WAQI** (Secondary) - World Air Quality Index
3. **Open-Meteo** (Tertiary) - Free, no API key needed
4. **OpenAQ** (Last resort) - Free, community data

✅ Automatic provider fallback
✅ CORS enabled for frontend
✅ Batch endpoint for multiple cities
✅ No CORS issues (server-side fetching)

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure API Keys

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

#### OpenWeatherMap (Recommended)
1. Sign up at https://openweathermap.org/api
2. Get your free API key
3. Add to `.env`:
```
OPENWEATHER_API_KEY=your_key_here
```

#### WAQI (Optional but Recommended)
1. Sign up at https://aqicn.org/api/
2. Get your free token
3. Add to `.env`:
```
WAQI_API_TOKEN=your_token_here
```

#### Open-Meteo (No setup needed)
- Works without API key
- Fallback option

### 3. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on: `http://localhost:3001`

## API Endpoints

### Get Air Quality
```
GET /api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu
```

Response:
```json
{
  "aqi": 145,
  "pm25": 55,
  "pm10": 120,
  "temperature": 22,
  "humidity": 65,
  "windSpeed": 12,
  "provider": "OpenWeather",
  "city": "Kathmandu",
  "coordinates": { "lat": 27.7172, "lng": 85.3240 },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Batch Request (Multiple Cities)
```
POST /api/air-quality/batch
Content-Type: application/json

{
  "locations": [
    { "lat": 27.7172, "lng": 85.3240, "city": "Kathmandu" },
    { "lat": 28.2096, "lng": 83.9856, "city": "Pokhara" }
  ]
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `PORT` | Server port | No (default: 3001) |
| `OPENWEATHER_API_KEY` | OpenWeather API key | Recommended |
| `WAQI_API_TOKEN` | WAQI API token | Optional |

## How It Works

1. **Request received** → Frontend calls backend API
2. **Provider tries** → OpenWeatherMap first (most reliable)
3. **Fallback chain** → If fails, tries WAQI → Open-Meteo → OpenAQ
4. **Data returned** → First successful provider's data
5. **No CORS issues** → All fetch happens server-side

## Provider Priority

1. **OpenWeatherMap** - Best coverage, accurate data
2. **WAQI** - Good global coverage
3. **Open-Meteo** - Free, no key required
4. **OpenAQ** - Community data, last resort

## Troubleshooting

### No API keys configured
- Open-Meteo will be used as fallback (works without key)
- Limited functionality without keys

### API rate limits
- All providers have generous free tiers
- Backend implements proper error handling

### Development
- Server auto-reloads on changes (`npm run dev`)
- Check console for provider logs
- Health check: `GET /health`

## License

MIT - Free to use and modify

