/**
 * Backend API Client
 * Connects frontend to the Express backend server
 */

import type { AirData } from '../types/air-quality';

// Default to same-origin when VITE_BACKEND_URL is not set (works on Vercel)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? '';

export class BackendClient {
  /**
   * Get air quality data for a location
   */
  static async getAirQuality(params: {
    lat: number;
    lng: number;
    city: string;
  }): Promise<AirData | null> {
    try {
      const { lat, lng, city } = params;
      const response = await fetch(
        `${BACKEND_URL}/api/air-quality?lat=${lat}&lng=${lng}&city=${encodeURIComponent(city)}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data from backend for ${params.city}:`, error);
      return null;
    }
  }
  
  /**
   * Get batch air quality data for multiple cities
   */
  static async getBatchAirQuality(
    locations: Array<{ lat: number; lng: number; city: string }>
  ): Promise<Record<string, AirData>> {
    const results: Record<string, AirData> = {};
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/air-quality/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locations }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Data is already in object format
        return data;
      }
    } catch (error) {
      console.error('Error fetching batch data from backend:', error);
    }
    
    return results;
  }
}

// Export for convenience - USE THESE instead of old providers
export const getBestAirData = BackendClient.getAirQuality;
export const getBatchAirData = BackendClient.getBatchAirQuality;

