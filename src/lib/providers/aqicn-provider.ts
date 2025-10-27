/**
 * AQICN Provider - Fallback air quality API
 * Some public endpoints don't require API keys
 */

import { AirData } from '../types/air-quality';

interface AQICNData {
  aqi: number;
  city: {
    geo: [number, number];
    name: string;
  };
  iaqi: {
    pm25?: { v: number };
    pm10?: { v: number };
    no2?: { v: number };
    o3?: { v: number };
    co?: { v: number };
    so2?: { v: number };
  };
  time: {
    s: string;
  };
}

export class AQICNProvider {
  // CORS proxy for AQICN
  private static readonly CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/get?url=',
  ];
  
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
   * Try to fetch data from AQICN (as fallback)
   * Note: Some endpoints may have rate limits
   */
  static async fetchAirData(
    latitude: number,
    longitude: number,
    cityName: string
  ): Promise<AirData | null> {
    try {
      // AQICN geolocalized feed
      const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/`;
      
      const response = await this.fetchWithProxy(url);
      
      if (!response.ok) {
        console.warn(`AQICN: Request failed for ${cityName}`);
        return null;
      }
      
      let data = await response.json();
      
      // Handle allorigins wrapper
      if (data.status && data.contents) {
        data = JSON.parse(data.contents);
      }
      
      if (data.status !== 'ok' || !data.data) {
        return null;
      }
      
      const aqiData: AQICNData = data.data;
      
      return {
        aqi: aqiData.aqi,
        pm25: aqiData.iaqi?.pm25?.v,
        pm10: aqiData.iaqi?.pm10?.v,
        no2: aqiData.iaqi?.no2?.v,
        o3: aqiData.iaqi?.o3?.v,
        co: aqiData.iaqi?.co?.v,
        so2: aqiData.iaqi?.so2?.v,
        provider: 'AQICN',
        timestamp: aqiData.time.s,
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };
    } catch (error) {
      console.error(`Error fetching data from AQICN for ${cityName}:`, error);
      return null;
    }
  }
}

