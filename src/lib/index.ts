/**
 * Centralized exports for the air quality library
 */

// Types
export type { AirData, ForecastData, Location, SchoolLocation, HealthRecommendation } from './types/air-quality';

// Data
export { nepalCities, nepalDistricts, schoolLocations, healthRecommendations } from './data/nepal-locations';

// Providers (for direct use - prefer using backend client)
// export { getBestAirData, getBatchAirData, AirQualityClient } from './providers/air-quality-client';
// export { OpenAQProvider } from './providers/openaq-provider';
// export { AQICNProvider } from './providers/aqicn-provider';

// Utils
export { 
  generateForecastData, 
  getAqiStatus, 
  getAqiColor, 
  getAqiLabel 
} from './utils/forecasts';

