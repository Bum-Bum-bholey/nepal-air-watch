import express from 'express';
import { getAirQuality, debugAirQuality } from '../services/air-quality-service.js';

const router = express.Router();

// GET /api/air-quality?lat=27.7172&lng=85.3240&city=Kathmandu
router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    
    if (!lat || !lng || !city) {
      // Log malformed requests for debugging (capture method, url, query, headers, ip)
      try {
        console.warn('Bad request to /api/air-quality - missing params', {
          method: req.method,
          url: req.originalUrl || req.url,
          query: req.query,
          headers: {
            host: req.headers.host,
            origin: req.headers.origin,
            'user-agent': req.headers['user-agent']
          },
          ip: req.ip || req.connection?.remoteAddress
        });
      } catch (logErr) {
        console.warn('Failed to log malformed request details:', logErr && logErr.message);
      }

      return res.status(400).json({ 
        error: 'Missing required parameters: lat, lng, city' 
      });
    }
    
    const debug = req.query.debug === 'true' || req.query.debug === '1';

    if (debug) {
      const debugResults = await debugAirQuality({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city
      });
      return res.json({ debug: true, providers: debugResults });
    }

    const data = await getAirQuality({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city: city
    });

    if (!data) {
      return res.status(404).json({ 
        error: 'No air quality data available for this location' 
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching air quality:', error);
    res.status(500).json({ 
      error: 'Failed to fetch air quality data',
      message: error.message 
    });
  }
});

// Batch endpoint for multiple cities
router.post('/air-quality/batch', async (req, res) => {
  try {
    const { locations } = req.body;
    
    if (!Array.isArray(locations)) {
      return res.status(400).json({ 
        error: 'Expected array of locations' 
      });
    }
    
    const results = {};
    
    // Fetch data for all locations in parallel
    for (const location of locations) {
      const { lat, lng, city } = location;
      
      try {
        const data = await getAirQuality({ lat, lng, city });
        if (data) {
          results[city] = data;
        }
      } catch (error) {
        console.error(`Error fetching data for ${city}:`, error);
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error in batch fetch:', error);
    res.status(500).json({ 
      error: 'Failed to fetch batch air quality data',
      message: error.message 
    });
  }
});

export const airQualityRouter = router;

