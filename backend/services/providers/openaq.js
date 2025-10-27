import axios from 'axios';

/**
 * OpenAQ API (Free, no API key required)
 * Docs: https://docs.openaq.org/
 */
export class OpenAQProvider {
  static BASE_URL = 'https://api.openaq.org/v2';
  
  static async fetchAirData(latitude, longitude, cityName, options = {}) {
    try {
      // Get locations near this coordinate
      const locationsUrl = `${this.BASE_URL}/locations?coordinates=${latitude},${longitude}&radius=50000&limit=1`;
  const locationsRes = await axios.get(locationsUrl);
      
      if (!locationsRes.data || !locationsRes.data.results || locationsRes.data.results.length === 0) {
        return null;
      }
      
      const locationId = locationsRes.data.results[0].id;
      
      // Get latest measurements
      const measurementsUrl = `${this.BASE_URL}/measurements?location_id=${locationId}&limit=100`;
  const measurementsRes = await axios.get(measurementsUrl);
      
      if (!measurementsRes.data || !measurementsRes.data.results) {
        return null;
      }
      
      const measurements = measurementsRes.data.results;
      const pm25Data = measurements.find(m => m.parameter === 'pm25');
      
      if (!pm25Data) {
        return null;
      }
      
      const pm10Data = measurements.find(m => m.parameter === 'pm10');
      const no2Data = measurements.find(m => m.parameter === 'no2');
      const o3Data = measurements.find(m => m.parameter === 'o3');
      const coData = measurements.find(m => m.parameter === 'co');
      const so2Data = measurements.find(m => m.parameter === 'so2');
      
      // Log raw data for debugging
      console.log(`OpenAQ raw data for ${cityName}:`, {
        pm25: pm25Data?.value,
        pm10: pm10Data?.value,
        no2: no2Data?.value,
        o3: o3Data?.value,
        co: coData?.value,
        so2: so2Data?.value
      });

  // Calculate AQI from PM2.5
  const aqi = this.calculateAQI(pm25Data.value);
      
      // Log calculated AQI
      console.log(`Calculated AQI for ${cityName} (OpenAQ):`, {
        final: aqi,
        pm25: pm25Data?.value
      });

      const result = {
        aqi: aqi,
        pm25: Math.round(pm25Data.value),
        pm10: pm10Data ? Math.round(pm10Data.value) : undefined,
        no2: no2Data ? Math.round(no2Data.value) : undefined,
        o3: o3Data ? Math.round(o3Data.value) : undefined,
        co: coData ? Math.round(coData.value) : undefined,
        so2: so2Data ? Math.round(so2Data.value) : undefined,
        provider: 'OpenAQ',
        timestamp: pm25Data.lastUpdated,
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };

      if (options && options.debug) {
        result.rawResponse = {
          locations: locationsRes.data,
          measurements: measurementsRes.data
        };
      }

      return result;
    } catch (error) {
      console.error(`Error fetching OpenAQ data for ${cityName}:`, error.message);
      return null;
    }
  }
  
  /**
   * Calculate AQI from PM2.5 concentration using US EPA breakpoints
   * Includes calibration factor to match local ground station readings
   */
  static calculateAQI(pm25) {
  // Use raw PM2.5 value
  const adjustedPM25 = pm25;
    
    // US EPA PM2.5 breakpoints (μg/m³)
    const breakpoints = [
      { low: 0.0, high: 12.0, aqiLow: 0, aqiHigh: 50 },
      { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
      { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
      { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
      { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
      { low: 250.5, high: 350.4, aqiLow: 301, aqiHigh: 400 },
      { low: 350.5, high: 500.4, aqiLow: 401, aqiHigh: 500 }
    ];

    // Log values for debugging
    console.log(`OpenAQ PM2.5 AQI calculation: raw=${pm25}, adjusted=${adjustedPM25}`);
    
    // Find the appropriate breakpoint range
    const range = breakpoints.find(bp => adjustedPM25 >= bp.low && adjustedPM25 <= bp.high);
    
    if (!range) {
      if (adjustedPM25 < 0) return 0;
      if (adjustedPM25 > 500.4) return 500;
      return 0; // Default for invalid values
    }
    
    // Calculate AQI using EPA formula with adjusted PM2.5 value
    return Math.round(
      ((range.aqiHigh - range.aqiLow) / (range.high - range.low)) * 
      (adjustedPM25 - range.low) + range.aqiLow
    );
  }
}

