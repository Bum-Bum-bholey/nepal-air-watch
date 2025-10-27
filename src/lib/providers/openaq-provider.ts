/**
 * OpenAQ Provider - Free air quality API without authentication
 * Documentation: https://docs.openaq.org/
 */

import { AirData } from '../types/air-quality';

interface OpenAQMeasurement {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  location: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface OpenAQResponse {
  results: OpenAQMeasurement[];
  meta: {
    found: number;
    license: string;
    website: string;
  };
}

export class OpenAQProvider {
  private static readonly BASE_URL = 'https://api.openaq.org/v2';
  // CORS proxy to bypass CORS restrictions (public proxy services)
  private static readonly CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/get?url=',
    'https://cors-anywhere.herokuapp.com/'
  ];
  
  /**
   * Fetch with CORS proxy support
   */
  private static async fetchWithProxy(url: string, proxyIndex: number = 0): Promise<Response> {
    if (proxyIndex >= this.CORS_PROXIES.length) {
      throw new Error('All CORS proxies failed');
    }
    
    const proxy = this.CORS_PROXIES[proxyIndex];
    let fullUrl = url;
    
    if (proxy.includes('allorigins')) {
      fullUrl = `${proxy}${encodeURIComponent(url)}`;
    } else {
      fullUrl = `${proxy}${url}`;
    }
    
    try {
      const res = await fetch(fullUrl);
      if (!res.ok && proxyIndex < this.CORS_PROXIES.length - 1) {
        return this.fetchWithProxy(url, proxyIndex + 1);
      }
      return res;
    } catch (error) {
      if (proxyIndex < this.CORS_PROXIES.length - 1) {
        return this.fetchWithProxy(url, proxyIndex + 1);
      }
      throw error;
    }
  }
  
  /**
   * Fetch latest air quality data for a location
   */
  static async fetchAirData(
    latitude: number,
    longitude: number,
    cityName: string
  ): Promise<AirData | null> {
    try {
      // First, get locations near this coordinate
      const locationsUrl = `${this.BASE_URL}/locations?coordinates=${latitude},${longitude}&radius=50000&limit=1`;
      const locationsRes = await this.fetchWithProxy(locationsUrl);
      
      if (!locationsRes.ok) {
        console.warn(`OpenAQ: Locations not found for ${cityName}`);
        return null;
      }
      
      let locationsData = await locationsRes.json();
      
      // Handle allorigins wrapper
      if (locationsData.status && locationsData.contents) {
        locationsData = JSON.parse(locationsData.contents);
      }
      
      if (!locationsData.results || locationsData.results.length === 0) {
        console.warn(`OpenAQ: No nearby locations for ${cityName}`);
        return null;
      }
      
      const locationId = locationsData.results[0].id;
      
      // Fetch latest measurements for this location
      const measurementsUrl = `${this.BASE_URL}/measurements?location_id=${locationId}&limit=100`;
      const measurementsRes = await this.fetchWithProxy(measurementsUrl);
      
      if (!measurementsRes.ok) {
        console.warn(`OpenAQ: Failed to fetch measurements for ${cityName}`);
        return null;
      }
      
      let data: OpenAQResponse = await measurementsRes.json();
      
      // Handle allorigins wrapper
      if (data.status && (data as any).contents) {
        data = JSON.parse((data as any).contents);
      }
      
      if (!data.results || data.results.length === 0) {
        return null;
      }
      
      // Parse measurements into our format
      const measurements = data.results;
      const pm25Data = measurements.find(m => m.parameter === 'pm25');
      const pm10Data = measurements.find(m => m.parameter === 'pm10');
      const no2Data = measurements.find(m => m.parameter === 'no2');
      const o3Data = measurements.find(m => m.parameter === 'o3');
      const coData = measurements.find(m => m.parameter === 'co');
      const so2Data = measurements.find(m => m.parameter === 'so2');
      
      if (!pm25Data) {
        console.warn(`OpenAQ: No PM2.5 data for ${cityName}`);
        return null;
      }
      
      // Calculate AQI from PM2.5 (using US EPA standard)
      const aqi = this.calculateAQI(pm25Data.value);
      
      const latestTimestamp = pm25Data.lastUpdated;
      
      // Get weather data from coordinates (using free weather API as fallback)
      let temperature: number | undefined;
      let humidity: number | undefined;
      let windSpeed: number | undefined;
      
      try {
        // Try to get weather data from Open-Meteo (free, no API key)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          if (weatherData.current) {
            temperature = Math.round(weatherData.current.temperature_2m);
            humidity = weatherData.current.relative_humidity_2m;
            windSpeed = Math.round(weatherData.current.wind_speed_10m);
          }
        }
      } catch (error) {
        console.warn('Could not fetch weather data:', error);
      }
      
      return {
        aqi,
        pm25: Math.round(pm25Data.value),
        pm10: pm10Data ? Math.round(pm10Data.value) : undefined,
        no2: no2Data ? Math.round(no2Data.value) : undefined,
        o3: o3Data ? Math.round(o3Data.value) : undefined,
        co: coData ? Math.round(coData.value) : undefined,
        so2: so2Data ? Math.round(so2Data.value) : undefined,
        temperature,
        humidity,
        windSpeed,
        provider: 'OpenAQ',
        timestamp: latestTimestamp,
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };
    } catch (error) {
      console.error(`Error fetching data from OpenAQ for ${cityName}:`, error);
      return null;
    }
  }
  
  /**
   * Calculate AQI from PM2.5 concentration (US EPA standard)
   */
  private static calculateAQI(pm25: number): number {
    // US EPA AQI breakpoints for PM2.5
    const breakpoints = [
      { min: 0, max: 12, aqiMin: 0, aqiMax: 50 },      // Good
      { min: 12, max: 35.4, aqiMin: 51, aqiMax: 100 }, // Moderate
      { min: 35.4, max: 55.4, aqiMin: 101, aqiMax: 150 }, // Unhealthy for Sensitive
      { min: 55.4, max: 150.4, aqiMin: 151, aqiMax: 200 }, // Unhealthy
      { min: 150.4, max: 250.4, aqiMin: 201, aqiMax: 300 }, // Very Unhealthy
      { min: 250.4, max: 500.4, aqiMin: 301, aqiMax: 500 }, // Hazardous
    ];
    
    for (const bp of breakpoints) {
      if (pm25 >= bp.min && pm25 <= bp.max) {
        const aqi = ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * (pm25 - bp.min) + bp.aqiMin;
        return Math.round(aqi);
      }
    }
    
    // If beyond hazardous
    return 400;
  }
}

