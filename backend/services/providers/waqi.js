import axios from 'axios';

/**
 * WAQI (World Air Quality Index) API
 * Requires API key (free tier available)
 * Docs: https://aqicn.org/api/
 */
export class WAQIProvider {
  static get API_TOKEN() {
    return process.env.WAQI_API_KEY;  // Note: Using WAQI_API_KEY to match our .env file
  }
  static BASE_URL = 'https://api.waqi.info';
  
  static async fetchAirData(latitude, longitude, cityName, options = {}) {
    if (!this.API_TOKEN) {
      console.warn('WAQI API token not set');
      return null;
    }
    
    try {
      // Try to get station for this location
      const feedUrl = `${this.BASE_URL}/feed/geo:${latitude};${longitude}/?token=${this.API_TOKEN}`;
      const response = await axios.get(feedUrl);
      
      if (response.data.status !== 'ok' || !response.data.data) {
        return null;
      }
      
    const data = response.data.data;
    const aqi = data.aqi;
    const iaqi = data.iaqi || {};
    const weather = data.iaqi || {};

    // Extract PM2.5, PM10, etc. (no calibration)
    const pm25 = iaqi.pm25?.v;
    const pm10 = iaqi.pm10?.v;
    const no2 = iaqi.no2?.v;
    const o3 = iaqi.o3?.v;
    const co = iaqi.co?.v;
    const so2 = iaqi.so2?.v;
      
      // Weather data is not directly available from WAQI for geolocated feed
      // We'll set defaults or fetch separately if needed
      
      const result = {
        aqi: aqi,
        pm25: pm25 ? Math.round(pm25) : undefined,
        pm10: pm10 ? Math.round(pm10) : undefined,
        no2: no2 ? Math.round(no2) : undefined,
        o3: o3 ? Math.round(o3) : undefined,
        co: co,
        so2: so2 ? Math.round(so2) : undefined,
        provider: 'WAQI',
        timestamp: data.time?.s || new Date().toISOString(),
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };

      if (options && options.debug) {
        result.rawResponse = response.data;
      }

      return result;
    } catch (error) {
      console.error(`Error fetching WAQI data for ${cityName}:`, error.message);
      return null;
    }
  }
}

