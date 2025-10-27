import { getAirQuality, debugAirQuality } from '../backend/services/air-quality-service.js';

// Vercel Serverless Function wrapper for /api/air-quality
export default async function handler(req, res) {
  try {
    const method = req.method.toUpperCase();

    // Support GET and POST
    let lat, lng, city, debug;
    if (method === 'GET') {
      lat = parseFloat(req.query.lat);
      lng = parseFloat(req.query.lng);
      city = req.query.city || req.query.cityName || 'unknown';
      debug = req.query.debug === 'true' || req.query.debug === '1';
    } else if (method === 'POST') {
      const body = req.body || {};
      lat = parseFloat(body.lat);
      lng = parseFloat(body.lng);
      city = body.city || body.cityName || 'unknown';
      debug = body.debug === true || body.debug === '1';
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Missing or invalid lat/lng parameters' });
    }

    const params = { lat, lng, city };

    if (debug) {
      const result = await debugAirQuality(params);
      return res.json({ debug: true, results: result });
    }

    const data = await getAirQuality(params);
    if (!data) {
      return res.status(502).json({ error: 'No provider returned data' });
    }

    return res.json(data);
  } catch (err) {
    console.error('Serverless handler error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
