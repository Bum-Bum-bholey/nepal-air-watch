/**
 * Direct Open-Meteo client for frontend fallback
 * Used when backend API is unavailable
 */

import type { AirData } from '../types/air-quality';

export class OpenMeteoProvider {
  static readonly BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  static readonly WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

  static async getAirQuality(params: {
    lat: number;
    lng: number;
    city: string;
  }): Promise<AirData | null> {
    try {
      const { lat, lng, city } = params;
      
      // Fetch air quality data
      const aqUrl = `${this.BASE_URL}?latitude=${lat}&longitude=${lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
      const aqResponse = await fetch(aqUrl);
      const aqData = await aqResponse.json();

      if (!aqData?.current) {
        return null;
      }

      const current = aqData.current;

      // Fetch weather data
      let temperature, humidity, windSpeed;
      try {
        const weatherUrl = `${this.WEATHER_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData?.current) {
          temperature = Math.round(weatherData.current.temperature_2m);
          humidity = weatherData.current.relative_humidity_2m;
          windSpeed = Math.round(weatherData.current.wind_speed_10m);
        }
      } catch (error) {
        console.warn('Could not fetch weather data from Open-Meteo');
      }

      return {
        aqi: Math.round(current.us_aqi),
        pm25: Math.round(current.pm2_5),
        pm10: Math.round(current.pm10),
        co: current.carbon_monoxide,
        no2: current.nitrogen_dioxide,
        so2: current.sulphur_dioxide,
        o3: current.ozone,
        temperature,
        humidity,
        windSpeed,
        provider: 'Open-Meteo (Fallback)',
        timestamp: new Date().toISOString(),
        city,
        coordinates: { lat, lng }
      };
    } catch (error) {
      console.error(`Error fetching Open-Meteo data for ${params.city}:`, error);
      return null;
    }
  }

  static async getBatchAirQuality(
    locations: Array<{ lat: number; lng: number; city: string }>
  ): Promise<Record<string, AirData>> {
    const results: Record<string, AirData> = {};
    
    // Fetch data for each location in parallel
    const promises = locations.map(location => this.getAirQuality(location));
    const airDataArray = await Promise.all(promises);

    // Build results object
    locations.forEach((location, index) => {
      const airData = airDataArray[index];
      if (airData) {
        results[location.city] = airData;
      }
    });

    return results;
  }
}