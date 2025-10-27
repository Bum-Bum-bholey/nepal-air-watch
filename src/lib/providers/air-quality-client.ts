/**
 * Unified Air Quality Client
 * Tries multiple providers in order and returns the first successful result
 */

import { AirData } from '../types/air-quality';
import { OpenAQProvider } from './openaq-provider';
import { AQICNProvider } from './aqicn-provider';

export class AirQualityClient {
  /**
   * Get the best available air quality data for a location
   * Tries providers in order until one succeeds
   */
  static async getBestAirData(params: {
    lat: number;
    lon: number;
    city: string;
  }): Promise<AirData | null> {
    const { lat, lon, city } = params;
    
    // Try OpenAQ first (most reliable free provider)
    const openaqData = await OpenAQProvider.fetchAirData(lat, lon, city);
    if (openaqData) {
      console.log(`✅ Got data from OpenAQ for ${city}`);
      return openaqData;
    }
    
    // Fallback to AQICN
    console.log(`⚠️ OpenAQ failed for ${city}, trying AQICN...`);
    const aqicnData = await AQICNProvider.fetchAirData(lat, lon, city);
    if (aqicnData) {
      console.log(`✅ Got data from AQICN for ${city}`);
      return aqicnData;
    }
    
    // If all providers fail, return null
    console.warn(`❌ All providers failed for ${city}`);
    return null;
  }
  
  /**
   * Batch fetch data for multiple cities
   */
  static async getBatchAirData(
    locations: Array<{ lat: number; lon: number; city: string }>
  ): Promise<Map<string, AirData>> {
    const results = new Map<string, AirData>();
    
    // Fetch in parallel but limit concurrency to avoid overwhelming APIs
    const batchSize = 3;
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize);
      const promises = batch.map(loc =>
        this.getBestAirData(loc).then(data => ({
          city: loc.city,
          data
        }))
      );
      
      const batchResults = await Promise.all(promises);
      
      for (const { city, data } of batchResults) {
        if (data) {
          results.set(city, data);
        }
      }
      
      // Small delay between batches to be respectful to APIs
      if (i + batchSize < locations.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  }
}

// Export for convenience
export const getBestAirData = AirQualityClient.getBestAirData;
export const getBatchAirData = AirQualityClient.getBatchAirData;

