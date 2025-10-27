import { OpenWeatherProvider } from './providers/openweather.js';
import { WAQIProvider } from './providers/waqi.js';
import { OpenMeteoProvider } from './providers/openmeteo.js';
import { OpenAQProvider } from './providers/openaq.js';

/**
 * Main service to get air quality data
 * Tries providers in priority order until one succeeds
 */
export async function getAirQuality(params) {
  const { lat, lng, city } = params;
  
  console.log(`🔍 Fetching air quality for ${city}...`);
  
  // Try providers in order of preference
  // 1. OpenWeatherMap (most reliable, good coverage)
  try {
    const openWeatherData = await OpenWeatherProvider.fetchAirData(lat, lng, city);
    if (openWeatherData) {
      console.log(`✅ Got data from OpenWeatherMap for ${city}`);
      return openWeatherData;
    }
  } catch (error) {
    console.warn(`⚠️ OpenWeatherMap failed for ${city}:`, error.message);
  }
  
  // 2. WAQI (World Air Quality Index)
  console.log(`🔄 Trying WAQI for ${city}...`);
  try {
    const waqiData = await WAQIProvider.fetchAirData(lat, lng, city);
    if (waqiData) {
      console.log(`✅ Got data from WAQI for ${city}`);
      return waqiData;
    }
  } catch (error) {
    console.warn(`⚠️ WAQI failed for ${city}:`, error.message);
  }
  
  // 3. Open Meteo (fallback)
  console.log(`🔄 Trying Open-Meteo for ${city}...`);
  try {
    const openMeteoData = await OpenMeteoProvider.fetchAirData(lat, lng, city);
    if (openMeteoData) {
      console.log(`✅ Got data from Open-Meteo for ${city}`);
      return openMeteoData;
    }
  } catch (error) {
    console.warn(`⚠️ Open-Meteo failed for ${city}:`, error.message);
  }
  
  // 4. OpenAQ (last resort)
  console.log(`🔄 Trying OpenAQ for ${city}...`);
  try {
    const openaqData = await OpenAQProvider.fetchAirData(lat, lng, city);
    if (openaqData) {
      console.log(`✅ Got data from OpenAQ for ${city}`);
      return openaqData;
    }
  } catch (error) {
    console.warn(`⚠️ OpenAQ failed for ${city}:`, error.message);
  }
  
  console.error(`❌ All providers failed for ${city}`);
  return null;
}

/**
 * Debug: fetch raw responses from all providers in parallel and return them
 */
export async function debugAirQuality(params) {
  const { lat, lng, city } = params;
  console.log(`🔎 Debug: fetching raw provider responses for ${city}...`);

  const providerCalls = {
    openweather: OpenWeatherProvider.fetchAirData(lat, lng, city, { debug: true }),
    waqi: WAQIProvider.fetchAirData(lat, lng, city, { debug: true }),
    openmeteo: OpenMeteoProvider.fetchAirData(lat, lng, city, { debug: true }),
    openaq: OpenAQProvider.fetchAirData(lat, lng, city, { debug: true })
  };

  const entries = Object.entries(providerCalls);
  const settled = await Promise.allSettled(entries.map(([, p]) => p));

  const results = {};
  for (let i = 0; i < entries.length; i++) {
    const [name] = entries[i];
    const res = settled[i];
    if (res.status === 'fulfilled') {
      results[name] = { ok: true, data: res.value };
    } else {
      results[name] = { ok: false, error: res.reason && res.reason.message ? res.reason.message : String(res.reason) };
    }
  }

  return results;
}

