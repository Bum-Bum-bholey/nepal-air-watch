# 🔍 Frontend Debugging Guide

## Problem: "Missing required parameters: lat, lng, city"

This error means the frontend is calling:
```
GET http://localhost:3001/api/air-quality
```

**Without any parameters!**

The backend expects:
```
GET http://localhost:3001/api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu
```

## 🔧 Solutions

### 1. Clear Browser Cache
- Hard refresh: `Ctrl + F5`
- Or clear browser cache completely
- The frontend might be using old cached code

### 2. Check Browser Console (F12)
Look for the actual request being made:
```
Network tab → Find the API request
```

You should see the URL being called. If it shows:
```
http://localhost:3001/api/air-quality
```
Without parameters → That's the problem!

### 3. Restart Frontend
```bash
# Stop current frontend (Ctrl+C)
npm run dev
```

### 4. Check Backend Console
When you refresh the frontend, you should see in backend console:
```
🔍 Fetching air quality for Kathmandu...
```

If you don't see this, frontend is NOT calling backend properly.

## ✅ Current Status

- ✅ Backend is running on port 3001
- ✅ Backend API works (tested manually)
- ✅ Open-Meteo provider is working
- ⚠️ Frontend needs to refresh to use backend

## 🎯 Next Steps

1. **Hard refresh browser** (Ctrl+F5)
2. **Check browser Network tab** (F12)
3. **Look at backend console** - should see logs when data is fetched
4. **Verify the URL being called** has parameters

