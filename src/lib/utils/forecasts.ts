/**
 * Forecast generation utilities
 * Generates forecasts based on historical data trends and patterns
 */

import { AirData } from '../types/air-quality';

export interface ForecastPoint {
  hour: string;
  aqi: number;
  pm25: number;
}

export interface ForecastData {
  district?: string;
  hours24: ForecastPoint[];
  hours48: ForecastPoint[];
}

/**
 * Generate forecast data based on current air quality
 * Note: This is a simulation as we don't have real forecast APIs
 */
export function generateForecastData(
  currentData: AirData | null,
  districtName: string,
  baseAqi: number
): ForecastData | null {
  // If we have real current data, use it
  const startingAqi = currentData?.aqi ?? baseAqi;
  const startingPm25 = currentData?.pm25 ?? Math.round(baseAqi * 0.5);
  
  const now = new Date();
  const hours24: ForecastPoint[] = [];
  const hours48: ForecastPoint[] = [];
  
  // Generate 24-hour forecast
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Simulate variation based on time of day
    // Pollution typically peaks during rush hours (morning 7-9, evening 5-7)
    const hourOfDay = time.getHours();
    let variation = 1;
    
    if (hourOfDay >= 7 && hourOfDay <= 9) {
      variation = 1.3; // Morning rush hour
    } else if (hourOfDay >= 17 && hourOfDay <= 19) {
      variation = 1.3; // Evening rush hour
    } else if (hourOfDay >= 0 && hourOfDay <= 6) {
      variation = 0.75; // Night time (better air quality)
    } else if (hourOfDay >= 10 && hourOfDay <= 16) {
      variation = 0.9; // Day time
    }
    
    // Add some randomness to make it more realistic
    const randomFactor = 0.85 + Math.random() * 0.3; // Random between 0.85 and 1.15
    const aqi = Math.round(startingAqi * variation * randomFactor);
    const pm25 = Math.round(startingPm25 * variation * randomFactor);
    
    hours24.push({ hour, aqi, pm25 });
  }
  
  // Generate 48-hour forecast (next day)
  for (let i = 24; i < 48; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const hourOfDay = time.getHours();
    let variation = 1;
    
    if (hourOfDay >= 7 && hourOfDay <= 9) {
      variation = 1.3;
    } else if (hourOfDay >= 17 && hourOfDay <= 19) {
      variation = 1.3;
    } else if (hourOfDay >= 0 && hourOfDay <= 6) {
      variation = 0.75;
    } else if (hourOfDay >= 10 && hourOfDay <= 16) {
      variation = 0.9;
    }
    
    // Slightly better conditions for next day forecast
    const randomFactor = 0.8 + Math.random() * 0.25;
    const aqi = Math.round(startingAqi * variation * randomFactor * 0.9);
    const pm25 = Math.round(startingPm25 * variation * randomFactor * 0.9);
    
    hours48.push({ hour, aqi, pm25 });
  }
  
  return { 
    district: districtName,
    hours24, 
    hours48 
  };
}

/**
 * Get air quality status category from AQI
 */
export function getAqiStatus(aqi: number): 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous' {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

/**
 * Get AQI color for UI
 */
export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-500';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-500';
  return 'bg-red-900';
}

/**
 * Get AQI status label
 */
export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

