import axios from 'axios';

/**
 * OpenWeatherMap Air Quality API
 * Requires API key (free tier available)
 * Docs: https://openweathermap.org/api/air-pollution
 */
export class OpenWeatherProvider {
  static get API_KEY() {
    return process.env.OPENWEATHER_API_KEY;
  }
  static BASE_URL = 'https://api.openweathermap.org/data/2.5';
  
  // Using raw pollutant values from OpenWeather (no calibration)

  static async fetchAirData(latitude, longitude, cityName, options = {}) {
    if (!this.API_KEY) {
      console.warn('OpenWeather API key not set');
      return null;
    }
    
    try {
      // Fetch air pollution data
      const airPollutionUrl = `${this.BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}`;
  const pollutionResponse = await axios.get(airPollutionUrl);
      
      if (!pollutionResponse.data || !pollutionResponse.data.list) {
        return null;
      }
      
      const pollution = pollutionResponse.data.list[0];
      const components = pollution.components;
      const aqi = pollution.main.aqi;

  // Use raw pollutant values from OpenWeather
      
      // Fetch current weather data for additional metrics
      let temperature, humidity, windSpeed;
      try {
        const weatherUrl = `${this.BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`;
  const weatherResponse = await axios.get(weatherUrl);
  const weather = weatherResponse.data;
        
        temperature = Math.round(weather.main.temp);
        humidity = weather.main.humidity;
        windSpeed = Math.round(weather.wind.speed * 3.6); // Convert m/s to km/h
      } catch (error) {
        console.warn('Could not fetch weather data from OpenWeather');
      }
      
      // Convert AQI to standard (OpenWeather uses 1-5, we need US standard 0-500)
      // Log raw response data for debugging
      console.log(`OpenWeather raw data for ${cityName}:`, {
        originalAQI: aqi,
        pm25: components.pm2_5,
        pm10: components.pm10,
        no2: components.no2,
        o3: components.o3
      });
      
  // Calculate US AQI based on PM2.5 and PM10 raw values
  const pm25AQI = this.calculatePM25AQI(components.pm2_5);
  const pm10AQI = this.calculatePM10AQI(components.pm10);
      
      // For Nepal, PM2.5 is typically the dominant pollutant
      // Only use PM10 if PM2.5 data is invalid or unavailable
      const aqiUS = !isNaN(pm25AQI) && pm25AQI > 0 ? pm25AQI : pm10AQI;
      
      // Enhanced validation checks
      if (aqiUS > 500 || isNaN(aqiUS)) {
        console.warn(`Calculated AQI ${aqiUS} seems invalid for ${cityName}, using fallback calculation`);
        return this.convertAQIFallback(aqi, components);
      }

      // Validate against typical ranges for the city
      const prevHour = new Date(pollution.dt * 1000);
      console.log(`${cityName} AQI calculation:`, {
        raw_pm25: components.pm2_5,
        raw_pm10: components.pm10,
        final_aqi: aqiUS,
        timestamp: prevHour.toISOString()
      });
      
      // Log the final calculated values
      console.log(`Calculated AQI for ${cityName}:`, {
        final: aqiUS,
        pm25: pm25AQI,
        pm10: pm10AQI
      });

      const result = {
        aqi: aqiUS,
        pm25: Math.round(components.pm2_5),
        pm10: Math.round(components.pm10),
        no2: Math.round(components.no2),
        o3: Math.round(components.o3),
        co: components.co,
        so2: Math.round(components.so2),
        temperature,
        humidity,
        windSpeed,
        provider: 'OpenWeather',
        timestamp: new Date().toISOString(),
        city: cityName,
        coordinates: { lat: latitude, lng: longitude }
      };

      // Include raw API payloads when debug option is set
      if (options && options.debug) {
        result.rawResponse = {
          pollution: pollutionResponse.data,
          weather: typeof weatherResponse !== 'undefined' ? weatherResponse.data : undefined
        };
      }

      return result;
    } catch (error) {
      console.error(`Error fetching OpenWeather data for ${cityName}:`, error.message);
      return null;
    }
  }
  
  // Calculate AQI from PM2.5 concentration using US EPA breakpoints
  static calculatePM25AQI(pm25) {
    if (pm25 <= 0 || isNaN(pm25)) return 0;
    
    // Calibration factor based on comparison with other providers
    // This helps align our values with WAQI/IQAir
    const calibrationFactor = 0.75;
    const adjustedPM25 = pm25 * calibrationFactor;
    
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
    console.log(`Calculating PM2.5 AQI: raw=${pm25}, adjusted=${adjustedPM25}`);
    
    // Find the appropriate breakpoint range using adjusted value
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
  
  // Calculate AQI from PM10 concentration using US EPA breakpoints
  static calculatePM10AQI(pm10) {
    if (pm10 <= 0 || isNaN(pm10)) return 0;
    
    // Calibration factor based on comparison with other providers
    // This helps align our values with WAQI/IQAir
    const calibrationFactor = 0.8;
    const adjustedPM10 = pm10 * calibrationFactor;
    
    // US EPA PM10 breakpoints (μg/m³)
    const breakpoints = [
      { low: 0, high: 54, aqiLow: 0, aqiHigh: 50 },
      { low: 55, high: 154, aqiLow: 51, aqiHigh: 100 },
      { low: 155, high: 254, aqiLow: 101, aqiHigh: 150 },
      { low: 255, high: 354, aqiLow: 151, aqiHigh: 200 },
      { low: 355, high: 424, aqiLow: 201, aqiHigh: 300 },
      { low: 425, high: 504, aqiLow: 301, aqiHigh: 400 },
      { low: 505, high: 604, aqiLow: 401, aqiHigh: 500 }
    ];
    
    // Log values for debugging
    console.log(`Calculating PM10 AQI: raw=${pm10}, adjusted=${adjustedPM10}`);
    
    // Find the appropriate breakpoint range using adjusted value
    const range = breakpoints.find(bp => adjustedPM10 >= bp.low && adjustedPM10 <= bp.high);
    
    if (!range) {
      if (adjustedPM10 < 0) return 0;
      if (adjustedPM10 > 604) return 500;
      return 0; // Default for invalid values
    }
    
    // Calculate AQI using EPA formula with adjusted PM10 value
    return Math.round(
      ((range.aqiHigh - range.aqiLow) / (range.high - range.low)) * 
      (adjustedPM10 - range.low) + range.aqiLow
    );
  }
  
  /**
   * Fallback conversion for when PM2.5/PM10 values are invalid
   * More conservative mapping than before
   */
  static convertAQIFallback(aqi, components) {
    // Only use the severe mappings if we have high pollutant values to confirm
    const hasSeverePollution = 
      components.pm2_5 > 150 || 
      components.pm10 > 350 || 
      components.no2 > 200 || 
      components.o3 > 180;
      
    const aqiMap = {
      1: 30,   // Good
      2: 70,   // Fair
      3: 120,  // Moderate
      4: hasSeverePollution ? 180 : 150,  // Poor (more conservative)
      5: hasSeverePollution ? 300 : 200   // Very Poor (more conservative)
    };
    
    const result = aqiMap[aqi] || 50;
    console.log('Using fallback AQI conversion:', { input: aqi, output: result, hasSeverePollution });
    return result;
  }
}

