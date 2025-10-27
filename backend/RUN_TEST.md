# 🧪 Backend API Test Instructions

## Quick Test (Python)

### Requirements
- Python 3.x installed
- `requests` library

### Install requests (if needed):
```bash
pip install requests
```

### Run the test:
```bash
cd backend
python test_backend_api.py
```

This will test:
1. ✅ Health endpoint
2. ✅ Single city fetch (Kathmandu)
3. ✅ Batch fetch (multiple cities)
4. ✅ Error handling

## What the Test Does

The Python script will:
- Test if backend is running
- Fetch real air quality data for Kathmandu
- Test batch API with multiple cities
- Verify error handling works
- Show which API provider is being used (OpenWeather, WAQI, Open-Meteo, etc.)

## Expected Output

If backend is working:
```
🧪 BACKEND API TEST SUITE
============================================================
Backend URL: http://localhost:3001

1️⃣ Testing Health Endpoint
Status Code: 200
Response: {"status":"ok","message":"Nepal Air Watch Backend is running"}
✅ Health check passed!

2️⃣ Testing Single City Fetch (Kathmandu)
Status Code: 200
✅ Success! Data received:
   Provider: Open-Meteo
   AQI: 130
   PM2.5: 64
   Temperature: 16°C
   Humidity: 87%
   Wind Speed: 2 km/h

📊 TEST SUMMARY
   Health Check: ✅ PASSED
   Single City Fetch: ✅ PASSED
   Batch Fetch: ✅ PASSED
   Error Handling: ✅ PASSED

🎉 All tests passed! Backend is working correctly!
```

## If Test Fails

**Error: "Cannot connect to backend"**
→ Backend is not running. Start it:
```bash
cd backend
npm run dev
```

**Error: "400 Bad Request"**
→ Check backend console for errors
→ Verify .env file has correct API keys

**Error: "Timeout"**
→ API calls are taking too long
→ Check internet connection
→ Some APIs might be rate-limited

## Manual Testing

You can also test manually in browser or with curl:

### Health Check
```bash
curl http://localhost:3001/health
```

### Single City
```bash
curl "http://localhost:3001/api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu"
```

### Batch (with PowerShell)
```powershell
$body = @{
    locations = @(
        @{lat=27.7172; lng=85.3240; city='Kathmandu'},
        @{lat=28.2096; lng=83.9856; city='Pokhara'}
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3001/api/air-quality/batch" -Method POST -Body $body -ContentType "application/json"
```

## Troubleshooting

### Backend Not Running
```bash
cd backend
npm install
npm run dev
```

### Python Requests Not Installed
```bash
pip install requests
```

### Port Already in Use
Change PORT in `backend/.env` and restart

