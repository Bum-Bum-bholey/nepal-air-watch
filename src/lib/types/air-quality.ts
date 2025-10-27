/**
 * TypeScript interfaces for air quality data structures
 */

export interface AirData {
  aqi: number;
  pm25: number;
  pm10?: number;
  no2?: number;
  o3?: number;
  co?: number;
  so2?: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  provider: string;
  timestamp: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ForecastData {
  date: string;
  aqi: number;
  pm25: number;
  status: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  confidence?: number;
}

export interface Location {
  id: number;
  city: string;
  district?: string;
  province: string;
  lat: number;
  lng: number;
  aqi?: number; // Fallback AQI if API fails
}

export interface SchoolLocation extends Location {
  name: string;
  type: 'primary' | 'secondary' | 'college' | 'university';
}

export interface HealthRecommendation {
  title: string;
  description: string;
  actions: string[];
}

