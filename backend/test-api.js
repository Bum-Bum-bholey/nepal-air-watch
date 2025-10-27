/**
 * Test script to verify backend can fetch from APIs
 */

import dotenv from 'dotenv';
import { getAirQuality } from './services/air-quality-service.js';

dotenv.config();

console.log('🧪 Testing Backend API Integration\n');

// Check environment variables
console.log('📝 Environment Variables:');
console.log(`  OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? '✅ Set' : '❌ Not set'}`);
console.log(`  WAQI_API_TOKEN: ${process.env.WAQI_API_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log(`  PORT: ${process.env.PORT || 3001}`);
console.log('');

// Test fetch for Kathmandu
console.log('🔍 Testing fetch for Kathmandu...\n');

getAirQuality({
  lat: 27.7172,
  lng: 85.3240,
  city: 'Kathmandu'
}).then(data => {
  if (data) {
    console.log('✅ Success!');
    console.log(`   Provider: ${data.provider}`);
    console.log(`   AQI: ${data.aqi}`);
    console.log(`   PM2.5: ${data.pm25}`);
    console.log(`   Temperature: ${data.temperature}°C`);
    console.log(`   Humidity: ${data.humidity}%`);
    console.log(`   Wind Speed: ${data.windSpeed} km/h`);
  } else {
    console.log('❌ Failed: No data returned');
  }
}).catch(error => {
  console.error('❌ Error:', error.message);
});

