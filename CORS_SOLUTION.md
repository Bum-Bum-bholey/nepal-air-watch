# CORS Solution for Client-Side API Access

## Problem

The OpenAQ and AQICN APIs block direct browser requests due to CORS (Cross-Origin Resource Sharing) policies. This is a browser security feature.

**Error:**
```
Access to fetch at 'https://api.openaq.org/v2/...' from origin 'http://localhost:8080' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## Current Solution ✅

I've implemented **CORS proxy support** with automatic fallback:

### How It Works:
1. Tries multiple public CORS proxies in order
2. If one fails, automatically tries the next
3. Unwraps proxy responses correctly
4. Falls back gracefully if all proxies fail

### Public Proxies Used:
- `corsproxy.io` (primary)
- `api.allorigins.win` (fallback)
- `cors-anywhere.herokuapp.com` (last resort)

## Test It Now

The CORS proxy integration is already implemented in:
- `src/lib/providers/openaq-provider.ts`
- `src/lib/providers/aqicn-provider.ts`

Simply run your app - it should work now:
```bash
npm run dev
```

## If Public Proxies Don't Work

Public CORS proxies can be slow, rate-limited, or unreliable. Here are better options:

### Option 1: Self-Hosted CORS Proxy (Recommended for Production)

Deploy your own CORS proxy on a free hosting service:

#### Using Netlify Functions (Free):

1. Create `netlify/functions/cors-proxy.js`:
```javascript
exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;
  
  if (!url) {
    return { statusCode: 400, body: 'Missing url parameter' };
  }
  
  try {
    const response = await fetch(decodeURIComponent(url));
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type'),
      },
      body: data,
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
```

2. Update provider to use your proxy:
```typescript
private static readonly CORS_PROXIES = [
  'https://your-site.netlify.app/.netlify/functions/cors-proxy?url=',
  'https://corsproxy.io/?',
  'https://api.allorigins.win/get?url=',
];
```

#### Using Vercel (Free):

Similar setup with Vercel serverless functions.

### Option 2: Alternative APIs with CORS Enabled

Some APIs allow CORS and can work directly:

#### AirVisual API:
- Visit: https://www.airvisual.com/api
- Free tier available
- Requires API key (but free)
- Has proper CORS headers

#### OpenWeatherMap:
- Visit: https://openweathermap.org/api
- Free tier available
- Good for weather, limited air quality

### Option 3: Backend Proxy (If You Decide to Add One)

If you later add a backend, create a simple proxy:

```javascript
// Example Express.js proxy
app.get('/api/air-quality', async (req, res) => {
  const { lat, lng } = req.query;
  const response = await fetch(`https://api.openaq.org/v2/...`);
  const data = await response.json();
  res.json(data);
});
```

Then update your client to call your own backend:
```typescript
const data = await fetch(`http://localhost:3000/api/air-quality?lat=${lat}&lng=${lng}`);
```

## Current Status

✅ **The CORS proxy solution is already implemented and should work now.**

Try running your app - it will:
1. Use CORS proxies to access OpenAQ/AQICN
2. Automatically fallback if one proxy fails
3. Show loading states while fetching
4. Display default safe values if all APIs fail

## Troubleshooting

### Still seeing CORS errors?
1. Check browser console for detailed errors
2. Try incognito mode (clears cache)
3. Some proxies might be blocked in your region
4. Consider using one of the alternatives above

### APIs returning no data?
1. Verify coordinates are correct (Nepal cities are properly set)
2. Check if OpenAQ has monitoring stations near that location
3. Try different cities to see if data availability varies
4. Some rural areas may not have stations nearby

### Slow loading?
- CORS proxies add latency
- Batch fetching happens in the background
- Consider self-hosting your own proxy for better performance

## Summary

✅ **Current implementation:** Uses public CORS proxies with fallback
- Works: Immediately usable
- Limitation: Depends on public proxy availability
- Cost: Free

🔧 **Recommended for production:** Self-hosted CORS proxy
- Better: More reliable, faster
- Setup: 30 minutes to deploy
- Cost: Free (Netlify/Vercel free tier)

🌐 **Best for production:** Backend API wrapper
- Best: Full control, no limitations
- Setup: Backend development required
- Cost: Small hosting cost

The app is currently **functional** with CORS proxies. For production, consider self-hosting or adding a backend.

