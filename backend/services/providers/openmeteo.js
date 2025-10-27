import axios from 'axios';

/**
 * Open-Meteo Air Quality API (Free, no API key required)
 * Docs: https://open-meteo.com/en/docs/air-quality-api
 */
export class OpenMeteoProvider {
  static BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
  
  static async fetchAirData(latitude, longitude, cityName, options = {}) {
    try {
      // Fetch air quality data
      const url = `${this.BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
      
  const response = await axios.get(url);
      
      if (!response.data || !response.data.current) {
        return null;
      }
      
  const current = response.data.current;
      
      // Fetch weather data from Open-Meteo weather API
      let temperature, humidity, windSpeed;
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;
        const weatherResponse = await axios.get(weatherUrl);
        
        if (weatherResponse.data.current) {
          temperature = Math.round(weatherResponse.data.current.temperature_2m);
          humidity = weatherResponse.data.current.relative_humidity_2m;
          windSpeed = Math.round(weatherResponse.data.current.wind_speed_10m);
        }
      } catch (error) {
        console.warn('Could not fetch weather data from Open-Meteo');
      }
      
      const result = {
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
        provider: 'Open-Meteo',
        timestamp: new Date().toISOString(),
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };

      if (options && options.debug) {
        result.rawResponse = response.data;
      }

      return result;
    } catch (error) {
      console.error(`Error fetching Open-Meteo data for ${cityName}:`, error.message);
      return null;
    }
  }
}

